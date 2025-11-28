import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get the base URL from the FRONTSPACE_ENDPOINT env variable
    const frontspaceEndpoint = process.env.FRONTSPACE_ENDPOINT || 'http://localhost:3000/api/graphql'
    // Remove /api/graphql to get base URL
    const baseUrl = frontspaceEndpoint.replace('/api/graphql', '')

    // Forward the request to the Frontspace CMS REST API (which handles email sending)
    const response = await fetch(`${baseUrl}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      return NextResponse.json(
        { error: data.error || 'Form submission failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
