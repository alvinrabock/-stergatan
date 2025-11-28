import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { fetchAllLag, type FrontspaceLag } from '@/lib/frontspace/adapters/lag';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Våra Lag - Östers IF',
  description: 'Upptäck alla lag inom Östers IF, en av Sveriges mest traditionsrika fotbollsföreningar. Se våra A-lag och ungdomslag från Växjö.',
  keywords: 'Östers IF, fotboll, lag, Växjö, Sverige, fotbollslag, A-lag, ungdomslag, sport',
  openGraph: {
    title: 'Våra Lag - Östers IF',
    description: 'Upptäck alla lag inom Östers IF, en av Sveriges mest traditionsrika fotbollsföreningar.',
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Östers IF',
  },
};

export default async function TeamsArchivePage() {
  const teams: FrontspaceLag[] = await fetchAllLag();

  // Sort teams by sorteringsordning (ascending), teams without sort order go to the end
  const sortedTeams = [...teams].sort((a, b) => {
    const orderA = a.content.sorteringsordning ?? 9999;
    const orderB = b.content.sorteringsordning ?? 9999;
    return orderA - orderB;
  });

  return (
    <main className="pt-32 pb-20 bg-custom_dark_dark_red text-white">
      <MaxWidthWrapper>
        <h1 className="text-6xl font-bold mb-10 uppercase">Våra lag</h1>

        <ul className="grid grid-cols-2 gap-6">
          {sortedTeams.map((team) => {
            const hasImage = !!team.content.omslagsbild;
            const sportadminLink = team.content.sportadminlank;
            const linkToSportadmin = team.content.lanka_helt_till_sportadmin === true ||
                                     team.content.lanka_helt_till_sportadmin === 'true';

            // If linking directly to sportadmin
            if (linkToSportadmin && sportadminLink) {
              return (
                <li
                  key={team.id}
                  className={`
                    col-span-2 border border-white/20 rounded-lg p-6 shadow hover:shadow-lg transition relative overflow-hidden
                    ${hasImage ? 'text-white h-[60vh] min-h-[400px]' : 'text-white'}
                  `}
                >
                  <Link
                    href={sportadminLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    {hasImage && (
                      <div className="absolute inset-0 w-full h-full z-0 rounded-lg overflow-hidden">
                        <img
                          src={team.content.omslagsbild}
                          alt={team.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-custom_dark_blue via-transparent to-transparent z-10" />
                      </div>
                    )}

                    <div
                      className={`
                        z-20 p-6 text-center
                        ${hasImage
                          ? 'absolute bottom-6 left-6 text-left'
                          : 'relative flex items-center justify-start h-full'}
                      `}
                    >
                      <h2 className="text-5xl font-semibold uppercase flex items-center gap-2">
                        {team.title}
                        <ArrowRight className="w-5 h-5" />
                      </h2>
                    </div>
                  </Link>
                </li>
              );
            }

            // Default internal link
            return (
              <Link href={`/lag/${team.slug}`} key={team.id} className="col-span-2">
                <li
                  className={`
                    border border-white/20 rounded-lg p-6 shadow hover:shadow-lg transition relative overflow-hidden
                    ${hasImage ? 'text-white h-[60vh] min-h-[400px]' : 'text-white'}
                  `}
                >
                  {hasImage && (
                    <div className="absolute inset-0 w-full h-full z-0 rounded-lg overflow-hidden">
                      <img
                        src={team.content.omslagsbild}
                        alt={team.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-custom_dark_blue via-transparent to-transparent z-10" />
                    </div>
                  )}

                  <div
                    className={`
                      z-20 p-6 text-center
                      ${hasImage
                        ? 'absolute bottom-6 left-6 text-left'
                        : 'relative flex items-center justify-start h-full'}
                    `}
                  >
                    <h2 className="text-5xl font-semibold uppercase flex items-center gap-2">
                      {team.title}
                      <ArrowRight className="w-5 h-5" />
                    </h2>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </MaxWidthWrapper>
    </main>
  );
}