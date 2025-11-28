import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNyheter, fetchNyheterByCategory } from '@/lib/frontspace/adapters/nyheter';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const categorySlug = searchParams.get('category');

    let posts;
    if (categorySlug) {
      posts = await fetchNyheterByCategory(categorySlug, limit, page);
    } else {
      posts = await fetchAllNyheter(limit, page);
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching nyheter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nyheter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
