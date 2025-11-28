/**
 * Form Block Component
 *
 * Renders Frontspace CMS forms with full styling support
 * Fetches form data from API and displays using FormComponent
 */

import React from 'react'
import { frontspace } from '@/lib/frontspace/client'
import { FormComponent } from '@/app/components/FormComponent'

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

/**
 * Generate CSS for form styling with responsive support
 */
function generateFormCSS(blockId: string, content: any, responsiveStyles: any): string {
  let css = `.form-block-${blockId} {\n`

  // Non-responsive styles from content
  if (content.fieldBackgroundColor) {
    css += `  --field-background-color: ${content.fieldBackgroundColor};\n`
  }
  if (content.fieldBorderColor) {
    css += `  --field-border-color: ${content.fieldBorderColor};\n`
  }
  if (content.submitButtonBorderColor) {
    css += `  --submit-button-border-color: ${content.submitButtonBorderColor};\n`
  }

  // Responsive styles - desktop values as base
  const rs = responsiveStyles || {}
  if (rs.fieldTextColor?.desktop) {
    css += `  --field-text-color: ${rs.fieldTextColor.desktop};\n`
  }
  if (rs.labelColor?.desktop) {
    css += `  --label-color: ${rs.labelColor.desktop};\n`
  }
  if (rs.submitButtonColor?.desktop) {
    css += `  --submit-button-color: ${rs.submitButtonColor.desktop};\n`
  }
  if (rs.submitButtonTextColor?.desktop) {
    css += `  --submit-button-text-color: ${rs.submitButtonTextColor.desktop};\n`
  }

  css += `}\n`

  // Tablet overrides
  const hasTablet = rs.fieldTextColor?.tablet || rs.labelColor?.tablet ||
    rs.submitButtonColor?.tablet || rs.submitButtonTextColor?.tablet
  if (hasTablet) {
    css += `@media (min-width: 768px) and (max-width: 1023px) {\n`
    css += `  .form-block-${blockId} {\n`
    if (rs.fieldTextColor?.tablet) css += `    --field-text-color: ${rs.fieldTextColor.tablet};\n`
    if (rs.labelColor?.tablet) css += `    --label-color: ${rs.labelColor.tablet};\n`
    if (rs.submitButtonColor?.tablet) css += `    --submit-button-color: ${rs.submitButtonColor.tablet};\n`
    if (rs.submitButtonTextColor?.tablet) css += `    --submit-button-text-color: ${rs.submitButtonTextColor.tablet};\n`
    css += `  }\n}\n`
  }

  // Mobile overrides
  const hasMobile = rs.fieldTextColor?.mobile || rs.labelColor?.mobile ||
    rs.submitButtonColor?.mobile || rs.submitButtonTextColor?.mobile
  if (hasMobile) {
    css += `@media (max-width: 767px) {\n`
    css += `  .form-block-${blockId} {\n`
    if (rs.fieldTextColor?.mobile) css += `    --field-text-color: ${rs.fieldTextColor.mobile};\n`
    if (rs.labelColor?.mobile) css += `    --label-color: ${rs.labelColor.mobile};\n`
    if (rs.submitButtonColor?.mobile) css += `    --submit-button-color: ${rs.submitButtonColor.mobile};\n`
    if (rs.submitButtonTextColor?.mobile) css += `    --submit-button-text-color: ${rs.submitButtonTextColor.mobile};\n`
    css += `  }\n}\n`
  }

  // Browser autofill styling
  css += `
.form-block-${blockId} input:-webkit-autofill,
.form-block-${blockId} input:-webkit-autofill:hover,
.form-block-${blockId} input:-webkit-autofill:focus,
.form-block-${blockId} textarea:-webkit-autofill,
.form-block-${blockId} select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px var(--field-background-color, #ffffff) inset !important;
  -webkit-text-fill-color: var(--field-text-color, #000000) !important;
  caret-color: var(--field-text-color, #000000) !important;
  transition: background-color 5000s ease-in-out 0s;
}
`

  return css
}

export default async function FormBlock({ block, blockId }: FormBlockProps) {
  const content = block.content || {}
  const formId = content.selectedFormId

  // If no form selected, return null
  if (!formId) {
    return null
  }

  try {
    // Fetch the form from API
    const form = await frontspace.forms.getById(formId)

    // If form not found or not active, return null
    if (!form || form.status !== 'active') {
      return null
    }

    // Generate form-specific CSS
    const formCSS = generateFormCSS(blockId, content, block.responsiveStyles)

    return (
      <>
        {formCSS && <style dangerouslySetInnerHTML={{ __html: formCSS }} />}
        <div
          className={`form-block form-block-${blockId} block-${blockId}`}
          data-block-id={blockId}
        >
          <FormComponent
            form={form}
            blockId={blockId}
            submitButtonText={content.submitButtonText}
            confirmationMessage={content.confirmationMessage}
            fieldBackgroundColor={content.fieldBackgroundColor}
            fieldBorderColor={content.fieldBorderColor}
            submitButtonBorderColor={content.submitButtonBorderColor}
            submitButtonWidth={content.submitButtonWidth}
            labelFontSize={content.labelFontSize}
            inputFontSize={content.inputFontSize}
          />
        </div>
      </>
    )
  } catch (error) {
    // Silently fail - form doesn't exist or backend error
    // This prevents pages with broken forms from crashing
    console.error('Error loading form:', error)
    return null
  }
}
