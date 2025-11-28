import { fetchAllDokument, type FrontspaceDokument } from '@/lib/frontspace/adapters/dokument';
import Link from 'next/link';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import { Button } from '../components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dokument - Östers IF',
  description: 'Ladda ner dokument och filer från Östers IF.',
  openGraph: {
    title: 'Dokument - Östers IF',
    description: 'Ladda ner dokument och filer från Östers IF.',
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Östers IF',
  },
};

export default async function Page() {
  const documents: FrontspaceDokument[] = await fetchAllDokument();

  return (
    <main className="w-full py-40 bg-custom_dark_dark_red text-white">
      <MaxWidthWrapper>
        <h1 className="text-3xl font-bold mb-6">Alla Dokument</h1>

        {documents?.length > 0 ? (
          <ul className="space-y-6">
            {documents.map((doc) => {
              const fileUrl = doc.content.fil || null;

              // Extract filename from URL or use title as fallback
              const fileName = fileUrl
                ? fileUrl.split('/').pop() || `${doc.title}.pdf`
                : `${doc.title}.pdf`;

              return (
                <li
                  key={doc.id}
                  className="border border-white/10 rounded p-6 shadow-sm hover:shadow-md transition bg-white/5"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Left side: title and description */}
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{doc.title}</h2>
                      {doc.content.beskrivning && (
                        <p className="text-sm text-white/70">
                          {doc.content.beskrivning}
                        </p>
                      )}
                    </div>

                    {/* Right side: buttons */}
                    <div className="flex gap-3 shrink-0">
                      <Link
                        href={fileUrl || `/dokument/${doc.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="whitespace-nowrap">
                          Visa dokument
                        </Button>
                      </Link>

                      <Link
                        href={fileUrl || `/dokument/${doc.slug}`}
                        download={fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="secondary" className="whitespace-nowrap">
                          Ladda ner
                        </Button>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Inga dokument hittades.</p>
        )}
      </MaxWidthWrapper>
    </main>
  );
}
