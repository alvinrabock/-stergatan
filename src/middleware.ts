/**
 * Next.js Middleware for Frontspace Redirects
 * Checks incoming requests against the Frontspace redirect API
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const STORE_ID = process.env.FRONTSPACE_STORE_ID!
const API_URL = 'https://api.frontspace.se'

// In-memory cache for redirect lookups (5 min TTL)
const redirectCache = new Map<string, { redirect: RedirectMatch | null; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface RedirectMatch {
  source_path: string
  destination_path: string
  redirect_type: '301' | '302'
  is_pattern: boolean
}

interface RedirectResponse {
  redirects: RedirectMatch[]
  match: RedirectMatch | null
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  try {
    const redirect = await lookupRedirect(pathname)

    if (redirect) {
      const destination = redirect.is_pattern
        ? applyPatternRedirect(redirect.source_path, redirect.destination_path, pathname)
        : redirect.destination_path

      const statusCode = redirect.redirect_type === '301' ? 301 : 302
      return NextResponse.redirect(new URL(destination, request.url), statusCode)
    }
  } catch (error) {
    // Don't block requests if redirect lookup fails
    console.error('[Redirect] Lookup failed:', error)
  }

  return NextResponse.next()
}

async function lookupRedirect(path: string): Promise<RedirectMatch | null> {
  // Check cache first
  const cacheKey = `${STORE_ID}:${path}`
  const cached = redirectCache.get(cacheKey)

  if (cached && cached.expires > Date.now()) {
    return cached.redirect
  }

  // Fetch from Frontspace API
  const response = await fetch(
    `${API_URL}/v1/redirects/${STORE_ID}?path=${encodeURIComponent(path)}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      // Short timeout to prevent blocking requests
      signal: AbortSignal.timeout(3000),
    }
  )

  if (!response.ok) {
    // Cache null result to avoid hammering API on 404s
    redirectCache.set(cacheKey, { redirect: null, expires: Date.now() + CACHE_TTL })
    return null
  }

  const data: RedirectResponse = await response.json()
  const redirect = data.match || null

  // Cache the result
  redirectCache.set(cacheKey, {
    redirect,
    expires: Date.now() + CACHE_TTL
  })

  return redirect
}

/**
 * Apply pattern redirect (wildcard matching)
 * e.g., /blog/* -> /articles/* transforms /blog/my-post to /articles/my-post
 */
function applyPatternRedirect(
  sourcePattern: string,
  destPattern: string,
  actualPath: string
): string {
  // Extract the base path (everything before /*)
  const sourceBase = sourcePattern.replace('/*', '')
  const destBase = destPattern.replace('/*', '')

  // Get the captured segment (everything after the base)
  const captured = actualPath.slice(sourceBase.length)

  return destBase + captured
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (e.g., .js, .css, .png)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
