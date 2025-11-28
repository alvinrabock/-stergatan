import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

interface RevalidateRequestBody {
  slug?: string;
  secret: string;
  draft?: boolean;
}

export async function POST(req: Request) {
  try {
    const body: RevalidateRequestBody = await req.json();
    const { slug, draft, secret } = body;

    if (secret !== process.env.FRONTEND_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    }

    const tag = `page-data-${slug}-${draft}`;
    revalidateTag(tag);

    // Handle home page slug specifically
    const path = slug === 'home' ? '/' : `/${slug}`;
    revalidatePath(path, 'page');

    return NextResponse.json({
      message: `Revalidated tag ${tag} and path ${path}`,
    });
  } catch (err) {
    const error = err as Error;
    console.error('Page revalidation failed:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Page revalidation failed', details: error.message },
      { status: 500 }
    );
  }
}
