import React from 'react';
import { fetchPosts } from '@/lib/frontspace/client';
import ForetagsPaketItem from '@/app/components/Partners/ForetagsPaketItem';
import PersonalItem from '@/app/components/Personal/PersonalItem';
import { Foretagspaket, Personal } from '@/types';

export default async function PartnerpaketAffarsnatverk() {
  try {
    // Fetch the specific Österfamiljen package
    const { posts: allPartnerpaket } = await fetchPosts('partnerpaket', { limit: 500 });
    const osterfamiljenPackage = allPartnerpaket.find((paket: any) => paket.slug === 'osterfamiljen');

    // Fetch personnel from "Marknad och försäljning" department
    const { posts: allPersonalAvdelningar } = await fetchPosts('personalavdelningar', { limit: 100 });
    const marketingDept = allPersonalAvdelningar.find((dept: any) => dept.slug === 'marknad-och-forsaljning');

    // Transform Österfamiljen package to Foretagspaket type
    let foretagspaket: Foretagspaket | null = null;
    if (osterfamiljenPackage) {
      const paket = osterfamiljenPackage as any;
      let content = paket.content || {};
      if (typeof content === 'string') {
        try {
          content = JSON.parse(content);
        } catch {
          content = {};
        }
      }
      foretagspaket = {
        id: paket.id,
        title: paket.title,
        slug: paket.slug,
        heroImage: content.omslagsbild || content.heroImage,
        shortDescription: content.kort_beskrivning || content.kortbeskrivning,
        price: content.price || content.pris,
        enableLink: content.enableLink,
        link: content.link,
        Ingaripaketet: content.Ingaripaketet || [],
        updatedAt: paket.updated_at || paket.updatedAt,
        createdAt: paket.created_at || paket.createdAt,
      } as Foretagspaket;
    }

    // Get personnel from marketing department
    let personnel: Personal[] = [];
    if (marketingDept) {
      const { posts: allPersonal } = await fetchPosts('personal', { limit: 500 });
      const dept = marketingDept as any;

      // Filter personnel that belong to this department
      personnel = allPersonal
        .filter((person: any) => {
          let personContent = person.content || {};
          if (typeof personContent === 'string') {
            try {
              personContent = JSON.parse(personContent);
            } catch {
              personContent = {};
            }
          }

          const personDept = personContent.personalavdelningar || personContent.avdelning;

          if (typeof personDept === 'string') {
            return personDept.toLowerCase() === dept.slug.toLowerCase() || personDept === dept.id;
          }
          if (typeof personDept === 'object' && personDept !== null) {
            return personDept.id === dept.id || personDept.slug === dept.slug;
          }
          return false;
        })
        .map((person: any) => {
          let personContent = person.content || {};
          if (typeof personContent === 'string') {
            try {
              personContent = JSON.parse(personContent);
            } catch {
              personContent = {};
            }
          }

          return {
            id: person.id,
            title: person.title,
            slug: person.slug,
            email: personContent.email || personContent.epost,
            phoneNumber: personContent.phone || personContent.telefon,
            jobTitle: personContent.role || personContent.roll || personContent.befattning,
            photo: personContent.image || personContent.bild || personContent.profilbild,
            updatedAt: person.updated_at || person.updatedAt,
            createdAt: person.created_at || person.createdAt,
          } as Personal;
        });
    }

    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Österfamiljen Package Grid */}
        {foretagspaket && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Affärsnätverket</h2>
            <div className="grid grid-cols-1 gap-8">
              <ForetagsPaketItem item={foretagspaket} />
            </div>
          </div>
        )}

        {/* Marketing Department Personnel Grid */}
        {personnel.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Kontakt</h2>
            <div className="grid grid-cols-1 gap-8">
              {personnel.map((person) => (
                <PersonalItem key={person.id} person={person} />
              ))}
            </div>
          </div>
        )}

        {/* Show message if neither are available */}
        {!foretagspaket && personnel.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p>Information kommer snart</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching Partnerpaket Affärsnätverk:', error);
    return (
      <div className="text-center text-gray-500">
        Ett fel uppstod vid hämtning av information.
      </div>
    );
  }
}
