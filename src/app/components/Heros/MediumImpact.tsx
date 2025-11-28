import React from 'react'

import { Page } from '@/types'
import MaxWidthWrapper from '../MaxWidthWrapper'
import RichText from '../RichText/index'
import { CMSLink } from '../Link/index'
import { Media } from '../Media/index'


export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
    return (
        <div className="pt-46 pb-16">
            <MaxWidthWrapper>
                <div className='mb-10'>
                    {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

                    {Array.isArray(links) && links.length > 0 && (
                        <ul className="flex gap-4">
                            {links.map(({ link }, i) => {
                                return (
                                    <li key={i}>
                                        <CMSLink {...link} />
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
                {media && typeof media === 'object' && (
                    <div>
                        <Media
                            className="-mx-4 md:-mx-8 2xl:-mx-16 rounded overflow-hidden"
                            imgClassName=""
                            priority
                            resource={media}
                        />
                        {media?.caption && (
                            <div className="mt-3">
                                <RichText data={media.caption} enableGutter={false} />
                            </div>
                        )}
                    </div>
                )}
            </MaxWidthWrapper>
        </div>
    )
}