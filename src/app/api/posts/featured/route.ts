import { NextRequest, NextResponse } from 'next/server';
import { fetchHomepageNyheter } from '@/lib/frontspace/adapters/nyheter';

/**
 * GET /api/posts/featured
 * Fetches posts marked to display on homepage (visaPaHemsida = true)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    const posts = await fetchHomepageNyheter(limit);

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error in /api/posts/featured:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured posts' },
      { status: 500 }
    );
  }
}
