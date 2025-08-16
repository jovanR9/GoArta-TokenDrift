import { handleGetEventById } from '../route_handler';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  return handleGetEventById(params.id);
}