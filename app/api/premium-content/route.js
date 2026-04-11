import { NextResponse } from 'next/server';

/**
 * Example Next.js Route Handler for proxying premium content requests.
 * By routing requests through this internal Next.js API, the client never 
 * needs to know the true `API_KEY` or the real endpoint.
 */
export async function GET(request) {
  // Use environment variables for secure API key injection 
  // (make sure it's NOT prefixed with NEXT_PUBLIC_)
  const backendApiKey = process.env.API_KEY || 'your-secret-api-key';
  const backendUrl = process.env.BACKEND_API_URL || 'https://api.yourdomain.com/v1';
  
  // Identify the resource requested
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('id');

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
  }

  try {
    // Make the secure backend request using the hidden API key
    const response = await fetch(`${backendUrl}/articles/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${backendApiKey}`,
        'Content-Type': 'application/json',
      },
      // Ensure we don't cache premium responses incorrectly
      cache: 'no-store', 
    });

    if (!response.ok) {
        throw new Error('Failed to fetch from backend API');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
