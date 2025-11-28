import { fetchAllJobb, type FrontspaceJobb } from '@/lib/frontspace/adapters/jobb';
import Link from 'next/link';
import type { Metadata } from 'next';
import MaxWidthWrapper from '../components/MaxWidthWrapper';

export const metadata: Metadata = {
  title: 'Lediga Jobb - Östers IF',
  description: 'Utforska våra lediga tjänster och hitta din nästa karriärmöjlighet hos Östers IF.',
  keywords: 'lediga jobb, karriär, anställning, Östers IF, Växjö, fotboll',
  openGraph: {
    title: 'Lediga Jobb - Östers IF',
    description: 'Utforska våra lediga tjänster och hitta din nästa karriärmöjlighet hos Östers IF.',
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Östers IF',
  },
};

export default async function Page() {
  const jobs: FrontspaceJobb[] = await fetchAllJobb();

  return (
    <div className="w-full pt-40 pb-20">
      <MaxWidthWrapper>
        <h1 className="text-3xl font-bold mb-6 text-white">Lediga Jobb</h1>

        {jobs.length === 0 ? (
          <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center backdrop-blur-sm">
            <p className="text-white/70">Inga jobb tillgängliga för tillfället.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobb/${job.slug}`}
                className="group block"
              >
                <div className="bg-white/5 border border-white/10 rounded-lg shadow-sm overflow-hidden backdrop-blur-sm cursor-pointer">
                  {/* Job Photo */}
                  {job.content.omslagsbild && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={job.content.omslagsbild}
                        alt={job.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Job Title */}
                    <h2 className="text-xl font-semibold mb-2 text-white">
                      {job.title}
                    </h2>

                    {/* Job Details */}
                    <div className="space-y-2 mb-4">
                      {job.content.slutdatum && (
                        <div className="flex items-center text-sm text-white/60">
                          <span className="font-medium">Slutdatum:</span>
                          <span className="ml-2">
                            {new Date(job.content.slutdatum).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                      )}

                      {job.published_at && (
                        <div className="flex items-center text-sm text-white/60">
                          <span className="font-medium">Publicerad:</span>
                          <span className="ml-2">
                            {new Date(job.published_at).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Read More Indicator */}
                    <div className="inline-flex items-center text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                      <span className="text-sm font-medium">Läs mer</span>
                      <svg
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
