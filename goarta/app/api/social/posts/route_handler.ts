import { NextResponse } from 'next/server';

export type CreatePostRequest = {
  media_url: string;
  caption: string;
};

export type CreatePostResponse = {
  id: number;
  author_id: number;
  media_url: string;
  caption: string;
  created_at: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidHttpUrl(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateRequestBody(body: unknown): body is CreatePostRequest {
  if (typeof body !== 'object' || body === null) return false;
  const candidate = body as Partial<CreatePostRequest>;
  return isValidHttpUrl(candidate.media_url) && isNonEmptyString(candidate.caption);
}

export async function handleCreateCommunityPost(request: Request): Promise<Response> {

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 422 });
  }

  if (!validateRequestBody(json)) {
    return NextResponse.json({ error: 'Invalid post payload.' }, { status: 422 });
  }

  const body = json as CreatePostRequest;

  const response: CreatePostResponse = {
    id: Math.floor(Math.random() * 1000) + 1,
    author_id: 42,
    media_url: body.media_url,
    caption: body.caption,
    created_at: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 201 });
}
