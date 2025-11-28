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

interface StyrelseSectionProps {
  columns?: number;
}

interface Avdelning {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
}

export default async function StyrelseSection({ columns = 3 }: StyrelseSectionProps) {
  // Fetch all personal from Frontspace
  const allPersonal: Personal[] = await fetchAllPersonal(100) || [];

  // Fetch personalavdelningar from Frontspace
  const { posts: avdelningarPosts } = await fetchPosts('personalavdelningar', { limit: 100 });

  // Find the Styrelse department
  const styrelseAvdelning = avdelningarPosts.find((avd: any) => avd.title === 'Styrelse');

  if (!styrelseAvdelning) {
    return (
      <div className="w-full text-white text-center py-8">
        <p>Styrelsen kunde inte hittas.</p>
      </div>
    );
  }

  const avdelning = styrelseAvdelning as any;

  // Create a lookup map for avdelningar
  const avdelningarMap: Record<string, Avdelning> = {};
  avdelningarPosts.forEach((avd: any) => {
    const content = avd.content || {};
    avdelningarMap[avd.id] = {
      id: avd.id,
      title: avd.title,
      slug: avd.slug,
      sortOrder: avd.sort_order ?? content.sort_order ?? 999,
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

  // Filter personnel who belong to Styrelse
  const styrelsePersonnel: Personal[] = [];

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

    // Only include if this person belongs to Styrelse
    if (avdelningIds.includes(avdelning.id)) {
      styrelsePersonnel.push(person);
    }
  });

  // Sort personnel by their sortOrder
  styrelsePersonnel.sort((a, b) => {
    const aOrder = (a as any).sortOrder ?? 999;
    const bOrder = (b as any).sortOrder ?? 999;
    return aOrder - bOrder;
  });

  if (styrelsePersonnel.length === 0) {
    return (
      <div className="w-full text-white text-center py-8">
        <p>Inga styrelsemedlemmar tillgängliga.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ul className={`w-full grid ${gridClasses} gap-x-6 gap-y-16`}>
        {styrelsePersonnel.map((person) => (
          <PersonalItem key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
}
