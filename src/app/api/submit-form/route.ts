import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, formId, formData } = body

    const graphqlEndpoint = process.env.FRONTSPACE_ENDPOINT || 'http://localhost:3000/api/graphql'
    const apiKey = process.env.FRONTSPACE_API_KEY

    // Get user agent for analytics
    const userAgent = request.headers.get('user-agent') || null

    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey }),
      },
      body: JSON.stringify({
        query: `
          mutation SubmitForm(
            $storeId: String!
            $formId: String!
            $formData: JSON!
            $userAgent: String
          ) {
            submitForm(
              storeId: $storeId
              formId: $formId
              formData: $formData
              userAgent: $userAgent
            ) {
              success
              message
            }
          }
        `,
        variables: {
          storeId,
          formId,
          formData,
          userAgent,
        },
      }),
    })

    const result = await response.json()

    if (result.errors) {
      return NextResponse.json(
        { error: result.errors[0]?.message || 'Form submission failed' },
        { status: 400 }
      )
    }

    if (!result.data?.submitForm?.success) {
      return NextResponse.json(
        { error: result.data?.submitForm?.message || 'Form submission failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.data.submitForm.message,
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
