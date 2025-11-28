import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',

    },
    credentials: 'include',
  })

  if (!res.ok) {
    return new NextResponse('Failed to fetch user', { status: res.status })
  }

  const user = await res.json()
  return NextResponse.json(user)
}