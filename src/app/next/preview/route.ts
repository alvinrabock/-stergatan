"use server"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // your existing logic
  const url = new URL(req.url)
  const previewSecret = url.searchParams.get('previewSecret')
  const slug = url.searchParams.get('slug') || 'home'
  const path = url.searchParams.get('path') || `/${slug}`

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new NextResponse('Invalid preview token', { status: 401 })
  }

  const redirectUrl = new URL(path, url.origin)

  const res = NextResponse.redirect(redirectUrl)

  // Set preview cookies
  res.cookies.set('next-preview-data', 'true', { httpOnly: true, path: '/' })
  res.cookies.set('next-preview', 'true', { httpOnly: true, path: '/' })


  return res
}
