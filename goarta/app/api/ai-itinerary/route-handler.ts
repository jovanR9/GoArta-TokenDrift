import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, BaseMessage, AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { z } from 'zod';
import { supabaseClient as supabase } from '@/lib/supabaseClient';
import { BufferWindowMemory } from 'langchain/memory';
import { createConversation, addMessage, updateConversation, getConversation } from '@/lib/services/conversationService';

interface Event {
  title: string;
  description: string;
  date_range: string;
  categories: string[] | string; // detailed as jsonb, could be array or string
  entry_type: string;
  ticket_options: any; // jsonb
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
const FetchEventsSchema = z.object({
  limit: z.number().optional().describe('The maximum number of events to fetch. Default is 10.'),
});

class FetchEventsTool extends StructuredTool<typeof FetchEventsSchema> {
  name = 'fetch_events';
  description =
    'Fetches a list of upcoming (latest) events in Goa from the database. Use this tool to find events happening soon to include in itineraries or suggest activities.';
  schema = FetchEventsSchema;

  constructor() {
    super();
  }

  async _call({ limit = 10 }: z.infer<typeof this.schema>) {
    try {
      const { data, error } = await supabase
        .from('new_events')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching events from Supabase:', error);
        return `Failed to fetch events: ${error.message}`;
      }

      if (!data || data.length === 0) {
        return 'No upcoming events found in the database. You can suggest general activities instead.';
      }

      const eventsString = data
        .map(
          (event: Event) =>
            `- **${event.title}** (${Array.isArray(event.categories) ? event.categories.join(', ') : event.categories})
             Date: ${event.date_range}
             Entry: ${event.entry_type}
             Description: ${event.description}`
        )
        .join('\n\n');

      return `Here are the upcoming events in Goa:\n${eventsString}`;
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

    // Define tools
    const tools = [saveItineraryTool, fetchEventsTool];

    // Use a model that supports tools and system instructions
    // gemma-3-27b-it threw "[400 Bad Request] Developer instruction is not enabled"
    const MODEL_NAME = 'gemini-2.5-flash-lite';
    const SUPPORTS_TOOLS = true;

    // Initialize the Chat Model
    let chat = new ChatGoogleGenerativeAI({
      model: MODEL_NAME,
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });



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
        return new AIMessage(msg.text);
      });
      await memory.chatHistory.addMessages(messagesToAdd);
    }

    // System prompt with or without tool instructions
    let systemPromptContent = `Current Date and Time: ${currentDateTime}

You are GoaGuide, an expert local travel companion for Goa. 🌴✨

YOUR CAPABILITIES:
1. **Itinerary Creation**: You construct detailed day-by-day itineraries (e.g., 6 days in Goa). You MUST mix **general sight-seeing**, **food recommendations**, **adventure activities**, and **specific upcoming events**.
2. **Local Knowledge**: You know the best places for:
   - **Food**: Local Goan cuisine, cafes, seafood.
   - **Adventure**: Water sports, trekking, hidden spots.
   - **Culture**: Heritage sites, churches, temples.

INSTRUCTIONS:
- When asked for an itinerary (e.g., "6 day itinerary"), build the itinerary incorporating general activities.
- If the user asks about specific categories (food, adventure), give rich, specific recommendations.
- Keep the tone friendly, upbeat, and helpful. Use emojis.
- Always be ready to help the user explore Goa!`;

    // Only add tool instructions if supported
    if (SUPPORTS_TOOLS) {
      systemPromptContent += `
3. **Event Recommendations**: You have access to a database of real, upcoming events in Goa via the 'fetch_events' tool. ALWAYS check this tool when asked about "what's happening", "events", or when building an itinerary to see if there's something cool to include.

ADDITIONAL INSTRUCTIONS:
- Check for upcoming events using 'fetch_events' to see if any align with the user's trip.
- If 'fetch_events' returns no events, proceed with general recommendations but mention you checked.
- Always be ready to save the itinerary if the user seems happy with it (using 'save_itinerary' tool), or suggest they can save it.
`;
    } else {
      // If tools are not supported (e.g. gemma-3-27b-it), we:
      // 1. Pre-fetch upcoming events directly
      // 2. Inject them into the system context

      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .limit(10); // Fetch top 10 upcoming events

        if (eventsData && eventsData.length > 0) {
          const eventsList = eventsData.map((e: Event) =>
            `- ${e.title} (${e.category}): ${e.event_date} @ ${e.location}. ${e.description}`
          ).join('\n');

          systemPromptContent += `
DATA CONTEXT (Upcoming Events in Goa):
Here is a list of real, upcoming events you can recommend or include in itineraries:
${eventsList}
`;
        } else {
          systemPromptContent += `
DATA CONTEXT:
No specific upcoming events were found in the database. Rely on general seasonal advice.
`;
        }
      } catch (err) {
        console.error("Error pre-fetching events:", err);
        systemPromptContent += `
DATA CONTEXT:
Could not fetch live events due to an error. Rely on general knowledge.
`;
      }

      systemPromptContent += `
NOTE:
- You have been provided with a list of upcoming events above. Use them!
`;
    }


    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage({ content: systemPromptContent }),
      new MessagesPlaceholder('history'),
      new MessagesPlaceholder('agent_scratchpad'), // Keep this for compatibility, though unused if no tools
      new HumanMessage('{input}'),
    ]);

    let agentExecutor;

    if (SUPPORTS_TOOLS) {
      // Create an agent capable of calling tools
      const agent = await createToolCallingAgent({
        llm: chat,
        tools,
        prompt,
      });

      agentExecutor = new AgentExecutor({
        agent,
        tools,
        memory,
        returnIntermediateSteps: true,
      });
    } else {
      // Fallback: Create a simple LLM chain/invocation wrapper using AgentExecutor structure is tricky without tools,
      // so standard chain or a dummy agent is better. 
      // However, standard LangChain AgentExecutor fails if no tools.
      // We will switch to a simple LLMChain logic here for no-tool models.

      // Manual history handling for non-agent flow
      const historyMessages = await memory.chatHistory.getMessages();
      const currentPrompt = await prompt.formatMessages({
        history: historyMessages,
        agent_scratchpad: [], // Empty scratchpad
        input: message
      });

      // Save user message (happens before invocation)
      if (currentConversationId) {
        await addMessage(currentConversationId, 'user', message);
      }

      const response = await chat.invoke(currentPrompt);

      // Save AI response
      if (currentConversationId) {
        await addMessage(currentConversationId, 'ai', response.content as string);

        // Update title logic...
        try {
          const conversation = await getConversation(currentConversationId);
          if (conversation && conversation.title === 'New Conversation') {
            let title = message.trim();
            title = title.replace(/\s+/g, ' ');
            title = title.length > 60 ? title.substring(0, 60) + '...' : title;
            if (title.length < 3) title = "Chat Conversation";
            await updateConversation(currentConversationId, { title });
          }
        } catch (error) {
          console.error('Error updating conversation title:', error);
        }
      }

      // Update memory
      await memory.chatHistory.addMessage(new AIMessage(response.content as string));

      const serializableHistory = (await memory.chatHistory.getMessages()).map((msg) => ({
        type: msg._getType() === 'human' ? 'user' : 'ai',
        text: msg.content,
      }));

      return NextResponse.json({
        aiResponse: response.content,
        history: serializableHistory,
        conversationId: currentConversationId,
      });
    }

    // Only reached if SUPPORTS_TOOLS is true
    if (currentConversationId) {
      await addMessage(currentConversationId, 'user', message);
    }

    const result = await agentExecutor.invoke({ input: message });

    if (currentConversationId) {
      await addMessage(currentConversationId, 'ai', result.output);

      try {
        const conversation = await getConversation(currentConversationId);
        if (conversation && conversation.title === 'New Conversation') {
          let title = message.trim();
          title = title.replace(/\s+/g, ' ');
          title = title.length > 60 ? title.substring(0, 60) + '...' : title;
          if (title.length < 3) title = "Chat Conversation";
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
