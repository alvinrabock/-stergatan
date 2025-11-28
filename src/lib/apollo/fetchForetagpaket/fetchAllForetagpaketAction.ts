'use server';

import client from "../apolloClient";
import { GET_ALL_FORETAGSPAKET } from "./fetchAllForetagpaketQuery";

const FORETAGSPAKET_TAG = 'foretagspaket-data';

export const fetchAllForetagspaket = async () => {
    const { data } = await client.query({
        query: GET_ALL_FORETAGSPAKET,
        fetchPolicy: 'network-only',
        context: {
            fetchOptions: {
                next: { tags: [FORETAGSPAKET_TAG] },
            },
        },
    });

    return data.Foretagspakets.docs;
};
