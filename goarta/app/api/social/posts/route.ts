import { handleCreateCommunityPost } from './route_handler';

export async function POST(request: Request) {
  return handleCreateCommunityPost(request);
} 