import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

const REVALIDATE_TAG = 'posts-data';

interface RevalidateRequestBody {
  slug?: string;
  paths?: string[]; // Array of specific paths to revalidate
  tags?: string[]; // Array of specific tags to revalidate
  revalidateAll?: boolean; // Flag to revalidate common paths
  secret: string;
}

export async function POST(req: Request) {
  try {
    const body: RevalidateRequestBody = await req.json();

    const { slug, paths, tags, revalidateAll, secret } = body;

    if (secret !== process.env.FRONTEND_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Always revalidate the main posts tag
    revalidateTag(REVALIDATE_TAG);

    // Revalidate additional tags if provided
    if (tags && Array.isArray(tags)) {
      tags.forEach(tag => {
        revalidateTag(tag);
      });
    }

    // Revalidate specific post path if slug provided
    if (slug) {
      revalidatePath(`/nyheter/${slug}`);
    }

    // Revalidate additional specific paths if provided
    if (paths && Array.isArray(paths)) {
      paths.forEach(path => {
        revalidatePath(path);
      });
    }

    // Revalidate common paths if flag is set
    if (revalidateAll) {
      const commonPaths = [
        '/', // Home page
        '/nyheter', // News listing page
        '/sitemap.xml', // Sitemap if you have one
        // Add other common paths that should be revalidated
      ];

      commonPaths.forEach(path => {
        revalidatePath(path);
      });
    }

    const revalidatedItems = [];
    if (slug) revalidatedItems.push(`/nyheter/${slug}`);
    if (paths) revalidatedItems.push(...paths);
    if (revalidateAll) revalidatedItems.push('common paths');

    return NextResponse.json({
      message: 'Revalidation triggered successfully',
      revalidated: {
        tags: [REVALIDATE_TAG, ...(tags || [])],
        paths: revalidatedItems,
      },
    });
  } catch (err) {
    const error = err as Error;

    console.error('Revalidation failed:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Revalidation failed', details: error.message },
      { status: 500 }
    );
  }
}