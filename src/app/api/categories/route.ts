import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

const REVALIDATE_TAG = 'categories-data';

interface RevalidateRequestBody {
  slug?: string;
  secret: string;
}

export async function POST(req: Request) {
  try {
    const body: RevalidateRequestBody = await req.json();

    const { slug, secret } = body;

    if (secret !== process.env.FRONTEND_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    revalidateTag(REVALIDATE_TAG);

    if (slug) {
      revalidatePath(`/categories/${slug}`);
    }

    return NextResponse.json({
      message: 'Revalidation triggered successfully',
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
