import { Page } from '@/types'
import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper'
import RichText from '../RichText/index'



type LowImpactHeroType =
    | {
        children?: React.ReactNode
        richText?: never
    }
    | (Omit<Page['hero'], 'richText'> & {
        children?: never
        richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
    return (
        <div className="w-full pt-40">
            <MaxWidthWrapper>
                {children || (richText && <RichText data={richText} enableGutter={false} />)}
            </MaxWidthWrapper>
        </div>
    )
}