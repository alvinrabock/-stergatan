'use server';

import client from "../apolloClient";
import { GET_ALL_PARTNERNIVAER } from "./fetchAllPartnernivaerQuery";
import { cache } from "react";

const PARTNERNIVAER_TAG = 'partnernivaer-data';
const REVALIDATE_TAG = 'partners-data';

export const fetchAllPartnernivaer = cache(async () => {
  const { data } = await client.query({
    query: GET_ALL_PARTNERNIVAER,
    variables: {
      sort: "-publishedAt",
    }, 
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { tags: [PARTNERNIVAER_TAG, REVALIDATE_TAG] },
      },
    },
  });

  return data.Partnernivaers.docs;
});
