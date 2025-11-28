import React from 'react';
import Link from 'next/link';
import { fetchHuvudpartners } from '@/lib/frontspace/adapters/partners';

export default async function HuvudpartnerComponentFooter() {
    const huvudpartners = await fetchHuvudpartners();

    if (!huvudpartners || huvudpartners.length === 0) {
        return null;
    }

    return (
        <div className="bg-transparent overflow-hidden">
            <ul className="flex justify-between items-center gap-2 sm:gap-4 md:gap-6 overflow-hidden">
                {huvudpartners.map((partner) => (
                    <li key={partner.id} className="flex justify-center items-center flex-shrink-0">
                        <div className="relative h-3 w-6 xs:h-4 xs:w-8 sm:w-14 sm:h-7">
                            {partner.webbplats ? (
                                <Link
                                    href={partner.webbplats}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full relative"
                                >
                                    <img
                                        src={typeof partner.logotyp === 'object' && partner.logotyp ? partner.logotyp.url || '' : ''}
                                        alt={partner.namn || partner.title}
                                        className="w-full h-full object-contain"
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={typeof partner.logotyp === 'object' && partner.logotyp ? partner.logotyp.url || '' : ''}
                                    alt={partner.namn || partner.title}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
