import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatsApi, messagesApi } from '@/db/api';
import { geminiService } from '@/services/gemini';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Menu, X, RotateCcw, Sparkles } from 'lucide-react';
import type { Chat, Message } from '@/types/types';

export default function ChatPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const userScrolledRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (profile) {
      loadChats();
    }
  }, [profile]);

  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (!userScrolledRef.current) {
      scrollToBottom('smooth');
    }
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (isStreaming) {
      userScrolledRef.current = false;
    }
  }, [isStreaming]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;

    if (scrollTop < lastScrollTopRef.current && !isAtBottom) {
      userScrolledRef.current = true;
    } else if (isAtBottom) {
      userScrolledRef.current = false;
    }

    lastScrollTopRef.current = scrollTop;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  const loadChats = async () => {
    if (!profile) return;
    const userChats = await chatsApi.getUserChats(profile.id);
    setChats(userChats);

    if (userChats.length > 0 && !currentChatId) {
      setCurrentChatId(userChats[0].id);
    }
  };

  const loadMessages = async (chatId: string) => {
    const chatMessages = await messagesApi.getChatMessages(chatId);
    setMessages(chatMessages);
    userScrolledRef.current = false;
    setTimeout(() => scrollToBottom('auto'), 100);
  };

  const handleNewChat = async () => {
    if (!profile) return;

    const newChat = await chatsApi.createChat(profile.id);
    if (newChat) {
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    const success = await chatsApi.updateChatTitle(chatId, newTitle);
    if (success) {
      setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat)));
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const success = await chatsApi.deleteChat(chatId);
    if (success) {
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);

      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id);
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      }

      toast({
        title: 'Success',
        description: 'Chat deleted successfully',
      });
    }
  };

  const handleSendMessage = async (content: string, imageData: string | null) => {
    if (!currentChatId || !profile) {
      const newChat = await chatsApi.createChat(profile!.id);
      if (newChat) {
        setChats([newChat, ...chats]);
        setCurrentChatId(newChat.id);
        await sendMessageToChat(newChat.id, content, imageData);
      }
      return;
    }

    await sendMessageToChat(currentChatId, content, imageData);
  };

  const sendMessageToChat = async (chatId: string, content: string, imageData: string | null) => {
    const userMessage = await messagesApi.createMessage(chatId, 'user', content, imageData);
    if (!userMessage) return;

    setMessages((prev) => [...prev, userMessage]);
    userScrolledRef.current = false;

    if (messages.length === 0) {
      const firstWords = content.split(' ').slice(0, 5).join(' ');
      await chatsApi.updateChatTitle(chatId, firstWords);
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, title: firstWords } : chat))
      );
    }

    setIsStreaming(true);
    setStreamingMessage('');

    const conversationHistory = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
      imageData: msg.image_data,
    }));

    const geminiContents = geminiService.convertToGeminiFormat(conversationHistory);

    abortControllerRef.current = new AbortController();

    let fullResponse = '';

    await geminiService.streamChat(
      geminiContents,
      (chunk) => {
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      },
      async () => {
        setIsStreaming(false);
        const assistantMessage = await messagesApi.createMessage(chatId, 'assistant', fullResponse);
        if (assistantMessage) {
          setMessages((prev) => [...prev, assistantMessage]);
          setStreamingMessage('');
        }
        userScrolledRef.current = false;
        scrollToBottom('smooth');
      },
      (error) => {
        setIsStreaming(false);
        setStreamingMessage('');
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
      },
      abortControllerRef.current.signal
    );
  };

  const handleRegenerateResponse = async () => {
    if (!currentChatId || messages.length === 0) return;

    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }
    
    if (lastUserMessageIndex === -1) return;

    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1);

    setMessages(messagesToKeep);
    setIsStreaming(true);
    setStreamingMessage('');
    userScrolledRef.current = false;

    const conversationHistory = messagesToKeep.map((msg) => ({
      role: msg.role,
      content: msg.content,
      imageData: msg.image_data,
    }));

    const geminiContents = geminiService.convertToGeminiFormat(conversationHistory);

    abortControllerRef.current = new AbortController();

    let fullResponse = '';

    await geminiService.streamChat(
      geminiContents,
      (chunk) => {
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      },
      async () => {
        setIsStreaming(false);
        const assistantMessage = await messagesApi.createMessage(
          currentChatId,
          'assistant',
          fullResponse
        );
        if (assistantMessage) {
          setMessages([...messagesToKeep, assistantMessage]);
          setStreamingMessage('');
        }
        userScrolledRef.current = false;
        scrollToBottom('smooth');
      },
      (error) => {
        setIsStreaming(false);
        setStreamingMessage('');
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
      },
      abortControllerRef.current.signal
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 overflow-hidden xl:w-80`}
      >
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-border p-4 flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="xl:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold gradient-text">Zento AI</h1>
            </div>
          </div>

          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateResponse}
              disabled={isStreaming}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          )}
        </div>

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 scroll-smooth"
        >
          {messages.length === 0 && !isStreaming ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-2xl mx-auto p-8">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold gradient-text">Welcome to Zento AI</h2>
                <p className="text-muted-foreground text-lg">
                  Your intelligent assistant for natural conversations, code assistance, and image
                  analysis. Ask me anything in Uzbek, English, Russian, or any other language!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold mb-2">💬 Natural Conversations</h3>
                    <p className="text-sm text-muted-foreground">
                      Chat naturally in multiple languages with context-aware responses
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold mb-2">💻 Code Assistant</h3>
                    <p className="text-sm text-muted-foreground">
                      Get help with bug fixes, code generation, and explanations
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold mb-2">🖼️ Image Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload images for analysis and understanding
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold mb-2">⚡ Fast & Accurate</h3>
                    <p className="text-sm text-muted-foreground">
                      Get quick, logical responses without hallucinations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isStreaming && streamingMessage && (
                <ChatMessage
                  message={{
                    id: 'streaming',
                    chat_id: currentChatId || '',
                    role: 'assistant',
                    content: streamingMessage,
                    image_data: null,
                    created_at: new Date().toISOString(),
                  }}
                  isStreaming
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background sticky bottom-0">
          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
