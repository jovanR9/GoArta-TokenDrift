import { handleCreateCommunityPost, handleGetCommunityPosts } from './route_handler';

export async function GET() {
  return handleGetCommunityPosts();
}

export async function POST(request: Request) {
  return handleCreateCommunityPost(request);
}
