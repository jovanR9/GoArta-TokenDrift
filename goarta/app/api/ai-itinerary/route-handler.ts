import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Initialize Langchain LLM (using a placeholder for now)
    // You'll need to configure your Google API key
    const chat = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: process.env.GOOGLE_API_KEY, // Make sure to set this environment variable
      temperature: 0.7,
    });

    const response = await chat.invoke([
      new SystemMessage('You are a helpful AI assistant that helps plan travel itineraries.'),
      new HumanMessage(message),
    ]);

    return NextResponse.json({ aiResponse: response.content });
  } catch (error) {
    console.error('Langchain API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}