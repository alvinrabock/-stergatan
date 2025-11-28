  'use client'

  import React from 'react'
  import type { FaqBlock as FaqBlockType } from '@/types'
  import RichText from '@/app/components/RichText/index'
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/app/components/ui/accordion'

  export const FaqBlock: React.FC<FaqBlockType> = ({
    faqs,

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
    if (!faqs || faqs.length === 0) return null

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
        <Accordion type="multiple" className="space-y-2 w-full">
          {faqs.map(({ question, answer }, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="w-full !border-b border-white/20"
            >
              <AccordionTrigger className="w-full text-left text-lg sm:text-xl font-medium text-white hover:bg-muted/10">
                {question}
              </AccordionTrigger>
              <AccordionContent className="pt-2 w-full prose-invert">
                {answer && <RichText data={answer} enableGutter={false} />}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }
