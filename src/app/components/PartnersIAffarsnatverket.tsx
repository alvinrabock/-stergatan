import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchPartnersInAffarsnatverket } from '@/lib/frontspace/adapters/partners';
import { Partner } from '@/types';

const PartnersIAffarsnatverket = async () => {
  try {
    const partners: Partner[] = await fetchPartnersInAffarsnatverket();

    if (!partners?.length) return null;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 w-full">
        {partners.map((partner) => {
          // Extract logo URL from logotyp
          const logoUrl = typeof partner.logotyp === 'string'
            ? partner.logotyp
            : partner.logotyp?.url;

          const partnerLink = partner.link || partner.webbplats || '#';

          return (
            <Link
              key={partner.id}
              href={partnerLink}
              target={partnerLink !== '#' ? "_blank" : "_self"}
              rel={partnerLink !== '#' ? "noopener noreferrer" : undefined}
              className="flex items-center justify-center group transition-opacity hover:opacity-80"
              aria-label={`Visit ${partner.title}'s website`}
              prefetch={false}
            >
              {logoUrl ? (
                <div className="relative w-32 aspect-[3/2] flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt={`${partner.title} logo`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <span className="text-white/80 font-bold text-sm text-left group-hover:text-white transition-colors">
                  {partner.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('Error fetching partners in Affärsnatverket:', error);
    return null;
  }
};

export default PartnersIAffarsnatverket;
