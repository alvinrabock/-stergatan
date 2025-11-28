"use server"
import client from "../apolloClient";
import { FETCH_ALL_DOCUMENTS } from "./fetchAllDocumentsQuery";

const DOCUMENT_TAG = 'documents-data';

export const fetchAllDocuments = async () => {
    const { data } = await client.query({
        query: FETCH_ALL_DOCUMENTS,
        fetchPolicy: 'network-only', 
        context: {
            fetchOptions: {
              next: {
                tags: [DOCUMENT_TAG], 
              },
            },
          },
    });
    return data.Documents.docs;
};


