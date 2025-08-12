import { handleGetEventById } from './route_handler';

export async function GET(_request: Request, context: { params: { id: string } }) {
  return handleGetEventById(context.params.id);
} 