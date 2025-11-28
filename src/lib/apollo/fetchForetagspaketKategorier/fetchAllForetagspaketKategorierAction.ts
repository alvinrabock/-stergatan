'use server';

import client from "../apolloClient";
import { FETCH_ALL_FORETAGSPAKETKATEGORIER } from "./AllforetagspaketKategorierQuery";

const FORETAGSPAKETKATEGORIER_TAG = 'foretagspaketkategorier-data';
const FORETAGSPAKET_TAG = 'foretagspaket-data';

export const fetchAllForetagspaketKategorier = async () => {
  const { data } = await client.query({
    query: FETCH_ALL_FORETAGSPAKETKATEGORIER,
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { 
          tags: [FORETAGSPAKETKATEGORIER_TAG, FORETAGSPAKET_TAG] 
        },
      },
    },
  });

  return data.Foretagspaketkategoriers.docs;
};
