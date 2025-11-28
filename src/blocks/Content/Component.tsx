import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/types'
import RichText from '@/app/components/RichText/index'

export const ContentBlock: React.FC<ContentBlockProps> = ({
  richText,

  backgroundColor,
  textColor,

  widthValue,
  widthUnit,
  heightValue,
  heightUnit,

  paddingValue,
  paddingUnit,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,

  marginValue,
  marginUnit,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,

  borderRadiusValue,
  borderRadiusUnit,
}) => {
  const formatUnit = (value: string | null | undefined, unit: string | null | undefined) =>
    value && unit ? `${value}${unit === 'percent' ? '%' : unit}` : undefined

  const style: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),

    ...(widthValue && widthUnit && { width: formatUnit(widthValue, widthUnit) }),
    ...(heightValue && heightUnit && { height: formatUnit(heightValue, heightUnit) }),

    ...(paddingValue && paddingUnit && { padding: formatUnit(paddingValue, paddingUnit) }),
    ...(paddingTop && paddingUnit && { paddingTop: formatUnit(paddingTop, paddingUnit) }),
    ...(paddingBottom && paddingUnit && { paddingBottom: formatUnit(paddingBottom, paddingUnit) }),
    ...(paddingLeft && paddingUnit && { paddingLeft: formatUnit(paddingLeft, paddingUnit) }),
    ...(paddingRight && paddingUnit && { paddingRight: formatUnit(paddingRight, paddingUnit) }),

    ...(marginValue && marginUnit && { margin: formatUnit(marginValue, marginUnit) }),
    ...(marginTop && marginUnit && { marginTop: formatUnit(marginTop, marginUnit) }),
    ...(marginBottom && marginUnit && { marginBottom: formatUnit(marginBottom, marginUnit) }),
    ...(marginLeft && marginUnit && { marginLeft: formatUnit(marginLeft, marginUnit) }),
    ...(marginRight && marginUnit && { marginRight: formatUnit(marginRight, marginUnit) }),

    ...(borderRadiusValue && borderRadiusUnit && {
      borderRadius: formatUnit(borderRadiusValue, borderRadiusUnit),
    }),
  }

  return (
    <div style={style}>
      {richText && <RichText data={richText} enableGutter={false} />}
    </div>
  )
}
