import React from 'react';
import { fetchPosts } from '@/lib/frontspace/client';

interface PartnernivaItem {
    id: string;
    title: string;
    investering_fran: string;
    kort_beskrivning?: string;
    publishedAt: string;
    ingar_i_paket?: { _entryId: string; text: string }[];
}

export default async function PartnernivaerComponent() {
    try {
        // Fetch partnernivaer from Frontspace
        const { posts } = await fetchPosts('partnernivaer', { limit: 100 });

        if (!posts || posts.length === 0) {
            return (
                <div className="text-center text-gray-500">
                    Inga partnernivåer tillgängliga.
                </div>
            );
        }

        // Transform Frontspace data to match expected format
        const partnernivaerData: PartnernivaItem[] = posts.map((nivå: any) => {
            // Parse content if it's a string
            let content = nivå.content || {};
            if (typeof content === 'string') {
                try {
                    content = JSON.parse(content);
                } catch {
                    content = {};
                }
            }

            return {
                id: nivå.id,
                title: nivå.title,
                investering_fran: content.investering_fran || content.investering || '',
                kort_beskrivning: content.kort_beskrivning || content.kortbeskrivning,
                publishedAt: nivå.published_at || nivå.created_at,
                ingar_i_paket: content.ingar_i_paket || content.Ingaripaketet || [],
            };
        });

        return (
            <div className="w-full">
                {partnernivaerData && partnernivaerData.length > 0 ? (
                    <div className="space-y-12">
                        {partnernivaerData.map((nivå) => (
                            <div key={nivå.id} className="bg-custom_dark_red border border-white/10 p-6 rounded-xl shadow-md">
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-1 text-white">{nivå.title}</h3>
                                    <p className="text-md text-white/65 pb-2">
                                        Investering: {nivå.investering_fran}
                                    </p>
                                    {nivå.kort_beskrivning && (
                                        <p className="text-white/80 mt-2">{nivå.kort_beskrivning}</p>
                                    )}
                                    <ul className="mt-4 space-y-4 border-t border-white/20 pt-4">
                                        {nivå.ingar_i_paket && nivå.ingar_i_paket.length > 0 ? (
                                            nivå.ingar_i_paket.map((punkt) => (
                                                <li key={punkt._entryId} className="flex items-start gap-2 text-white">
                                                    <img
                                                        src="/oster-vit-logotype.png"
                                                        alt={nivå.title}
                                                        width={22}
                                                        height={12}
                                                        className="mt-1"
                                                    />
                                                    <span className="text-base leading-relaxed">{punkt.text}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-white/50">Inga specifika förmåner listade för denna nivå.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-300 text-center">Ingen partnernivådata tillgänglig för tillfället.</p>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error fetching partner nivåer:', error);
        return (
            <div className="text-center text-gray-500">
                Ett fel uppstod vid hämtning av partnernivåer.
            </div>
        );
    }
}
