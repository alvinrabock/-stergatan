import Link from 'next/link'
import React from 'react'
import type { Media as MediaType, Page, Post } from '@/types'
import { Media } from '../Media/index'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '../ui/Button'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null

  backgroundColor?: string | null
  textColor?: string | null
  widthValue?: string | null
  widthUnit?: string | null
  heightValue?: string | null
  heightUnit?: string | null

  paddingValue?: string | null
  paddingUnit?: string | null
  enablePaddingAllSides?: boolean | null
  paddingTop?: string | null
  paddingRight?: string | null
  paddingBottom?: string | null
  paddingLeft?: string | null

  marginValue?: string | null
  marginUnit?: string | null
  enableMarginAllSides?: boolean | null
  marginTop?: string | null
  marginRight?: string | null
  marginBottom?: string | null
  marginLeft?: string | null

  borderRadiusValue?: string | null
  borderRadiusUnit?: string | null
  enableBorderRadiusAllSides?: boolean | null
  borderRadiusTopLeft?: string | null
  borderRadiusTopRight?: string | null
  borderRadiusBottomRight?: string | null
  borderRadiusBottomLeft?: string | null

  icon?: string | MediaType | null | undefined
  iconPosition?: 'left' | 'right' | null
  iconSize?: number | null
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance = 'inline',
  children,
  className,
  label,
  newTab,
  reference,
  url,

  backgroundColor,
  textColor,
  widthValue,
  widthUnit,
  heightValue,
  heightUnit,
  paddingValue,
  paddingUnit,
  enablePaddingAllSides,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  marginValue,
  marginUnit,
  enableMarginAllSides,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  borderRadiusValue,
  borderRadiusUnit,
  enableBorderRadiusAllSides,
  borderRadiusTopLeft,
  borderRadiusTopRight,
  borderRadiusBottomRight,
  borderRadiusBottomLeft,

  icon,
  iconPosition = 'left',
  iconSize = 20,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? reference?.relationTo === 'pages'
        ? reference.value.slug // Already contains full path like /partners/partnernivaer
        : `/${reference?.relationTo}/${reference.value.slug.replace(/^\//, '')}` // Remove leading slash if present
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const safeCSSValue = (val: string | null | undefined) => val ?? undefined

  const inlineStyle: React.CSSProperties = {
    backgroundColor: safeCSSValue(backgroundColor),
    color: safeCSSValue(textColor),

    width: widthValue && widthUnit ? `${widthValue}${widthUnit === 'percent' ? '%' : widthUnit}` : undefined,
    height: heightValue && heightUnit ? `${heightValue}${heightUnit === 'percent' ? '%' : heightUnit}` : undefined,

    padding: !enablePaddingAllSides && paddingValue && paddingUnit
      ? `${paddingValue}${paddingUnit === 'percent' ? '%' : paddingUnit}`
      : undefined,

    paddingTop: enablePaddingAllSides ? safeCSSValue(paddingTop) : undefined,
    paddingRight: enablePaddingAllSides ? safeCSSValue(paddingRight) : undefined,
    paddingBottom: enablePaddingAllSides ? safeCSSValue(paddingBottom) : undefined,
    paddingLeft: enablePaddingAllSides ? safeCSSValue(paddingLeft) : undefined,

    margin: !enableMarginAllSides && marginValue && marginUnit
      ? `${marginValue}${marginUnit === 'percent' ? '%' : marginUnit}`
      : undefined,

    marginTop: enableMarginAllSides ? safeCSSValue(marginTop) : undefined,
    marginRight: enableMarginAllSides ? safeCSSValue(marginRight) : undefined,
    marginBottom: enableMarginAllSides ? safeCSSValue(marginBottom) : undefined,
    marginLeft: enableMarginAllSides ? safeCSSValue(marginLeft) : undefined,

    borderRadius: !enableBorderRadiusAllSides && borderRadiusValue && borderRadiusUnit
      ? `${borderRadiusValue}${borderRadiusUnit === 'percent' ? '%' : borderRadiusUnit}`
      : undefined,

    borderTopLeftRadius: enableBorderRadiusAllSides ? safeCSSValue(borderRadiusTopLeft) : undefined,
    borderTopRightRadius: enableBorderRadiusAllSides ? safeCSSValue(borderRadiusTopRight) : undefined,
    borderBottomRightRadius: enableBorderRadiusAllSides ? safeCSSValue(borderRadiusBottomRight) : undefined,
    borderBottomLeftRadius: enableBorderRadiusAllSides ? safeCSSValue(borderRadiusBottomLeft) : undefined,
  }

  const renderIcon = () => {
    if (!icon || typeof icon !== 'object' || !('url' in icon)) return null;

    return (
      <span
        style={{
          display: 'inline-block',
          width: iconSize ?? undefined,   
          height: iconSize ?? undefined,  
          objectFit: 'contain',
          verticalAlign: 'middle',
          ...(iconPosition === 'left'
            ? { marginRight: '0.5rem' }
            : { marginLeft: '0.5rem' }),
        }}
      >
        <Media
          resource={icon}
          alt={icon.alt || icon.filename || 'icon'}
        />
      </span>

    )
  }

  const content = (
    <>
      {iconPosition === 'left' && renderIcon()}
      {label}
      {iconPosition === 'right' && renderIcon()}
      {children}
    </>
  )

  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps} style={inlineStyle}>
        {content}
      </Link>
    )
  }

  return (
    <Button asChild className={className} variant={appearance} style={inlineStyle}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {content}
      </Link>
    </Button>
  )
}
