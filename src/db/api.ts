import { supabase } from './supabase';
import type { Chat, Message, Profile, FileRecord } from '@/types/types';

export const profilesApi = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    return true;
  },
};

export const chatsApi = {
  async getUserChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async createChat(userId: string, title = 'New Chat'): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: userId, title })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating chat:', error);
      return null;
    }
    return data;
  },

  async updateChatTitle(chatId: string, title: string): Promise<boolean> {
    const { error } = await supabase
      .from('chats')
      .update({ title })
      .eq('id', chatId);

    if (error) {
      console.error('Error updating chat title:', error);
      return false;
    }
    return true;
  },

  async deleteChat(chatId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
    return true;
  },
};

export const messagesApi = {
  async getChatMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async createMessage(
    chatId: string,
    role: 'user' | 'assistant',
    content: string,
    imageData: string | null = null
  ): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role,
        content,
        image_data: imageData,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating message:', error);
      return null;
    }
    return data;
  },

  async deleteMessage(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }
    return true;
  },
};

export const filesApi = {
  async uploadFile(
    userId: string,
    file: File,
    messageId: string | null = null
  ): Promise<FileRecord | null> {
    const fileName = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    
    const { error: uploadError } = await supabase.storage
      .from('app-83hdwq5lhuyp_chat_images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    const { data: fileRecord, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        message_id: messageId,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
      })
      .select()
      .maybeSingle();

    if (dbError) {
      console.error('Error creating file record:', dbError);
      return null;
    }

    return fileRecord;
  },

  async getFileUrl(filePath: string): Promise<string | null> {
    const { data } = supabase.storage
      .from('app-83hdwq5lhuyp_chat_images')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  },

  async deleteFile(fileId: string, filePath: string): Promise<boolean> {
    const { error: storageError } = await supabase.storage
      .from('app-83hdwq5lhuyp_chat_images')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }

    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('Error deleting file record:', dbError);
      return false;
    }

    return true;
  },
};
