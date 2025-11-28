'use client';

import React, { useCallback, useRef } from 'react';
import { DownloadAssetsBlock as DownloadAssetsBlockType } from '@/types';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/Button';
import { Media } from '@/app/components/Media/index';

export const DownloadAssetsBlock = ({
    sectionTitle,
    sectionDescription,
    assets,
}: DownloadAssetsBlockType) => {
    // Extract the asset item type from the array
    type AssetItem = NonNullable<DownloadAssetsBlockType['assets']>[number];

    const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleDownload = useCallback(async (item: AssetItem) => {
        const media = typeof item.asset === 'object' ? item.asset : null;
        const name = media?.filename || item.title || 'download';
        const url = media?.url || (typeof item.asset === 'string' ? `/media/${item.asset}` : '');

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('Download failed', err);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, []);

    const debouncedDownload = (e: React.MouseEvent, item: AssetItem) => {
        e.stopPropagation();
        if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);
        downloadTimeoutRef.current = setTimeout(() => handleDownload(item), 300);
    };

    if (!assets || assets.length === 0) return null;

    return (
        <section className="py-16 w-full">

            {sectionTitle && <h2 className="text-3xl font-bold mb-4 text-white">{sectionTitle}</h2>}
            {sectionDescription && (
                <p className="mb-10 text-white text-lg">{sectionDescription}</p>
            )}

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {assets.map((item, i) => {
                    const media = typeof item.asset === 'object' ? item.asset : null;

                    return (
                        <Card key={i} className="flex items-start gap-4 overflow-hidden p-4 bg-transparent border-white/30">
                            <div className="w-full aspect-[6/2] flex-shrink-0 relative rounded border bg-custom_dark_red overflow-hidden">
                                {media ? (
                                    <Media
                                        resource={media}
                                        alt={media?.alt || item.title || ''}
                                        fill
                                        imgClassName="object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Download className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-0 w-full flex flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                </div>

                                <div className="mt-3">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => debouncedDownload(e, item)}
                                    >
                                        <Download className="w-4 h-4 text-white" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

        </section>
    );
};
