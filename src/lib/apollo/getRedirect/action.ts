'use server';

import { unstable_cache } from 'next/cache';
// import client from "../apolloClient";
// import { GET_REDIRECTS } from "./redirectQuery";

const REVALIDATE_TAG = 'redirect-data';

// TODO: Implement redirects in Frontspace CMS
// Temporarily disabled - Frontspace doesn't have Redirects collection
export const fetchRedirects = unstable_cache(
  async () => {
    // const { data } = await client.query({
    //   query: GET_REDIRECTS,
    //   fetchPolicy: 'network-only',
    // });
    // return data.Redirects.docs;

    // Return empty array for now
    return [];
  },
  ['redirects'],
  {
    tags: [REVALIDATE_TAG],
    revalidate: 3600,
  }
);