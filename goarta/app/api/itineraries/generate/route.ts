import { handleGenerateItinerary } from '../../itinerary/route1';

export async function POST(request: Request) {
  return handleGenerateItinerary(request);
} 