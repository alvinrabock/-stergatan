'use server';

import client from "../apolloClient";
import { GET_SINGLE_PARTNERNIVA } from "./fetchSinglePartnernivaQuery.ts";
import { cache } from "react";

const PARTNERNIVAER_TAG = 'partnernivaer-data';
const REVALIDATE_TAG = 'partners-data';

export const fetchSinglePartnerniva = cache(async (slug: string) => {
  const { data } = await client.query({
    query: GET_SINGLE_PARTNERNIVA,
    variables: { slug },
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { tags: [PARTNERNIVAER_TAG , REVALIDATE_TAG] },
      },
    },
  });

  return data.Partnernivaers.docs[0] || null;
});
