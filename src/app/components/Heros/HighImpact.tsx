'use client'
import React from 'react'

import { Page } from '@/types'
import MaxWidthWrapper from '../MaxWidthWrapper'
import { Media } from '../Media/index'
import RichText from '../RichText/index'
import { CMSLink } from '../Link/index'
import { useUIContext } from '@/providers/ui-context'
import { useEffect } from 'react'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {

    const { setIsHeroVisible } = useUIContext();

    useEffect(() => {
        setIsHeroVisible(true);
        return () => setIsHeroVisible(false);
    }, [setIsHeroVisible]);


    return (
        <div
            className="w-full relative h-[80svh] min-h-[900px] py-40 flex items-center justify-center text-white"
            data-theme="dark"
        >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                {media && typeof media === 'object' && (
                    <Media fill imgClassName="object-cover" priority resource={media} size="(max-width: 768px) 100vw, 90vw" />
                )}
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-custom_dark_dark_red via-custom_dark_dark_red/70 to-custom_dark_dark_red/50 pointer-events-none" />

            {/* Content on top of the background image */}
            <div className="relative z-10 w-full mb-8 flex items-center justify-center">
                <MaxWidthWrapper>
                    <div className="text-left w-full md:w-1/2">
                        {/* RichText Component */}
                        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

                        {/* Links Section */}
                        {Array.isArray(links) && links.length > 0 && (
                            <ul className="flex gap-4">
                                {links.map(({ link }, i) => (
                                    <li key={i}>
                                        <CMSLink {...link} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </MaxWidthWrapper>
            </div>
        </div>
    )
}
