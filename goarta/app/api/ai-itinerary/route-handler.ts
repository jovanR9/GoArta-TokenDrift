import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, BaseMessage, AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { BufferWindowMemory } from 'langchain/memory';
import { createConversation, addMessage, updateConversation, getConversation } from '@/lib/services/conversationService';

interface Event {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
}

// ------------------ SaveItinerary Tool ------------------
const SaveItinerarySchema = z.object({
  title: z.string().describe('The title of the itinerary.'),
  destination: z.string().describe('The travel destination.'),
  duration_days: z.number().int().describe('The duration of the trip in days.'),
  travel_style: z.string().describe(
    "The style of travel (e.g., adventurous, relaxed, cultural, budget-friendly)."
  ),
  budget_range: z.string().describe(
    "The budget range for the trip (e.g., 'low', 'medium', 'high', '$500-$1000')."
  ),
});

class SaveItineraryTool extends StructuredTool<typeof SaveItinerarySchema> {
  name = 'save_itinerary';
  description =
    'Saves a generated travel itinerary to the database. Provide all parameters: title, destination, duration_days, travel_style, and budget_range.';
  schema = SaveItinerarySchema;

  constructor() {
    super();
  }

  async _call({
    title,
    destination,
    duration_days,
    travel_style,
    budget_range,
  }: z.infer<typeof this.schema>) {
    try {
      const { data, error } = await supabase.from('itineraries').insert([
        {
          title,
          destination,
          duration_days,
          travel_style,
          budget_range,
          user_id: null,
        },
      ]);

      if (error) {
        console.error('Error saving itinerary to Supabase:', error);
        return `Failed to save itinerary: ${error.message}`;
      }
      console.log('Itinerary saved to Supabase:', data);
      return 'Itinerary successfully saved to the database.';
    } catch (e: unknown) {
      console.error('Exception in save_itinerary tool:', e);
      return `An error occurred while saving the itinerary: ${(e as Error).message}`;
    }
  }
}
const saveItineraryTool = new SaveItineraryTool();

// ------------------ FetchEvents Tool ------------------
const FetchEventsSchema = z.object({});

class FetchEventsTool extends StructuredTool<typeof FetchEventsSchema> {
  name = 'fetch_events';
  description =
    'Fetches a list of upcoming events in Goa from the database. Use this tool to answer questions about events, suggest activities, or incorporate events into a travel itinerary.';
  schema = FetchEventsSchema;

  constructor() {
    super();
  }

  async _call({}: z.infer<typeof this.schema>) {
    try {
      const { data, error } = await supabase.from('events').select('*');

      if (error) {
        console.error('Error fetching events from Supabase:', error);
        return `Failed to fetch events: ${error.message}`;
      }

      const eventsString = (data ?? [])
        .map(
          (event: Event) =>
            `Event: ${event.title}\nDescription: ${event.description}\nDate: ${event.event_date}\nTime: ${event.event_time}\nLocation: ${event.location}\nCategory: ${event.category}`
        )
        .join('\n\n');

      return eventsString
        ? `Here are some upcoming events in Goa:\n${eventsString}`
        : 'No upcoming events found in the database.';
    } catch (e: unknown) {
      console.error('Exception in fetch_events tool:', e);
      return `An error occurred while fetching events: ${(e as Error).message}`;
    }
  }
}
const fetchEventsTool = new FetchEventsTool();

// ------------------ API Route ------------------
export async function POST(req: NextRequest) {
  try {
    const { message, history: rawHistory, currentDateTime, conversationId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tools = [saveItineraryTool, fetchEventsTool];

    const chat = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    }).bindTools(tools);

    const memory = new BufferWindowMemory({
      k: 9,
      returnMessages: true,
      memoryKey: 'history',
      inputKey: 'input',
      outputKey: 'output',
    });

    // Handle conversation creation or retrieval
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      // Create a new conversation with a default title (will be updated later)
      const conversation = await createConversation('New Conversation');
      if (conversation) {
        currentConversationId = conversation.id;
      }
    }

    // Restore history if provided
    if (rawHistory && Array.isArray(rawHistory)) {
      const messagesToAdd: BaseMessage[] = rawHistory.map((msg: { type: 'user' | 'ai'; text: string }) => {
        if (msg.type === 'user') return new HumanMessage(msg.text);
        if (msg.type === 'ai') return new AIMessage(msg.text);
        // Fallback for unexpected types, though ideally this shouldn't happen with proper type checking upstream
        return new AIMessage(`Error: Could not parse previous message of type ${msg.type}`);
      });
      await memory.chatHistory.addMessages(messagesToAdd);
    }

    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(`Current Date and Time: ${currentDateTime}
        You are GoaGuide, a passionate and knowledgeable travel companion specializing in creating unforgettable experiences across Goa! 🌴✨

        ## Core Personality Traits
        - 🔍 Curious Explorer – love hidden treasures
        - 🤗 Friendly Guide – talk like a local friend
        - 📝 Detail-Oriented – remember preferences
        - 🔄 Flexible Planner – always have backups
        - 🛡️ Safety-Conscious – weave in tips
        - 📚 Cultural Storyteller – share history & legends

        ## Communication Style
        - Use emojis warmly
        - Write like texting a friend
        - Keep spacing clean
        - Stay upbeat, avoid jargon
        - Always pivot to solutions

        ... (rest of your detailed system prompt here) ...
      `),
      new MessagesPlaceholder('history'),
      new MessagesPlaceholder('agent_scratchpad'),
      new HumanMessage('{input}'),
    ]);

    const agent = await createToolCallingAgent({
      llm: chat,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      memory,
      returnIntermediateSteps: true,
    });

    // Save user message to database if conversation exists
    if (currentConversationId) {
      await addMessage(currentConversationId, 'user', message);
    }

    const result = await agentExecutor.invoke({ input: message });

    // Save AI response to database if conversation exists
    if (currentConversationId) {
      await addMessage(currentConversationId, 'ai', result.output);
      
      // Update conversation title if it still has the default title
      // We check this by retrieving the current conversation and seeing if the title is "New Conversation"
      try {
        const conversation = await getConversation(currentConversationId);
        if (conversation && conversation.title === 'New Conversation') {
          // Create a meaningful title from the user's first message
          let title = message.trim();
          // Remove extra whitespace and limit length
          title = title.replace(/\s+/g, ' ');
          title = title.length > 60 ? title.substring(0, 60) + '...' : title;
          // If the message is too short or empty, use a default
          if (title.length < 3) {
            title = "Chat Conversation";
          }
          await updateConversation(currentConversationId, { title });
        }
      } catch (error) {
        console.error('Error updating conversation title:', error);
      }
    }

    const updatedHistory = await memory.chatHistory.getMessages();
    const serializableHistory = updatedHistory.map((msg) => ({
      type: msg._getType() === 'human' ? 'user' : 'ai',
      text: msg.content,
    }));

    return NextResponse.json({
      aiResponse: result.output,
      history: serializableHistory,
      conversationId: currentConversationId,
    });
  } catch (error) {
    console.error('Langchain API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
