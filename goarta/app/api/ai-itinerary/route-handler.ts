import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, BaseMessage, AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client
import { BufferWindowMemory } from "langchain/memory"; // Import BufferWindowMemory

// Define the schema type for clarity
const SaveItinerarySchema = z.object({
  title: z.string().describe("The title of the itinerary."),
  destination: z.string().describe("The travel destination."),
  duration_days: z.number().int().describe("The duration of the trip in days."),
  travel_style: z.string().describe("The style of travel (e.g., adventurous, relaxed, cultural, budget-friendly)."),
  budget_range: z.string().describe("The budget range for the trip (e.g., 'low', 'medium', 'high', '$500-$1000')."),
});

// Define the Supabase tool by extending StructuredTool
class SaveItineraryTool extends StructuredTool<typeof SaveItinerarySchema> {
  // Define properties directly as class members
  name = "save_itinerary";
  description = "Saves a generated travel itinerary to the database. Use this tool when a complete travel itinerary has been generated and the user might want to save it. Provide all parameters: title, destination, duration_days, travel_style, and budget_range.";
  schema = SaveItinerarySchema;

  constructor() {
    super(); // Call the super constructor with no arguments when defining properties as class members
  }

  // Implement the _call method as required by StructuredTool
  async _call({ title, destination, duration_days, travel_style, budget_range }: z.infer<typeof this.schema>) {
    try {
      // For now, user_id is null as we don't have authentication set up
      const { data, error } = await supabase
        .from('itineraries')
        .insert([
          {
            title,
            destination,
            duration_days,
            travel_style,
            budget_range,
            user_id: null, // Placeholder for user_id
          },
        ]);

      if (error) {
        console.error('Error saving itinerary to Supabase:', error);
        return `Failed to save itinerary: ${error.message}`;
      }
      console.log('Itinerary saved to Supabase:', data);
      return "Itinerary successfully saved to the database.";
    } catch (e: any) { // Explicitly type 'e' as 'any' to resolve 'unknown' type error
      console.error('Exception in save_itinerary tool:', e);
      return `An error occurred while saving the itinerary: ${e.message}`;
    }
  }
}

const saveItineraryTool = new SaveItineraryTool();

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tools = [saveItineraryTool];

    const chat = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    }).bindTools(tools);

    // Initialize BufferWindowMemory
    const memory = new BufferWindowMemory({
      k: 9, // Keep last 9 interactions (18 messages), plus current human message, totals 19 in history
      returnMessages: true,
      memoryKey: "history", // Key name used in the prompt
      inputKey: "input",   // Explicitly define input key
      outputKey: "output", // Explicitly tell memory which key contains the agent's final output
    });

    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(
        "You are a helpful AI assistant that helps plan travel itineraries. " +
        "When a complete travel itinerary has been generated and the user might want to save it, " +
        "use the `save_itinerary` tool with all the required parameters. " +
        "Please format your responses with clear newlines and empty lines for readability. " +
        "Also, use relevant emojis to make the response even more engaging and friendly. \n\n" +
        "You have access to the following tools: {tools}" // Removed the explicit instruction on tool call format
      ),
      new MessagesPlaceholder("history"), // Memory gets injected here
      new MessagesPlaceholder("agent_scratchpad"), // This is crucial for the agent's internal state
      new HumanMessage("{input}"),
    ]);

    const agent = await createToolCallingAgent({
      llm: chat,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      memory, // ✅ Add memory here
      returnIntermediateSteps: true,
    });

    const result = await agentExecutor.invoke({
      input: message,
    });

    return NextResponse.json({ aiResponse: result.output });
  } catch (error) {
    console.error('Langchain API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}