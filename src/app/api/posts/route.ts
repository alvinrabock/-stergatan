import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNyheter } from '@/lib/frontspace/adapters';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const posts = await fetchAllNyheter(limit, page);

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error in /api/posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news posts',
      },
      { status: 500 }
    );
  }
}
