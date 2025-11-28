import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import MiniNyhetertItem from "@/app/components/Nyheter/miniNyheterItem";
import RichTextContent from "@/app/components/RichTextContent";
import { fetchSingleNyhet, fetchNyheterByCategory, fetchAllNyheter } from "@/lib/frontspace/adapters/nyheter";
import { Category, Media as MediaType } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: Promise<{ categorySlug: string[]; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch the post data for metadata
  const post = await fetchSingleNyhet(slug);

  if (!post) {
    return {
      title: 'Artikel inte hittad - Östers IF',
      description: 'Den begärda artikeln kunde inte hittas.',
    };
  }

  // Use custom meta fields if available, otherwise fallback to post data
  const title = post.meta?.title || post.title;
  const description = post.meta?.description || 
    `Läs mer om ${post.title} från Östers IF. Publicerad ${new Date(post.publishedAt || '').toLocaleDateString('sv-SE')}.`;
  
  // Get the meta image with multiple fallbacks: meta.image -> heroImage -> thumbnail
  const getMetaImage = () => {
    // First try meta image
    if (post.meta?.image) return post.meta.image;
    
    // Then try hero image
    if (post.heroImage) return post.heroImage;
    
    return null;
  };
  
  const metaImage = getMetaImage();
  
  // Handle Payload CMS image format (can be string ID or MediaType object)
  const getImageUrl = (image: string | MediaType | null | undefined) => {
    if (!image) return null;
    if (typeof image === 'string') return null; // Just an ID, can't get URL
    
    // Priority: large -> medium -> small -> thumbnail -> original
    return image.sizes?.large?.url || 
           image.sizes?.medium?.url || 
           image.sizes?.small?.url || 
           image.sizes?.thumbnail?.url || 
           image.url;
  };
  
  const getImageDimensions = (image: string | MediaType | null | undefined) => {
    if (!image || typeof image === 'string') return { width: 1200, height: 630 };
    
    // Get dimensions from the best available size
    const largeSize = image.sizes?.large;
    const mediumSize = image.sizes?.medium;
    const originalSize = { width: image.width, height: image.height };
    
    if (largeSize?.width && largeSize?.height) {
      return { width: largeSize.width, height: largeSize.height };
    }
    if (mediumSize?.width && mediumSize?.height) {
      return { width: mediumSize.width, height: mediumSize.height };
    }
    if (originalSize.width && originalSize.height) {
      return originalSize;
    }
    
    return { width: 1200, height: 630 }; // Default OG dimensions
  };
  
  const imageUrl = getImageUrl(metaImage);
  const imageDimensions = getImageDimensions(metaImage);
  
  // Generate category-based keywords
  const categoryKeywords = post.categories
    ?.map(cat => typeof cat !== 'string' ? cat.title : cat)
    .join(', ') || '';

  return {
    title: `${title} - Östers IF`,
    description,
    keywords: `Östers IF, ${categoryKeywords}, fotboll, Växjö, Superettan, nyheter`,
    openGraph: {
      title: `${title} - Östers IF`,
      description,
      type: 'article',
      url: `/nyheter/${slug}`,
      siteName: 'Östers IF',
      locale: 'sv_SE',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: ['Östers IF'],
      section: 'Sport',
      tags: post.categories?.map(cat => 
        typeof cat !== 'string' ? cat.title : cat
      ) || [],
      images: imageUrl ? [{
        url: imageUrl,
        width: imageDimensions.width,
        height: imageDimensions.height,
        alt: (typeof metaImage !== 'string' ? metaImage?.alt : null) || title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Östers IF`,
      description,
      site: '@ostersif', 
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `/nyheter/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'article:author': 'Östers IF',
      'article:section': 'Sport',
      'article:published_time': post.publishedAt,
      'article:modified_time': post.updatedAt || post.publishedAt,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch the single post data
  const post = await fetchSingleNyhet(slug);

  // Handle the null case early
  if (!post) return notFound();

  // Fetch related posts from the same category
  // First try to get posts from the same category
  let relatedPosts: typeof post[] = [];

  if (post.categories && post.categories.length > 0) {
    const categorySlug = typeof post.categories[0] === 'string'
      ? post.categories[0]
      : post.categories[0].slug;

    if (categorySlug) {
      const categoryPosts = await fetchNyheterByCategory(categorySlug, 11, 1);
      relatedPosts = categoryPosts.filter(p => p.id !== post.id).slice(0, 10);
    }
  }

  // If we don't have enough related posts, fetch latest posts as fallback
  if (relatedPosts.length < 10) {
    const latestPosts = await fetchAllNyheter(11, 1);
    const filteredLatest = latestPosts.filter(p => p.id !== post.id);

    // Add latest posts that aren't already in relatedPosts
    for (const latestPost of filteredLatest) {
      if (!relatedPosts.find(rp => rp.id === latestPost.id) && relatedPosts.length < 10) {
        relatedPosts.push(latestPost);
      }
    }
  }

  // Extract YouTube video ID
  const youtubeLink = post?.youtubeLink || '';
  const youtubeVideoId = youtubeLink ? youtubeLink.split("v=")[1]?.split("&")[0] : null;

  // Helper function to check if an item is a Category
  const isCategory = (category: string | Category): category is Category => {
    return (category as Category).title !== undefined;
  };

  // Generate breadcrumbs (optional, for navigation purposes)
  const breadcrumbs = [
    <li key="nyheter" className="inline-block text-sm text-gray-500">
      <Link href="/nyheter" className="hover:underline">Nyheter</Link>
      <span className="mx-2">/</span>
    </li>,
    ...(post.categories && Array.isArray(post.categories) && post.categories.length
      ? post.categories.map((category, index) => (
        <li key={isCategory(category) ? category.id : category} className="inline-block text-sm text-gray-500">
          {isCategory(category) ? (
            <Link href={`/nyheter/${category.slug}`} className="hover:underline">
              {category.title}
            </Link>
          ) : (
            <span>{category}</span> // Handle the case when it's just a string
          )}
          {index < (post.categories?.length ?? 0) - 1 && <span className="mx-2">/</span>}
        </li>
      ))
      : [])
  ];

  return (
    <div className="w-full py-36 bg-custom_dark_dark_red text-white">
      <MaxWidthWrapper>
        <nav className="mb-4">
          <ol className="list-none p-0">
            {breadcrumbs}
          </ol>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero Image or YouTube Video */}
            {youtubeVideoId ? (
              <div className="relative pb-[56.25%] w-full mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  loading="lazy"
                  rel="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              </div>
            ) : post.heroImage && typeof post.heroImage !== 'string' && post.heroImage.url ? (
              <div className="w-full mb-6">
                <img
                  src={post.heroImage.url}
                  alt={post.heroImage.alt || post.title}
                  className="w-full h-auto object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              <p className="text-sm text-gray-500">
                {new Date(post.publishedAt || '').toLocaleDateString()}
              </p>
            </div>

            {/* Render HTML content from Frontspace */}
            <style dangerouslySetInnerHTML={{ __html: `
              .article-content p { margin-bottom: 1.5rem; }
              .article-content h2 { margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: bold; }
              .article-content h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 600; }
              .article-content strong { font-weight: bold; }
              .article-content a { color: #93c5fd; text-decoration: underline; }
              .article-content a:hover { color: #bfdbfe; }
              .article-content ul { margin-bottom: 1.5rem; list-style-type: disc; padding-left: 1.5rem; }
              .article-content ol { margin-bottom: 1.5rem; list-style-type: decimal; padding-left: 1.5rem; }
            ` }} />
            <RichTextContent
              content={(post.content as unknown as string) || ''}
              className="article-content text-white"
            />
          </div>

          {/* Related posts */}
          <div className="xl:sticky xl:top-36 h-fit">
            <h2 className="text-xl font-semibold mb-4 mt-10 xl:mt-0">Relaterat</h2>
            <ul className="space-y-4">
              {relatedPosts.map((related) => (
                <MiniNyhetertItem key={related.id} post={related} />
              ))}
            </ul>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}