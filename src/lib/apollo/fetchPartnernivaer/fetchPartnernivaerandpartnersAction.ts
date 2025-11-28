'use server';

import client from "../apolloClient";
import { GET_ALL_PARTNERNIVAER_AND_PARTNERS } from "./fetchPartnernivaerandpartnersQuery";
import { cache } from "react";

const PARTNERNIVAER_TAG = 'partnernivaer-data';
const REVALIDATE_TAG = 'partners-data';

export const fetchAllPartnernivaerandPartners = cache(async () => {
  const { data } = await client.query({
    query: GET_ALL_PARTNERNIVAER_AND_PARTNERS,
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { tags: [PARTNERNIVAER_TAG, REVALIDATE_TAG] },
      },
    },

  });

  return data.Partnernivaers.docs;
});
