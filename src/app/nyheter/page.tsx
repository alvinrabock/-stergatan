import { fetchAllNyhetskategorier } from '@/lib/frontspace/adapters/nyhetskategorier';
import { fetchAllNyheter } from '@/lib/frontspace/adapters/nyheter';
import NewsPageClient from './NyheterClient';

export const metadata = {
  title: 'Nyheter - Östers IF',
  description: 'Håll dig uppdaterad med de senaste nyheterna från Östers IF. Läs om matcher, spelare, träningar och allt som händer i klubben.',
  keywords: 'Östers IF, nyheter, fotboll, Växjö, Superettan, matcher, spelare, träning, klubbnyheter',
  openGraph: {
    title: 'Nyheter - Östers IF',
    description: 'Håll dig uppdaterad med de senaste nyheterna från Östers IF. Läs om matcher, spelare, träningar och allt som händer i klubben.',
    type: 'website',
    url: '/nyheter',
    siteName: 'Östers IF',
    locale: 'sv_SE',
  },
  category: 'sport',
};

export default async function NewsPage() {
  const [posts, categories] = await Promise.all([
    fetchAllNyheter(10, 1),
    fetchAllNyhetskategorier(100),
  ]);

  return <NewsPageClient posts={posts} categories={categories} />;
}