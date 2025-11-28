import { Foretagspaket } from '@/types';
import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import Image from 'next/image';

interface ForetagsPaketItemProps {
    item: Foretagspaket;
}

const ForetagsPaketItem: React.FC<ForetagsPaketItemProps> = ({ item }) => {

    if (!item) return null;

    const linkUrl = item.enableLink
        ? item.link?.internal && typeof item.link.internal === 'object' && 'slug' in item.link.internal
            ? `/${item.link.internal.slug}`
            : item.link?.custom || '#'
        : '#';

    const hasInternalSlug =
        item.link?.internal &&
        typeof item.link.internal === 'object' &&
        'slug' in item.link.internal;

    const hasLink = item.enableLink && (hasInternalSlug || item.link?.custom);

    // Extract image URL from heroImage
    const imageUrl = typeof item.heroImage === 'string'
        ? item.heroImage
        : item.heroImage?.url;

    return (
        <div key={item.id} className="bg-custom_dark_red rounded-lg overflow-hidden flex flex-col">
            {/* Image section */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.title || 'Partner package'}
                        fill
                        sizes="(max-width: 1025px) 50vw, (max-width: 1280px) 36vw, 25vw"
                        className="object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-white text-xl font-semibold">
                        Ingen bild tillgänglig
                    </div>
                )}
            </div>

            {/* Card content */}
            <div className="p-6 flex-1 text-white">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm mt-2">{item.shortDescription}</p>

                <div className="ingår-i-paketet mt-4">
                    {Array.isArray(item.Ingaripaketet) && item.Ingaripaketet.map((subItem) => (
                        <p key={subItem.id} className="flex items-center text-sm text-gray-400">
                            <span className="mr-2 text-white">✔</span>
                            {subItem.text}
                        </p>
                    ))}
                </div>
            </div>

            <div className="p-4 mt-auto">
                <p className="text-lg font-bold my-4 text-white">{item.price}</p>
                {hasLink && (
                    <Link href={linkUrl} className="w-full">
                        <Button variant="outline" className='w-full' >
                            Läs mer
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ForetagsPaketItem;