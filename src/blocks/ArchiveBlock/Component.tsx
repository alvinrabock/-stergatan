import { CollectionArchive } from '@/app/components/CollectionArchive/index';
import PersonalItem from '@/app/components/Personal/PersonalItem';
import RichText from '@/app/components/RichText/index';
import { fetchAllPersonalAvdelningar } from '@/lib/apollo/fechPersonalAvdelningar/fetchAllPersonalAvdelningarAction';
import { fetchSinglePersonalAvdelningar } from '@/lib/apollo/fechPersonalAvdelningar/fetchSinglePersonalAvdelningarAction';
import { fetchAllNyheter, fetchNyheterByCategory } from '@/lib/frontspace/adapters/nyheter';
import { fetchAllNyhetskategorier } from '@/lib/frontspace/adapters/nyhetskategorier';
import { Post, ArchiveBlock as ArchiveBlockProps, Personal, Personalavdelningar, Foretagspaket, Foretagspaketkategorier } from '@/types';
import React from 'react';
import ForetagsPaketItem from '@/app/components/Partners/ForetagsPaketItem';
import { fetchPosts } from '@/lib/frontspace/client';

// Helper function to generate grid column classes based on column count
const getGridColumnClasses = (columns: number): string => {
  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  };

  return columnClasses[columns] || columnClasses[3];
};

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string; slug?: string }> = async (props) => {
  const {
    id,
    introContent,
    limit: limitFromProps,
    populateBy,
    relationTo,
    // Include fields
    postCategories,
    personalAvdelningar,
    foretagspaketkategorier,
    // Exclude fields
    excludePostCategories,
    excludePersonalAvdelningar,
    excludeForetagspaketkategorier,
    columns = 3,
    // Selection fields
    selectedPosts,
    selectedPersonal,
    selectedForetagspaket,
  } = props;

  const limit = limitFromProps || 3;

  let posts: Post[] = [];
  let personals: Personalavdelningar[] = [];
  let foretagspaketKategorier: Foretagspaketkategorier[] = [];

  if (populateBy === 'collection') {
    if (relationTo === 'posts') {
      const includeCategories = postCategories?.map((cat) => typeof cat === 'string' ? cat : cat.id) || [];
      const excludeCategories = excludePostCategories?.map((cat) => typeof cat === 'string' ? cat : cat.id) || [];

      if (includeCategories.length > 0) {
        // Fetch posts from specific categories
        // Note: fetchNyheterByCategory expects a slug, but we have IDs
        // We need to fetch all categories first to map IDs to slugs
        const allCategories = await fetchAllNyhetskategorier();
        const categorySlug = allCategories.find(cat => cat.id === includeCategories[0])?.slug;

        if (categorySlug) {
          posts = await fetchNyheterByCategory(categorySlug, limit);
        } else {
          posts = await fetchAllNyheter(limit);
        }
      } else {
        // Fetch all posts
        posts = await fetchAllNyheter(limit);
      }

      // Apply exclude filter if specified
      if (excludeCategories.length > 0) {
        posts = posts.filter(post => {
          const postCategoryIds = post.categories?.map(cat =>
            typeof cat === 'string' ? cat : cat.id
          ) || [];

          // Keep posts that don't have any of the excluded categories
          return !excludeCategories.some(excludeId => postCategoryIds.includes(excludeId));
        });
      }
    }

    if (relationTo === 'personal') {
      const includeAvdelningar = personalAvdelningar?.map((avd) => typeof avd === 'string' ? avd : avd.slug).filter((slug): slug is string => typeof slug === 'string') || [];
      const excludeAvdelningar = excludePersonalAvdelningar?.map((avd) => typeof avd === 'string' ? avd : avd.slug).filter((slug): slug is string => typeof slug === 'string') || [];

      if (includeAvdelningar.length > 0) {
        // Fetch specific avdelningar
        const fetched = await Promise.all(
          includeAvdelningar.map((slug) => fetchSinglePersonalAvdelningar(slug))
        );
        personals = fetched.filter(Boolean);
      } else {
        // Fetch all avdelningar
        const fetchedPersonals = await fetchAllPersonalAvdelningar();
        if (fetchedPersonals?.length) personals = fetchedPersonals;
      }

      // Apply exclude filter if specified
      if (excludeAvdelningar.length > 0) {
        personals = personals.filter(avdelning =>
          !excludeAvdelningar.includes(avdelning.slug || '')
        );
      }
    }

    if (relationTo === 'foretagspaket') {
      const categoryInput = foretagspaketkategorier || postCategories;
      const excludeCategoryInput = excludeForetagspaketkategorier;

      const includeCategories = categoryInput?.map((cat) => typeof cat === 'string' ? cat : cat.id) || [];
      const excludeCategories = excludeCategoryInput?.map((cat) => typeof cat === 'string' ? cat : cat.id) || [];

      // Fetch all categories from Frontspace
      const { posts: paketKategorier } = await fetchPosts('partnerpaket-kategorier', { limit: 100 });

      // Transform and filter categories
      const transformedKategorier = paketKategorier.map((category: any) => {
        let content = category.content || {};
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content);
          } catch {
            content = {};
          }
        }

        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          updatedAt: category.updated_at || category.updatedAt,
          createdAt: category.created_at || category.createdAt,
          koppladepaket: {
            docs: content.koppladepaket || []
          }
        } as Foretagspaketkategorier;
      });

      // Apply include/exclude filters
      if (includeCategories.length > 0) {
        foretagspaketKategorier = transformedKategorier.filter(
          (k: Foretagspaketkategorier) =>
            includeCategories.includes(k.id) &&
            k.koppladepaket?.docs?.length &&
            !excludeCategories.includes(k.id)
        );
      } else {
        foretagspaketKategorier = transformedKategorier.filter(
          (k: Foretagspaketkategorier) =>
            k.koppladepaket?.docs?.length &&
            !excludeCategories.includes(k.id)
        );
      }
    }
  }

  else if (populateBy === 'selection') {
    // Selection mode remains unchanged
    if (relationTo === 'posts' && selectedPosts?.length) {
      const selected = selectedPosts.map((doc) => (typeof doc === 'object' && doc !== null && 'value' in doc ? doc.value : doc));
      posts = selected.filter((d): d is Post => d !== null && typeof d === 'object' && 'title' in d);
    }

    // Handle individual selection for personal
    else if (relationTo === 'personal' && selectedPersonal?.length) {
      // Since these are already full objects from the API, use them directly
      const selectedPersonalItems = selectedPersonal.filter(
        (item): item is Personal =>
          item !== null &&
          typeof item === 'object' &&
          'title' in item &&
          typeof (item as Personal).title === 'string'
      );

      if (selectedPersonalItems.length > 0) {
        personals = [{
          id: 'selected-personals',
          title: '', // Leave empty or add a title if needed
          koppladpersonal: {
            docs: selectedPersonalItems,
          },
        } as Personalavdelningar];
      }
    }

    // Handle individual selection for foretagspaket
    else if (relationTo === 'foretagspaket' && selectedForetagspaket?.length) {
      const selectedSlugs = selectedForetagspaket
        ?.map((doc) => {
          if (typeof doc === 'string') return doc;
          if (typeof doc === 'object' && doc !== null && 'slug' in doc && typeof doc.slug === 'string') {
            return doc.slug;
          }
          return null;
        })
        .filter((slug): slug is string => typeof slug === 'string') ?? [];

      // Fetch all partnerpaket and filter by selected slugs
      const { posts: allPakets } = await fetchPosts('partnerpaket', { limit: 500 });

      const validPakets = allPakets
        .filter((paket: any) => selectedSlugs.includes(paket.slug))
        .map((paket: any) => {
          let content = paket.content || {};
          if (typeof content === 'string') {
            try {
              content = JSON.parse(content);
            } catch {
              content = {};
            }
          }

          return {
            id: paket.id,
            title: paket.title,
            slug: paket.slug,
            heroImage: content.heroImage || content.omslagsbild,
            shortDescription: content.shortDescription || content.kortbeskrivning,
            price: content.price || content.pris,
            enableLink: content.enableLink,
            link: content.link,
            Ingaripaketet: content.Ingaripaketet || [],
            updatedAt: paket.updated_at || paket.updatedAt,
            createdAt: paket.created_at || paket.createdAt,
          } as Foretagspaket;
        });

      if (validPakets.length > 0) {
        foretagspaketKategorier = [{
          id: 'selected-foretagspaket',
          title: '', // Optional: Set a custom title
          slug: 'selected',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          koppladepaket: {
            docs: validPakets,
          },
        } as Foretagspaketkategorier];
      }
    }
  }

  // 👇 Generate the grid classes based on the columns prop
  const gridClasses = getGridColumnClasses(Number(columns));

  // Determine if we should show avdelning titles
  const shouldShowAvdelningTitles = relationTo === 'personal' &&
    populateBy === 'collection' &&
    (!personalAvdelningar?.length || excludePersonalAvdelningar?.length);

  return (
    <div className="w-full" id={`block-${id}`}>
      {introContent && (
        <div>
          <RichText className="ml-0 mb-6 text-white" data={introContent} enableGutter={false} />
        </div>
      )}

      {relationTo === 'posts' && posts.length > 0 && (
        <CollectionArchive posts={posts.slice(0, limit)} />
      )}

      {relationTo === 'personal' && personals.length > 0 && (
        <ul className="space-y-16 w-full">
          {personals.map((avdelning) => (
            <li key={avdelning.id}>
              <div id={avdelning.slug ?? undefined}>
                {/* Avdelning Title - show when fetching all avdelningar or when excluding */}
                {shouldShowAvdelningTitles && avdelning.title && (
                  <h2 className="text-2xl font-semibold mb-4">{avdelning.title}</h2>
                )}

                {avdelning.koppladpersonal?.docs?.length ? (
                  <ul className={`w-full grid ${gridClasses} gap-x-6 gap-y-16`}>
                    {avdelning.koppladpersonal.docs
                      .filter((doc): doc is Personal => typeof doc !== 'string')
                      .map((person) => (
                        <PersonalItem key={person.id} person={person} />
                      ))}
                  </ul>
                ) : (
                  <p>No linked personnel for this avdelning.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {relationTo === 'foretagspaket' && foretagspaketKategorier.length > 0 && (
        <ul className="space-y-16 w-full">
          {foretagspaketKategorier.map((kategori) => (
            <li key={kategori.id}>
              {kategori.koppladepaket?.docs?.length ? (
                <ul className={`w-full grid ${gridClasses} gap-x-6 gap-y-16`}>
                  {kategori.koppladepaket.docs
                    .filter((doc): doc is Foretagspaket => typeof doc !== 'string')
                    .map((paket) => (
                      <ForetagsPaketItem key={paket.id} item={paket} />
                    ))}
                </ul>
              ) : (
                <p>No packages linked to this category.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};