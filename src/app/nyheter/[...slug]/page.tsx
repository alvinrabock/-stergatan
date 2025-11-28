import { fetchAllNyhetskategorier } from '@/lib/frontspace/adapters/nyhetskategorier';
import { fetchNyheterByCategory } from '@/lib/frontspace/adapters/nyheter';
import NewsPageClient from '../NyheterClient';
import type { Metadata } from 'next';

type CategoryPageProps = {
    params: Promise<{ slug: string[] }>;
};

// Generate dynamic metadata
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slugParts = resolvedParams.slug;

    try {
        // Fetch all categories
        const categories = await fetchAllNyhetskategorier();

        const finalSlug = slugParts[slugParts.length - 1];
        const currentCategory = categories.find(
            (category) => typeof category.slug === 'string' && category.slug === finalSlug
        );

        if (!currentCategory) {
            return {
                title: 'Kategori hittades inte - Östers IF',
                description: 'Den begärda kategorin kunde inte hittas.',
            };
        }

        const categoryName = currentCategory.title || currentCategory.title || 'Kategori';
        const description = `Läs de senaste nyheterna inom ${categoryName} från Östers IF. Håll dig uppdaterad med allt som händer inom ${categoryName.toLowerCase()}.`;

        return {
            title: `${categoryName} - Nyheter - Östers IF`,
            description,
            keywords: `${categoryName}, nyheter, Östers IF, fotboll, Växjö, Sverige, sport, ${finalSlug}`,
            openGraph: {
                title: `${categoryName} - Nyheter - Östers IF`,
                description,
                type: 'website',
                locale: 'sv_SE',
                siteName: 'Östers IF',
            },
            alternates: {
                canonical: `/nyheter/${slugParts.join('/')}`,
                languages: {
                    'sv-SE': `/nyheter/${slugParts.join('/')}`,
                },
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Nyheter - Östers IF',
            description: 'Senaste nyheterna från Östers IF',
        };
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const resolvedParams = await params;
    const slugParts = resolvedParams.slug;

    // Fetch all categories
    const categories = await fetchAllNyhetskategorier();

    const finalSlug = slugParts[slugParts.length - 1];
    const currentCategory = categories.find(
        (category) => typeof category.slug === 'string' && category.slug === finalSlug
    );

    if (!currentCategory || !currentCategory.slug) {
        throw new Error(`Category with slug ${finalSlug} not found`);
    }

    // Fetch posts by category with pagination params
    const limit = 10;  // for example, 10 posts per page
    const page = 1;    // or get this from query params if supporting pagination in URL

    const posts = await fetchNyheterByCategory(currentCategory.slug, limit, page);

    return (
        <NewsPageClient
            posts={posts}
            categories={categories}
            selectedSlug={finalSlug}
            currentCategory={currentCategory}
        />
    );
}