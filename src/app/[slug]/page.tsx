import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/app/components/BlockRenderer';
import { PageHeaderSettings } from '@/app/components/PageHeaderSettings';
import { fetchAllPages } from '@/lib/frontspace/client';
import { buildPagePaths, findPageByPath } from '@/utils/pageRouting';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || 'home';

  // Fetch all published pages
  const pages = await fetchAllPages();
  const pagesWithPaths = buildPagePaths(pages);

  // Construct full path (single-level page)
  const fullPath = '/' + slug;

  // Find matching page
  const page = findPageByPath(pagesWithPaths, fullPath);

  if (!page) {
    notFound();
  }

  // Extract blocks from page content
  const blocks = page.content?.blocks || [];

  // Check for reverse_header_colors page setting
  const reverseHeaderColors = page.reverse_header_colors === true;

  return (
    <article>
      <PageHeaderSettings reverseHeaderColors={reverseHeaderColors} />
      <BlockRenderer blocks={blocks} />
    </article>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const pages = await fetchAllPages();
  const pagesWithPaths = buildPagePaths(pages);

  // Only include single-level pages (no parent)
  return pagesWithPaths
    .filter(page => {
      const segments = page.fullPath.split('/').filter(Boolean);
      return segments.length === 1;
    })
    .map(page => ({
      slug: page.slug
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || 'home';

  // Fetch all published pages
  const pages = await fetchAllPages();
  const pagesWithPaths = buildPagePaths(pages);

  // Construct full path
  const fullPath = '/' + slug;

  // Find matching page
  const page = findPageByPath(pagesWithPaths, fullPath);

  if (!page) {
    return {
      title: 'Sidan hittades inte - Östers IF',
      description: 'Vi är Östers IF',
    };
  }

  const seoTitle = page.content?.pageSettings?.seoTitle || page.title;
  const seoDescription = page.content?.pageSettings?.seoDescription || '';

  return {
    title: seoTitle + ' - Östers IF',
    description: seoDescription || 'Vi är Östers IF',
    openGraph: {
      title: seoTitle,
      description: seoDescription || 'Vi är Östers IF',
      url: fullPath,
    },
  };
}
