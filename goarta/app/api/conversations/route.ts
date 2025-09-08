import { NextRequest, NextResponse } from 'next/server';
import { getConversation, getMessages, createConversation, getAllConversations } from '@/lib/services/conversationService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('id');

  // If no conversation ID is provided, return list of all conversations
  if (!conversationId) {
    try {
      const conversations = await getAllConversations();
      return NextResponse.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
  }

  try {
    // Get conversation details
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get all messages for this conversation
    const messages = await getMessages(conversationId);

    // Format messages for the frontend
    const formattedMessages = messages.map(msg => ({
      type: msg.senderType === 'user' ? 'user' : 'ai',
      text: msg.content,
    }));

    return NextResponse.json({
      conversation,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    
    const conversation = await createConversation(title || 'New Conversation');
    
    if (!conversation) {
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
    
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
