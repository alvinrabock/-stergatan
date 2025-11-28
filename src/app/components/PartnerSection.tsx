import React from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAllPartners } from "@/lib/frontspace/adapters/partners";
import { fetchPosts } from "@/lib/frontspace/client";
import { Partner } from "@/types";

// Partner logo component using Next.js Image
const PartnerLogo = ({ partner }: { partner: Partner }) => {
  // Extract logo URL from logotyp
  const logoUrl = typeof partner.logotyp === 'string'
    ? partner.logotyp
    : partner.logotyp?.url;

  // Debug logging
  if (!logoUrl) {
    console.log(`⚠️ No logo for partner: ${partner.title}`, {
      logotyp: partner.logotyp,
      logotype: partner.logotype,
    });
  }

  const content = logoUrl ? (
    <div className="transition-transform duration-200 group-hover:scale-105 relative w-full h-[120px]">
      <Image
        src={logoUrl}
        alt={partner.title}
        fill
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
        className="p-4 object-contain"
        loading="lazy"
      />
    </div>
  ) : (
    <span className="text-white/80 font-bold text-sm text-left transition-colors group-hover:text-white">
      {partner.title}
    </span>
  );

  // Use webbplats field for link
  const partnerLink = partner.webbplats;

  if (partnerLink) {
    return (
      <Link
        href={partnerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center group"
        prefetch={false}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {content}
    </div>
  );
};

// Partner grid component
const PartnerGrid = ({ partners }: { partners: Partner[] }) => {
  // Sort partners alphabetically by title
  const sortedPartners = [...partners].sort((a, b) =>
    a.title.localeCompare(b.title, 'sv')
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10">
      {sortedPartners.map((partner) => (
        <PartnerLogo key={partner.id} partner={partner} />
      ))}
    </div>
  );
};

interface PartnerLevel {
  id: string;
  title: string;
  sortOrder: number;
  partners: Partner[];
}

export default async function PartnerSection() {
  // Fetch all partners from Frontspace with higher limit for pagination
  const allPartners: Partner[] = await fetchAllPartners(500) || [];

  // Fetch partnernivaer (partner levels) from Frontspace
  const { posts: partnernivaerPosts } = await fetchPosts('partnernivaer', { limit: 100 });

  if (!partnernivaerPosts || partnernivaerPosts.length === 0) {
    return (
      <div className="w-full text-white text-center py-8">
        <p>Inga partnernivåer hittades.</p>
      </div>
    );
  }

  // Create partner levels with their associated partners
  const partnerLevels: PartnerLevel[] = [];

  partnernivaerPosts.forEach((level: any) => {
    const levelPartners = allPartners.filter((partner) => {
      // Handle partnerniva as both string ID and object
      if (typeof partner.partnerniva === 'string') {
        return partner.partnerniva === level.id;
      } else if (partner.partnerniva && typeof partner.partnerniva === 'object') {
        return (partner.partnerniva as any).id === level.id;
      }
      return false;
    });

    if (levelPartners.length > 0) {
      partnerLevels.push({
        id: level.id,
        title: level.title,
        sortOrder: level.sort_order ?? 999,
        partners: levelPartners,
      });
    }
  });

  // Sort partner levels by sortOrder
  const sortedLevels = partnerLevels.sort((a, b) => a.sortOrder - b.sortOrder);

  if (sortedLevels.length === 0) {
    return (
      <div className="w-full text-white text-center py-8">
        <p>Inga partners tillgängliga.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {sortedLevels.map((level) => (
        <section key={level.id} className="mb-22 w-full">
          <h2 className="text-3xl text-center font-semibold mb-10 text-white">{level.title}</h2>

          {level.partners.length > 0 ? (
            <PartnerGrid partners={level.partners} />
          ) : (
            <p className="text-gray-500 italic text-center">Inga partners på denna nivå.</p>
          )}
        </section>
      ))}
    </div>
  );
}
