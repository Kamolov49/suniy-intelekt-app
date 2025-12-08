import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types/types';
import { cn } from '@/lib/utils';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [renderedContent, setRenderedContent] = useState('');

  useEffect(() => {
    if (message.role === 'assistant') {
      const parseMarkdown = async () => {
        const html = await marked.parse(message.content);
        setRenderedContent(html);
      };
      parseMarkdown();
    } else {
      setRenderedContent(message.content);
    }
  }, [message.content, message.role]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: 'Copied',
        description: 'Message copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy message',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={cn(
        'flex gap-4 p-6 rounded-xl animate-fade-in',
        message.role === 'user' ? 'bg-muted/50' : 'bg-card border border-border'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          message.role === 'user' ? 'bg-primary/10' : 'bg-gradient-primary'
        )}
      >
        {message.role === 'user' ? (
          <User className="w-5 h-5 text-primary" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            {message.role === 'user' ? 'You' : 'Zento AI'}
          </span>
          {!isStreaming && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {message.image_data && (
          <div className="rounded-lg overflow-hidden border border-border max-w-md">
            <img
              src={message.image_data}
              alt="Uploaded"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        )}

        {message.role === 'assistant' ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none markdown-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        ) : (
          <p className="text-foreground whitespace-pre-wrap break-words">{renderedContent}</p>
        )}

        {isStreaming && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
