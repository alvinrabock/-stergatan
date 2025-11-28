import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPosts } from '@/lib/frontspace/client';

// Partner package item component
const PartnerpaketItem = ({ item }: { item: any }) => {
  if (!item) return null;

  // Parse content if string
  let content = item.content || {};
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      content = {};
    }
  }

  // Extract hero image URL - check both heroImage and omslagsbild
  const heroImageUrl = content.omslagsbild || content.heroImage ||
    (typeof content.heroImage === 'object' && content.heroImage?.url) ||
    (typeof content.omslagsbild === 'object' && content.omslagsbild?.url);

  // Extract link information
  const enableLink = content.enableLink || false;
  const linkInternal = content.link?.internal;
  const linkCustom = content.link?.custom;

  const linkUrl = enableLink
    ? (linkInternal && typeof linkInternal === 'object' && linkInternal.slug
        ? `/${linkInternal.slug}`
        : linkCustom || '#')
    : '#';

  const hasLink = enableLink && (linkInternal?.slug || linkCustom);

  return (
    <div key={item.id} className="bg-custom_dark_red rounded-lg overflow-hidden flex flex-col">
      {/* Image section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
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
        <p className="text-sm mt-2">{content.shortDescription || content.kortbeskrivning}</p>

        <div className="ingår-i-paketet mt-4">
          {Array.isArray(content.Ingaripaketet) && content.Ingaripaketet.map((subItem: any, index: number) => (
            <p key={subItem.id || index} className="flex items-center text-sm text-gray-400">
              <span className="mr-2 text-white">✔</span>
              {subItem.text}
            </p>
          ))}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <p className="text-lg font-bold my-4 text-white">{content.price || content.pris}</p>
        {hasLink && (
          <Link
            href={linkUrl}
            className="inline-block w-full px-4 py-2 text-center border border-white text-white rounded hover:bg-white hover:text-custom_dark_red transition-colors"
          >
            Läs mer
          </Link>
        )}
      </div>
    </div>
  );
};

export default async function Partnerpaket() {
  try {
    // Fetch both kategorier and all partnerpaket
    const { posts: paketKategorier } = await fetchPosts('partnerpaket-kategorier', { limit: 100 });
    const { posts: allPartnerpaket } = await fetchPosts('partnerpaket', { limit: 500 });

    if (!paketKategorier || paketKategorier.length === 0) {
      return (
        <div className="text-center text-gray-500">
          Inga partnerpaket tillgängliga.
        </div>
      );
    }

    return (
      <div>
        {/* Packages grouped by category */}
        {paketKategorier.map((category: any) => {
          // Find all packages that belong to this category
          // The relationship is stored in the package's content.foretagspaketkategori field
          const categoryPackages = allPartnerpaket.filter((paket: any) => {
            let paketContent = paket.content || {};
            if (typeof paketContent === 'string') {
              try {
                paketContent = JSON.parse(paketContent);
              } catch {
                paketContent = {};
              }
            }

            // Check foretagspaketkategori field (slug-based reference)
            const paketCategory = paketContent.foretagspaketkategori || paketContent.kategori || paketContent.category;

            if (paketCategory) {
              // Compare with category slug (lowercase for case-insensitive match)
              if (typeof paketCategory === 'string') {
                return paketCategory.toLowerCase() === category.slug.toLowerCase() ||
                       paketCategory === category.id;
              }
              // Handle object reference
              if (typeof paketCategory === 'object' && paketCategory !== null) {
                return paketCategory.id === category.id || paketCategory.slug === category.slug;
              }
            }

            return false;
          });

          if (categoryPackages.length === 0) return null;

          // Sort by publishedAt descending (newest first)
          const sortedPackages = [...categoryPackages].sort((a: any, b: any) => {
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
            return dateB - dateA;
          });

          return (
            <div key={category.id} className="mb-16">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-left mb-8 text-white">{category.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedPackages.map((item: any) => (
                  <PartnerpaketItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error('Error fetching partner packages:', error);
    return (
      <div className="text-center text-gray-500">
        Ett fel uppstod vid hämtning av partnerpaket.
      </div>
    );
  }
}
