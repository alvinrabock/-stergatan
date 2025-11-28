'use client'
import { cn } from '@/lib/utils'
import { Post } from '@/types'
import useClickableCard from '@/utils/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { Media } from '../Media/index'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
    alignItems?: 'center'
    className?: string
    doc?: CardPostData
    relationTo?: 'nyheter'
    showCategories?: boolean
    title?: string
}> = (props) => {
    const { card, link } = useClickableCard({})
    const { className, doc, relationTo, showCategories, title: titleFromProps } = props

    const { slug, categories, meta, title } = doc || {}
    const { image: metaImage } = meta || {}

    const hasCategories = categories && Array.isArray(categories) && categories.length > 0
    const titleToUse = titleFromProps || title
    const href = `/${relationTo}/${slug}`

    return (
        <article
            className={cn(
                'overflow-hidden hover:cursor-pointer',
                className,
            )}
            ref={card.ref}
        >
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded">
                {!metaImage && (
                    <div className="bg-gray-200 h-full flex items-center justify-center">
                        Ingen bild tillgänglig
                    </div>
                )}
                {metaImage && (
                    <Media
                        fill
                        size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        imgClassName="absolute inset-0 w-full h-full object-cover"
                        resource={metaImage}
                        loading="lazy"
                    />
                )}
            </div>
            <div className="py-4">
                {showCategories && hasCategories && (
                    <div className="uppercase text-muted-foreground text-sm mb-1">
                        {showCategories && hasCategories && (
                            <div>
                                {categories?.map((category, index) => {
                                    if (typeof category === 'object') {
                                        const { title: titleFromCategory } = category

                                        const categoryTitle = titleFromCategory || 'Untitled category'

                                        const isLast = index === categories.length - 1

                                        return (
                                            <Fragment key={index}>
                                                {categoryTitle}
                                                {!isLast && <Fragment>, &nbsp;</Fragment>}
                                            </Fragment>
                                        )
                                    }

                                    return null
                                })}
                            </div>
                        )}
                    </div>
                )}
                {titleToUse && (
                    <div className="prose">
                        <h3>
                            <Link className="not-prose" href={href} ref={link.ref}>
                                {titleToUse}
                            </Link>
                        </h3>
                    </div>
                )}
            </div>
        </article>
    )
}