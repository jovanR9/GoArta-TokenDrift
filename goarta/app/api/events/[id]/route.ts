import { handleGetEventById } from '../route_handler';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handleGetEventById(params.id);
}
