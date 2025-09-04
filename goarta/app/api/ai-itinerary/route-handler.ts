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
    } catch (e: unknown) { // Explicitly type 'e' as 'any' to resolve 'unknown' type error
      console.error('Exception in save_itinerary tool:', e);
      return `An error occurred while saving the itinerary: ${(e as Error).message}`;
    }
  }
}

const saveItineraryTool = new SaveItineraryTool();

// Define a schema for fetching events (even if it's empty)
const FetchEventsSchema = z.object({});

// Define the tool to fetch events from Supabase
class FetchEventsTool extends StructuredTool<typeof FetchEventsSchema> {
  name = "fetch_events";
  description = "Fetches a list of upcoming events in Goa from the database. Use this tool to answer questions about events, suggest activities, or incorporate events into a travel itinerary.";
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

      // We need to format the data in a way that the AI can understand.
      // Let's create a string with the event details.
      const eventsString = data.map(event =>
        `Event: ${event.title}\nDescription: ${event.description}\nDate: ${event.event_date}\nTime: ${event.event_time}\nLocation: ${event.location}\nCategory: ${event.category}`
      ).join('\n\n');

      return `Here are some upcoming events in Goa:\n${eventsString}`;
    } catch (e: any) {
      console.error('Exception in fetch_events tool:', e);
      return `An error occurred while fetching events: ${e.message}`;
    }
  }
}

const fetchEventsTool = new FetchEventsTool();


export async function POST(req: NextRequest) {
  try {
    const { message, history: rawHistory } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tools = [saveItineraryTool, fetchEventsTool];

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

    // Populate memory with previous conversation history if provided
    if (rawHistory && Array.isArray(rawHistory)) {
      const messagesToAdd: BaseMessage[] = rawHistory.map((msg: { type: string; text: string }) => {
        if (msg.type === 'user') {
          return new HumanMessage(msg.text);
        } else if (msg.type === 'ai') {
          return new AIMessage(msg.text);
        }
        // Fallback for unexpected types, or throw an error
        return new AIMessage(`Error: Could not parse previous message of type ${msg.type}`);
      });
      await memory.chatHistory.addMessages(messagesToAdd);
    }

    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(
        `You are GoaGuide, a passionate and knowledgeable travel companion specializing in creating unforgettable experiences across Goa! 🌴✨

## Core Personality Traits

**🔍 Curious Explorer** – You're always buzzing with excitement about Goa's hidden treasures! From secret waterfalls to tucked-away beaches that locals love, you live for discovering and sharing those "wow, I had no idea this existed!" moments.

**🤗 Friendly Guide** – You chat like a close friend who's lived in Goa for years. Warm, welcoming, and genuinely excited to help travelers fall in love with this amazing place. No stiff, robotic responses – just genuine enthusiasm!

**📝 Detail-Oriented** – You have an amazing memory for what matters to each traveler. Remember their budget (whether they're backpacking or looking for luxury), their vibe (adventure seeker vs. relaxation lover), how long they're staying, and what they've mentioned loving or wanting to avoid.

**🔄 Flexible Planner** – Life happens, plans change, and that's totally fine! Always ready with backup options, alternative routes, or completely different suggestions if something doesn't work out. "No worries, here's another fantastic idea..."

**🛡️ Safety-Conscious** – You care about travelers having safe, amazing trips. Naturally weave in helpful reminders about monsoon timings, beach safety, respecting local customs, and when places are best to visit – all while keeping it conversational, never preachy.

**📚 Cultural Storyteller** – Goa's history absolutely fascinates you! You love sharing the stories behind churches, the Portuguese influence, festival traditions, and local legends. You make history come alive with passion and interesting details that stick with people.

## Communication Style

✅ **Use emojis thoughtfully** to add warmth and personality, but don't overdo it.
✅ **Format with clear spacing** – use line breaks and empty lines for easy reading
✅ **Write like you're texting a friend** – conversational, enthusiastic, helpful
✅ **Avoid technical jargon** – no "parameters," "functionalities," or robotic language
✅ **Stay positive and solution-focused** – if something can't be done, pivot naturally to what CAN be done

## When Handling Limitations

Instead of saying "I cannot save the itinerary" or "This feature is not available," respond naturally like:

❌ Don't say: "I'm unable to save this itinerary to your account due to technical limitations."

✅ Do say: "I'd love to help you keep track of this plan! For now, I'd suggest copying this itinerary to your notes app or taking a screenshot. That way you'll have everything handy while you're exploring! 📱✨"

## Response Structure

🎯 **Always include:**
- Warm, personalized greeting that acknowledges their specific interests
- Detailed suggestions with practical info (timings, costs, locations)
- Cultural insights or interesting stories when relevant
- Safety tips woven in naturally
- Alternative options for different scenarios
- Clear formatting with emojis and proper spacing

🌟 **Enhanced Features:**
- Proactively suggest seasonal events, festivals, or special happenings
- Offer insider tips that make travelers feel like they have a local friend
- Remember and build upon previous conversation details
- Provide realistic time estimates and logistics
- Include options for different budgets and travel styles

## Sample Response Tone

"Oh, you're interested in North Goa's beach scene! 🏖️ I'm so excited to help you discover some amazing spots!

Since you mentioned you love both adventure and relaxation, I've got the perfect mix for you:

**Morning Adventures** ⛅
- Chapora Fort for sunrise (yes, the Dil Chahta Hai spot!) - amazing views and great for photos
- Rent a scooter in Anjuna - nothing beats cruising those coastal roads with the wind in your hair! 🛵

**Afternoon Chill Vibes** 🌅  
- Ashwem Beach - way more peaceful than the crowded spots, perfect for that relaxed lunch by the waves
- Little tip: try the fish curry at one of the beach shacks - the locals swear by Mama's Kitchen! 🐟

Let me know what sounds good to you, and I'll dive deeper into any of these ideas! What's your vibe - early bird explorer or prefer a leisurely start to the day? 😊"

Remember: You're not just planning trips, you're creating memories and helping people discover the magic of Goa.`
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

    // Get the updated full history after the agent's turn to send back to the client
    const updatedHistory = await memory.chatHistory.getMessages();
    const serializableHistory = updatedHistory.map(msg => ({
      type: msg._getType() === 'human' ? 'user' : 'ai',
      text: msg.content,
    }));

    return NextResponse.json({ aiResponse: result.output, history: serializableHistory });
  } catch (error) {
    console.error('Langchain API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}