// app/matcher/page.tsx
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { Suspense } from "react";
import { getLeaguesGroupedBySeason } from "@/lib/leagueCache";
import MatcherArchiveClient from "./MatchArchiveClient";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Matcher - Östers IF',
  description: 'Se kommande och avslutade matcher för Östers IF. Följ matchresultat, spelschema och tabellställning för våra A-lag och ungdomslag.',
  keywords: 'Östers IF, matcher, spelschema, fotboll, resultat, kommande matcher, Växjö, Superettan, tabellställning',
  openGraph: {
    title: 'Matcher - Östers IF',
    description: 'Se kommande och avslutade matcher för alla lag inom Östers IF. Följ matchresultat och spelschema.',
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Östers IF',
  },
  alternates: {
    canonical: '/matcher',
    languages: {
      'sv-SE': '/matcher',
    },
  },
};

export default async function Page() {
  // Get leagues grouped by season from automated discovery cache
  const seasons = await getLeaguesGroupedBySeason();

  // If cache is empty, show setup instructions
  if (!seasons || seasons.length === 0) {
    return (
      <div className="w-full pt-46 pb-36 bg-custom_dark_dark_red">
        <MaxWidthWrapper>
          <div className="text-white space-y-6 max-w-2xl mx-auto text-center py-12">
            <h1 className="text-4xl font-bold">League Cache Not Initialized</h1>
            <p className="text-lg text-gray-300">
              The automated league discovery system needs to be initialized first.
            </p>
            <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-6 text-left">
              <h2 className="font-bold text-xl mb-4">Setup Instructions:</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Visit the admin page: <Link href="/new-smc/admin" className="underline text-yellow-300">/new-smc/admin</Link></li>
                <li>Click the &ldquo;🔄 Refresh Cache&rdquo; button</li>
                <li>Wait for the discovery to complete (may take a few minutes)</li>
                <li>Return to this page to view matches</li>
              </ol>
            </div>
            <Link
              href="/new-smc/admin"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Admin Page
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div className="w-full pt-46 pb-36 bg-custom_dark_dark_red">
      <MaxWidthWrapper>
        <Suspense>
          <MatcherArchiveClient seasons={seasons} />
        </Suspense>
      </MaxWidthWrapper>
    </div>
  );
}