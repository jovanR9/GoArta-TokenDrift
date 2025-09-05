import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  userId: string | null;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'user' | 'ai';
  content: string;
  createdAt: string;
}

/**
 * Creates a new conversation in the database
 */
export async function createConversation(title: string, userId: string | null = null): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          id: uuidv4(),
          user_id: userId,
          title,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data as Conversation;
  } catch (error) {
    console.error('Exception creating conversation:', error);
    return null;
  }
}

/**
 * Gets a conversation by ID
 */
export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    return data as Conversation;
  } catch (error) {
    console.error('Exception fetching conversation:', error);
    return null;
  }
}

/**
 * Gets all conversations
 */
export async function getAllConversations(): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data as Conversation[];
  } catch (error) {
    console.error('Exception fetching conversations:', error);
    return [];
  }
}

/**
 * Updates a conversation's title or timestamp
 */
export async function updateConversation(
  id: string,
  updates: Partial<Pick<Conversation, 'title' | 'updatedAt'>>
): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating conversation:', error);
      return null;
    }

    return data as Conversation;
  } catch (error) {
    console.error('Exception updating conversation:', error);
    return null;
  }
}

/**
 * Adds a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  senderType: 'user' | 'ai',
  content: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          id: uuidv4(),
          conversation_id: conversationId,
          sender_type: senderType,
          content,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }

    return data as Message;
  } catch (error) {
    console.error('Exception adding message:', error);
    return null;
  }
}

/**
 * Gets all messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data as Message[];
  } catch (error) {
    console.error('Exception fetching messages:', error);
    return [];
  }
}