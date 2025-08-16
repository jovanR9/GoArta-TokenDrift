import { handleGetEvents } from './route_handler';

export async function GET(request: Request) {
  return handleGetEvents(request);
} 