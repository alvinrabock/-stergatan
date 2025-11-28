# Frontspace Forms Implementation Guide

This guide explains how to implement forms in a Frontspace headless Next.js application, including fetching form data, rendering fields, and submitting to the backend.

---

## Architecture Overview

The forms system has 4 main components:

1. **Form Block** (`components/blocks/FormBlock.tsx`) - Server Component that fetches form data
2. **Form Component** (`components/FormComponent.tsx`) - Client Component that renders and handles submission
3. **Submit API Route** (`app/api/submit-form/route.ts`) - API endpoint that forwards submissions to Frontspace backend
4. **Frontspace Client** (`lib/frontspace-client.ts`) - GraphQL client with `getForm()` method

```
┌─────────────────┐
│   FormBlock     │  Server Component (fetches form)
│   (Server)      │
└────────┬────────┘
         │
         ├─── getForm(formId) via GraphQL
         │
         ▼
┌─────────────────┐
│ FormComponent   │  Client Component (renders & submits)
│   (Client)      │
└────────┬────────┘
         │
         ├─── POST /api/submit-form
         │
         ▼
┌─────────────────┐
│ API Route       │  Forwards to Frontspace backend
│   (Server)      │
└────────┬────────┘
         │
         ├─── POST {baseUrl}/api/forms/submit
         │
         ▼
┌─────────────────┐
│ Frontspace CMS  │  Sends email & stores submission
│   (Backend)     │
└─────────────────┘
```

---

## Step 1: Add Form Types to Frontspace Client

**File: `lib/frontspace-client.ts`**

Add these TypeScript interfaces:

```typescript
export interface FormField {
  name: string
  label: string
  type: string // 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: string[] // For select, radio, checkbox fields
}

export interface Form {
  id: string
  name: string
  status: string // 'active' | 'inactive'
  fields: FormField[]
  email_settings?: {
    send_to_type?: string
    to_email?: string
    form_email_field?: string
    subject?: string
    send_confirmation_to_user?: boolean
    confirmation_subject?: string
    confirmation_message?: string
  }
  created_at?: string
  updated_at?: string
}
```

---

## Step 2: Add getForm() Method to Frontspace Client

**File: `lib/frontspace-client.ts`**

Add this method to the `FrontspaceClient` class:

```typescript
/**
 * Fetch a specific form by ID
 */
async getForm(formId: string): Promise<Form | null> {
  try {
    const data = await this.query<{ form: any }>(`
      query GetForm($storeId: String!, $id: String!) {
        form(storeId: $storeId, id: $id) {
          id
          name
          status
          fields {
            name
            label
            type
            required
            placeholder
            options
          }
          email_settings {
            send_to_type
            to_email
            form_email_field
            subject
            send_confirmation_to_user
            confirmation_subject
            confirmation_message
          }
        }
      }
    `, {
      storeId: this.storeId,
      id: formId
    })

    return data.form || null
  } catch (error) {
    console.error('Error fetching form:', error)
    return null
  }
}
```

---

## Step 3: Create Form Block Component

**File: `components/blocks/FormBlock.tsx`**

This Server Component fetches the form data and passes it to the client component:

```typescript
/**
 * Form Block Component
 *
 * Renders Frontspace CMS forms
 * Fetches form data from API and displays using FormComponent
 */

import React from 'react'
import { getTenantClient } from '@/lib/fetch-with-tenant'
import { FormComponent } from '@/components/FormComponent'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface FormBlockProps {
  block: Block
  blockId: string
}

export default async function FormBlock({ block, blockId }: FormBlockProps) {
  const content = block.content || {}
  const formId = content.selectedFormId

  // If no form selected, return null
  if (!formId) {
    return null
  }

  try {
    // Get tenant-specific client for multi-tenant support
    const tenantClient = await getTenantClient()

    // Fetch the form from API
    const form = await tenantClient.getForm(formId)

    // If form not found or not active, return null
    if (!form || form.status !== 'active') {
      return null
    }

    return (
      <div
        className={`form-block block-${blockId}`}
        data-block-id={blockId}
      >
        <FormComponent
          form={form}
          className={`block-${blockId}`}
          submitButtonColor={content.submitButtonColor}
          submitButtonTextColor={content.submitButtonTextColor}
        />
      </div>
    )
  } catch (error) {
    // Silently fail - form doesn't exist or backend error
    // This prevents pages with broken forms from crashing
    return null
  }
}
```

**Key Points:**
- Uses `getTenantClient()` for multi-tenant support
- Only renders if form exists and is active
- Passes custom button colors from block content
- Graceful error handling (returns null)

---

## Step 4: Create Form Component (Client)

**File: `components/FormComponent.tsx`**

This Client Component renders the form and handles submission:

```typescript
'use client'

/**
 * Form Component - Client-side form with submission handling
 * Implements Frontspace Form Block with all field types and validation
 */

import { useState, FormEvent } from 'react'
import { Form as FormType } from '@/lib/frontspace-client'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface FormComponentProps {
  form: FormType
  className?: string
  submitButtonColor?: string
  submitButtonTextColor?: string
}

export function FormComponent({
  form,
  className = '',
  submitButtonColor = '#0A0D26',
  submitButtonTextColor = '#ffffff'
}: FormComponentProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId: process.env.NEXT_PUBLIC_FRONTSPACE_STORE_ID,
          formId: form.id,
          formData: formData
        })
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Form submission failed')
      }

      setSuccess(true)
      setFormData({}) // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form')
    } finally {
      setLoading(false)
    }
  }

  // Success state - show completion message
  if (success) {
    return (
      <div className={`p-8 bg-green-50 border border-green-200 rounded-xl ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">Tack!</h3>
        </div>
        <p className="text-green-700">
          Ditt formulär har skickats. Vi återkommer så snart som möjligt.
        </p>
      </div>
    )
  }

  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg border border-gray-300
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    placeholder:text-gray-400
    disabled:bg-gray-50 disabled:cursor-not-allowed
  `

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {form.fields.map(field => {
        // Checkbox has different layout (label after input)
        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className="flex items-start">
              <input
                id={field.name}
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                required={field.required}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={field.name} className="ml-3 text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          )
        }

        // Radio buttons
        if (field.type === 'radio') {
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-3">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={`${field.name}-${option}`}
                      name={field.name}
                      value={option}
                      checked={formData[field.name] === option}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`${field.name}-${option}`}
                      className="ml-3 text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        // All other field types (text, email, tel, textarea, select)
        return (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={5}
                className={baseInputClasses}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={baseInputClasses}
              >
                <option value="">Välj ett alternativ</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={baseInputClasses}
              />
            )}
          </div>
        )
      })}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-lg font-semibold
                   focus:ring-4 focus:ring-blue-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          backgroundColor: loading ? '#9CA3AF' : submitButtonColor,
          color: submitButtonTextColor,
        }}
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? 'Skickar...' : 'Skicka'}
      </button>
    </form>
  )
}
```

**Key Features:**
- Handles all field types: text, email, tel, textarea, select, checkbox, radio
- Client-side validation with HTML5 `required` attribute
- Loading states with spinner
- Success message after submission
- Error handling with user-friendly messages
- Form reset after successful submission
- Custom button colors from CMS

---

## Step 5: Create Submit API Route

**File: `app/api/submit-form/route.ts`**

This API route forwards submissions to the Frontspace backend:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get the base URL from the GraphQL endpoint (remove /api/graphql)
    const baseUrl = process.env.FRONTSPACE_API_URL!.replace('/api/graphql', '')

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
```

**Important:**
- Strips `/api/graphql` from `FRONTSPACE_API_URL` to get base URL
- Frontspace backend handles:
  - Email sending (to admin and/or user)
  - Submission storage in database
  - Email template rendering
  - Validation

---

## Step 6: Register Form Block in BlockRenderer

**File: `components/BlockRenderer.tsx`**

Add the form block to your block type mapping:

```typescript
import FormBlock from './blocks/FormBlock'

// Inside BlockRenderer component:
const blockComponents: Record<string, any> = {
  container: ContainerBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
  form: FormBlock, // ← Add this
  // ... other block types
}
```

---

## Step 7: Environment Variables

Make sure these are set in `.env.local`:

```bash
# Required
FRONTSPACE_API_URL=http://localhost:3000/api/graphql
FRONTSPACE_STORE_ID=your-store-id
FRONTSPACE_API_KEY=fs_xxxxxxxxxxxxx

# Required for client-side form submission
NEXT_PUBLIC_FRONTSPACE_STORE_ID=your-store-id
```

**Note:** The `NEXT_PUBLIC_` prefix exposes the store ID to the browser, which is required for the client-side form submission.

---

## How It Works: Complete Flow

### 1. Page Load (Server Side)
```
User visits page
    ↓
BlockRenderer renders blocks
    ↓
FormBlock server component
    ↓
getTenantClient() → getForm(formId) via GraphQL
    ↓
Checks if form.status === 'active'
    ↓
Passes form data to FormComponent
```

### 2. User Interaction (Client Side)
```
User fills out form fields
    ↓
FormComponent updates state on each change
    ↓
User clicks submit button
    ↓
handleSubmit() triggered
```

### 3. Form Submission (Client → Server → Backend)
```
fetch('/api/submit-form', {
  method: 'POST',
  body: JSON.stringify({
    storeId: 'xxx',
    formId: 'yyy',
    formData: { name: 'John', email: 'john@example.com' }
  })
})
    ↓
API Route: app/api/submit-form/route.ts
    ↓
fetch(`${baseUrl}/api/forms/submit`, {
  method: 'POST',
  body: JSON.stringify(body)
})
    ↓
Frontspace Backend:
  - Validates data
  - Sends email to admin (if configured)
  - Sends confirmation email to user (if enabled)
  - Stores submission in database
    ↓
Returns success response
    ↓
FormComponent shows success message
```

---

## Supported Field Types

The implementation supports all Frontspace form field types:

| Type | HTML Element | Special Handling |
|------|-------------|------------------|
| `text` | `<input type="text">` | Standard text input |
| `email` | `<input type="email">` | Email validation |
| `tel` | `<input type="tel">` | Phone number input |
| `textarea` | `<textarea>` | Multi-line text |
| `select` | `<select>` | Dropdown with options |
| `checkbox` | `<input type="checkbox">` | Boolean value |
| `radio` | `<input type="radio">` | Single choice from options |

---

## Validation

### Client-Side Validation
- HTML5 `required` attribute on required fields
- Browser native validation for email and tel fields
- Form won't submit until all required fields are filled

### Server-Side Validation
- Handled by Frontspace backend
- Checks required fields
- Validates email format
- Returns error messages if validation fails

---

## Error Handling

The implementation has multiple layers of error handling:

1. **Form not found**: Returns null (graceful)
2. **Form inactive**: Returns null (graceful)
3. **GraphQL fetch error**: Logs error, returns null
4. **Submission error**: Shows error message to user
5. **Network error**: Shows error message to user

---

## Multi-Tenant Support

The forms system is fully multi-tenant compatible:

- Uses `getTenantClient()` to get tenant-specific client
- Each tenant can have their own forms
- Form submissions are scoped to tenant's store
- Email settings are per-tenant in Frontspace backend

---

## Testing Checklist

After implementation, test these scenarios:

### ✅ Form Loading
- [ ] Form appears on page
- [ ] All fields render correctly
- [ ] Required fields show asterisk (*)
- [ ] Placeholders display properly

### ✅ Field Types
- [ ] Text input works
- [ ] Email input validates
- [ ] Tel input works
- [ ] Textarea expands
- [ ] Select dropdown opens
- [ ] Checkboxes toggle
- [ ] Radio buttons work (single selection)

### ✅ Validation
- [ ] Can't submit empty required fields
- [ ] Email field requires valid email
- [ ] Error message shows for missing required fields

### ✅ Submission
- [ ] Loading spinner shows during submission
- [ ] Success message appears after successful submit
- [ ] Error message shows if submission fails
- [ ] Form resets after successful submission

### ✅ Email Delivery
- [ ] Admin receives email (if configured)
- [ ] User receives confirmation email (if enabled)
- [ ] Email contains all submitted data
- [ ] Subject line is correct

### ✅ Edge Cases
- [ ] Form with no fields selected shows nothing
- [ ] Inactive form shows nothing
- [ ] Non-existent form shows nothing
- [ ] Network error shows user-friendly message

---

## Customization Options

### Button Styling
In Frontspace CMS, the form block has these customization options:
- `submitButtonColor` - Background color of submit button
- `submitButtonTextColor` - Text color of submit button

These are passed from CMS to the FormComponent:

```typescript
<FormComponent
  form={form}
  submitButtonColor={content.submitButtonColor || '#0A0D26'}
  submitButtonTextColor={content.submitButtonTextColor || '#ffffff'}
/>
```

### Input Styling
To customize input styling, modify `baseInputClasses` in FormComponent:

```typescript
const baseInputClasses = `
  w-full px-4 py-3 rounded-lg border border-gray-300
  focus:ring-2 focus:ring-blue-500 focus:border-transparent
  transition-all duration-200
  placeholder:text-gray-400
  disabled:bg-gray-50 disabled:cursor-not-allowed
`
```

### Success/Error Messages
To customize messages, edit these sections in FormComponent:

**Success:**
```typescript
<h3>Tack!</h3>
<p>Ditt formulär har skickats. Vi återkommer så snart som möjligt.</p>
```

**Error:**
```typescript
<p className="text-red-700">{error}</p>
```

---

## Common Issues & Solutions

### Issue: Form doesn't appear
**Solution:** Check that:
1. Form exists in Frontspace CMS
2. Form status is 'active'
3. Form ID is correctly set in block content
4. GraphQL query returns data

### Issue: Submission fails with 500 error
**Solution:** Check that:
1. `FRONTSPACE_API_URL` is correct
2. Backend API is running
3. Network can reach backend
4. Form configuration is valid in CMS

### Issue: No email received
**Solution:** Check in Frontspace CMS:
1. Form email settings are configured
2. SMTP settings are correct in backend
3. Email addresses are valid
4. Check spam folder

### Issue: Form submits but shows error
**Solution:**
1. Check browser console for details
2. Check backend logs
3. Verify form validation rules
4. Check required field configuration

---

## Differences from Non-Headless Forms

In a traditional Frontspace site, forms work differently:

| Feature | Headless | Non-Headless |
|---------|----------|--------------|
| **Rendering** | React components | PHP templates |
| **Submission** | API route → Backend | Direct POST to backend |
| **Validation** | Client + Backend | Server-side only |
| **Email** | Backend handles | Backend handles |
| **Storage** | Backend database | Backend database |
| **Styling** | Tailwind CSS | Custom CSS |

**Important:** The headless implementation requires the API route (`/api/submit-form`) to forward submissions to the Frontspace backend, which handles email sending and storage.

---

## Summary

This forms implementation:
- ✅ Fetches forms from Frontspace CMS via GraphQL
- ✅ Renders all field types (text, email, textarea, select, checkbox, radio)
- ✅ Validates on client and server
- ✅ Submits to Frontspace backend for email handling
- ✅ Shows loading, success, and error states
- ✅ Supports multi-tenant architecture
- ✅ Fully customizable styling
- ✅ Graceful error handling

The key to success is understanding the flow: **Server fetches → Client renders → Client submits → Server forwards → Backend processes**
