import { gql } from '@apollo/client';

export const FETCH_ALL_DOCUMENTS = gql`
query GetAllDocuments {
    Documents {
      docs {
        id
        title
        slug
        beskrivning
        fil {
          id
          url
          filename
          mimeType
          filesize
          alt
        }
       
      }
      totalDocs
      hasNextPage
      hasPrevPage
      page
      totalPages
    }
  }
  
`;
