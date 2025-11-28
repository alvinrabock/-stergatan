"use server";

import client from "../apolloClient";
import { FETCH_SINGLE_PERSONALAVDELNINGAR } from "./fetchSinglePersonalAvdelnignarQuery";

const PERSONAL_TAG = 'personal-data';

export const fetchSinglePersonalAvdelningar = async (slug: string) => {
  const { data } = await client.query({
    query: FETCH_SINGLE_PERSONALAVDELNINGAR,
    variables: { slug },
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: {
          tags: [PERSONAL_TAG],
        },
      },
    },
  });

  const avdelning = data.Personalavdelningars.docs[0];

  if (!avdelning) return null;

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
};
