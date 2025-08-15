import { NextResponse } from 'next/server';
export { handleCreateCommunityPost } from '../../social/posts/route_handler';

export type CommunityPost = {
  id: number;
  author_id: number;
  media_url: string;
  caption: string;
  created_at: string;
};

export async function handleGetCommunityPosts(): Promise<Response> {
  const posts: CommunityPost[] = [
    {
      id: 101,
      author_id: 42,
      media_url: 'https://s3.bucket/path/to/image.jpg',
      caption: 'Amazing time exploring the Latin Quarter! #GoArta',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 102,
      author_id: 51,
      media_url: 'https://s3.bucket/path/to/another.jpg',
      caption: 'Sunset by the beach was unreal.',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  return NextResponse.json(posts, { status: 200 });
} 