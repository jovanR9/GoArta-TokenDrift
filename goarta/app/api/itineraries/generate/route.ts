import { handleGenerateItinerary } from './route-handler';

export async function POST(request: Request) {
  return handleGenerateItinerary(request);
}