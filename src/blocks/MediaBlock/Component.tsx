import type { StaticImageData } from 'next/image'
import React from 'react'
import type { MediaBlock as MediaBlockProps } from '@/types'
import { Media } from '@/app/components/Media/index'
import RichText from '@/app/components/RichText/index'
import { cn } from '@/lib/utils'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  imgClassName?: string
  staticImage?: StaticImageData
}

export const MediaBlock: React.FC<Props> = ({
  captionClassName,
  className,
  imgClassName,
  media,
  staticImage,

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
  const caption = media && typeof media === 'object' ? media.caption : null

  const formatUnit = (value: string | null | undefined, unit: string | null | undefined) =>
    value && unit ? `${value}${unit === 'percent' ? '%' : unit}` : undefined

  const hasAnyPadding =
    paddingValue ||
    paddingTop ||
    paddingBottom ||
    paddingLeft ||
    paddingRight

  const defaultPadding = '0rem'

  const style: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),

    ...(widthValue && widthUnit && { width: formatUnit(widthValue, widthUnit) }),
    ...(heightValue && heightUnit && { height: formatUnit(heightValue, heightUnit) }),

    ...(hasAnyPadding
      ? {
          ...(paddingValue && paddingUnit && { padding: formatUnit(paddingValue, paddingUnit) }),
          ...(paddingTop && paddingUnit && { paddingTop: formatUnit(paddingTop, paddingUnit) }),
          ...(paddingBottom && paddingUnit && { paddingBottom: formatUnit(paddingBottom, paddingUnit) }),
          ...(paddingLeft && paddingUnit && { paddingLeft: formatUnit(paddingLeft, paddingUnit) }),
          ...(paddingRight && paddingUnit && { paddingRight: formatUnit(paddingRight, paddingUnit) }),
        }
      : { padding: defaultPadding }),

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
    <div className={cn('', className)} style={style}>
      {(media || staticImage) && (
        <Media
          imgClassName={cn('rounded border-border', imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div className={cn('mt-6', captionClassName)}>
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
