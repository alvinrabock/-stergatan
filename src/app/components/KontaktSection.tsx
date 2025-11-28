import React from 'react';
import PersonalItem from '@/app/components/Personal/PersonalItem';
import { fetchAllPersonal } from '@/lib/frontspace/adapters/personal';
import { fetchPosts } from '@/lib/frontspace/client';
import { Personal } from '@/types';

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

interface KontaktSectionProps {
  columns?: number;
}

interface GroupedPersonal {
  avdelningId: string;
  avdelningTitle: string;
  avdelningSlug: string;
  sortOrder: number;
  personnel: Personal[];
}

interface Avdelning {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
}

export default async function KontaktSection({ columns = 3 }: KontaktSectionProps) {
  // Fetch all personal from Frontspace
  const allPersonal: Personal[] = await fetchAllPersonal(100) || [];

  // Fetch personalavdelningar from Frontspace
  const { posts: avdelningarPosts } = await fetchPosts('personalavdelningar', { limit: 100 });

  // Create a lookup map for avdelningar
  const avdelningarMap: Record<string, Avdelning> = {};
  avdelningarPosts.forEach((avd: any) => {
    const content = avd.content || {};
    avdelningarMap[avd.id] = {
      id: avd.id,
      title: avd.title,
      slug: avd.slug,
      sortOrder: avd.sort_order ?? content.sort_order ?? 999, // Default to high number if no sort order
    };
  });

  // Generate grid classes based on columns prop
  const gridClasses = getGridColumnClasses(Number(columns));

  if (!allPersonal || allPersonal.length === 0) {
    return (
      <div className="w-full text-white text-center py-8">
        <p>Ingen kontaktinformation tillgänglig.</p>
      </div>
    );
  }

  // Group personal by avdelning
  const groupedByAvdelning: Record<string, GroupedPersonal> = {};

  allPersonal.forEach((person) => {
    // Handle avdelning as string, object, or array
    let avdelningIds: string[] = [];

    if (typeof person.avdelning === 'string') {
      // Single avdelning as ID string
      avdelningIds = [person.avdelning];
    } else if (Array.isArray(person.avdelning)) {
      // Multiple avdelningar as array
      avdelningIds = person.avdelning.map((avd: any) =>
        typeof avd === 'string' ? avd : avd.id
      );
    } else if (person.avdelning && typeof person.avdelning === 'object') {
      // Single avdelning as object
      avdelningIds = [(person.avdelning as any).id];
    } else {
      // No avdelning, skip this person
      return;
    }

    // Add person to all their avdelningar
    avdelningIds.forEach((avdelningId) => {
      const avdelningData = avdelningarMap[avdelningId];

      // If we couldn't find the avdelning data, skip
      if (!avdelningData) {
        return;
      }

      const avdelningTitle = avdelningData.title || 'Övrig personal';
      const avdelningSlug = avdelningData.slug || '';
      const sortOrder = avdelningData.sortOrder ?? 999;

      if (!groupedByAvdelning[avdelningId]) {
        groupedByAvdelning[avdelningId] = {
          avdelningId,
          avdelningTitle,
          avdelningSlug,
          sortOrder,
          personnel: [],
        };
      }

      groupedByAvdelning[avdelningId].personnel.push(person);
    });
  });

  // Convert to array, filter out "Styrelse", and sort departments by sortOrder
  const avdelningar = Object.values(groupedByAvdelning)
    .filter((avd) => avd.avdelningTitle !== 'Styrelse')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  console.log('🏢 ALL Avdelningar with sort orders:', avdelningar.map(avd => ({
    title: avd.avdelningTitle,
    sortOrder: avd.sortOrder,
  })));

  // Sort personnel within each department by their sortOrder
  avdelningar.forEach((avdelning) => {
    avdelning.personnel.sort((a, b) => {
      const aOrder = (a as any).sortOrder ?? 999;
      const bOrder = (b as any).sortOrder ?? 999;
      return aOrder - bOrder;
    });
  });

  if (avdelningar.length === 0) {
    return (
      <div className="w-full text-white text-center py-8">
        <p>Ingen kontaktinformation tillgänglig.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ul className="space-y-16 w-full">
        {avdelningar.map((avdelning) => (
          <li key={avdelning.avdelningId}>
            <div id={avdelning.avdelningSlug || undefined}>
              {/* Avdelning Title */}
              <div className="pb-8">
                <h2 className="text-2xl font-semibold text-white">{avdelning.avdelningTitle}</h2>
              </div>

              {avdelning.personnel.length > 0 ? (
                <ul className={`w-full grid ${gridClasses} gap-x-6 gap-y-16`}>
                  {avdelning.personnel.map((person) => (
                    <PersonalItem key={person.id} person={person} />
                  ))}
                </ul>
              ) : (
                <p className="text-white/70">Inga kontaktpersoner tillgängliga för denna avdelning.</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
