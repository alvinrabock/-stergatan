// app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const HEADER_TAG = 'header-data';

interface RevalidateRequestBody {
  slug?: string; // Optional for globals
  secret: string;
}

export async function POST(req: Request) {
  try {
    const body: RevalidateRequestBody = await req.json();
    const { secret } = body;

    if (!secret || secret !== process.env.FRONTEND_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Revalidate the header data tag
    revalidateTag(HEADER_TAG);

    return NextResponse.json({
      message: 'Header revalidation triggered successfully',
    });
  } catch (err) {
    const error = err as Error;
    
    console.error('Header revalidation failed:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Header revalidation failed', details: error.message },
      { status: 500 }
    );
  }
}