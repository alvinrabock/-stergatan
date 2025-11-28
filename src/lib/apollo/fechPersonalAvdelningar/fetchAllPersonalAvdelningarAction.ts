"use server";

import client from "../apolloClient";
import { FETCH_ALL_PERSONALAVDELNINGAR } from "./fetchAllPersonalAvdelnignarQuery";

const PERSONAL_TAG = 'personal-data';

export const fetchAllPersonalAvdelningar = async () => {
  const { data } = await client.query({
    query: FETCH_ALL_PERSONALAVDELNINGAR,
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: {
          tags: [PERSONAL_TAG],
        },
      },
    },
  });

  const personalAvdelningar = data.Personalavdelningars.docs || [];

  // Sort and clone departments
  const sortedPersonalAvdelningar = [...personalAvdelningar]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateA - dateB;
    })
    .map((avdelning) => {
      // Clone and sort koppladpersonal.docs if available
      let sortedKoppladPersonalDocs = [];
      if (avdelning.koppladpersonal?.docs) {
        sortedKoppladPersonalDocs = [...avdelning.koppladpersonal.docs].sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateA - dateB;
        });
      }

      // Return a new avdelning object with sorted koppladpersonal
      return {
        ...avdelning,
        koppladpersonal: {
          ...avdelning.koppladpersonal,
          docs: sortedKoppladPersonalDocs,
        },
      };
    });

  return sortedPersonalAvdelningar;
};
