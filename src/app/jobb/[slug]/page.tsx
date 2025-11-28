import { fetchSingleJobb, type FrontspaceJobb } from '@/lib/frontspace/adapters/jobb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import MaxWidthWrapper from '../../components/MaxWidthWrapper';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const job = await fetchSingleJobb(slug);

    if (!job) {
      return {
        title: 'Jobb hittades inte - Östers IF',
        description: 'Det begärda jobbet kunde inte hittas.',
      };
    }

    const description = `Ansök för ${job.title}. Läs mer om denna spännande karriärmöjlighet hos Östers IF.`;

    return {
      title: `${job.title} - Lediga Jobb - Östers IF`,
      description,
      keywords: `${job.title}, lediga jobb, karriär, anställning, Östers IF, Växjö`,
      openGraph: {
        title: `${job.title} - Lediga Jobb - Östers IF`,
        description,
        type: 'article',
        locale: 'sv_SE',
        siteName: 'Östers IF',
        publishedTime: job.published_at,
        modifiedTime: job.updated_at,
        ...(job.content.omslagsbild && {
          images: [{
            url: job.content.omslagsbild,
            width: 1200,
            height: 630,
            alt: job.title,
          }],
        }),
      },
      alternates: {
        canonical: `/jobb/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Jobb - Östers IF',
      description: 'Jobbsida för Östers IF',
    };
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const job: FrontspaceJobb | null = await fetchSingleJobb(slug);

  if (!job) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full pt-40 pb-20 min-h-screen">
      <MaxWidthWrapper>
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/jobb"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Lediga Jobb
              </Link>
            </li>
            <li className="text-white/50">/</li>
            <li className="text-white font-medium truncate">{job.title}</li>
          </ol>
        </nav>

        <div>
          {/* Job Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {job.title}
            </h1>

            {job.published_at && (
              <p className="text-white/60 mb-4">
                Publicerad: {formatDate(job.published_at)}
              </p>
            )}

          </header>

          {/* Job Image */}
          {job.content.omslagsbild && (
            <div className="relative h-64 md:h-80 w-full mb-8 rounded-lg overflow-hidden">
              <img
                src={job.content.omslagsbild}
                alt={job.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          )}

          {/* Job Content */}
          {job.content.content && (
            <div
              className="prose prose-invert prose-lg max-w-none mb-8 text-white/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.content.content }}
            />
          )}

          {/* End date */}
          {job.content.slutdatum && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
              <p className="text-white/80">
                <span className="font-semibold">Sista ansökningsdag:</span>{' '}
                {formatDate(job.content.slutdatum)}
              </p>
            </div>
          )}

          {/* Back to Jobs */}
          <div className="pt-8 border-t border-white/10">
            <Link
              href="/jobb"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tillbaka till alla jobb
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
