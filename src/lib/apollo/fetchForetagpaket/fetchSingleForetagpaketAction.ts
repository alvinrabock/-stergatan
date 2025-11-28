"use server"
import client from "../apolloClient";
import { GET_SINGLE_FORETAGSPAKET } from "./fetchSingleForetagpaketQuery";

const FORETAGSPAKET_TAG = 'foretagspaket-data';

export const fetchSingleForetagpaket = async (slug: string) => {
    const { data } = await client.query({
        query: GET_SINGLE_FORETAGSPAKET,
        variables: { slug },
        fetchPolicy: 'network-only',
        context: {
            fetchOptions: {
                next: { tags: [FORETAGSPAKET_TAG] },
            },
        },
    });

    return data.Foretagspakets.docs[0] || null;
};