'use server';

import client from "../apolloClient";
import { GET_HEADER } from "./headerQuery";

const HEADER_TAG = 'header-data';

export const fetchHeader = async () => {
  try {
    const { data } = await client.query({
      query: GET_HEADER,
      fetchPolicy: 'network-only',
      context: {
        fetchOptions: {
          next: { tags: [HEADER_TAG] },
        },
      },
    });

    return data.Header || null;
  } catch (error) {
    console.error("Error fetching header:", error);
    return null; 
  }
};
