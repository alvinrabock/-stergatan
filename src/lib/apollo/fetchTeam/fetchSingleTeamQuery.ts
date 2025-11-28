import { gql } from '@apollo/client';

export const GET_SINGLE_TEAMS = gql`
  query GetTeamBySlug($slug: String!) {
    Lags(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
        createdAt
        updatedAt
        aLag
        publishedAt
        Sportadminlink
        linkDirectToSportadmin
        banner {
          id
          createdAt
          updatedAt
          filename
          mimeType
          filesize
          width
          height
          focalX
          focalY
          url
          thumbnailURL
          sizes {
            thumbnail { url width height mimeType filesize filename }
            square { url width height mimeType filesize filename }
            small { url width height mimeType filesize filename }
            medium { url width height mimeType filesize filename }
            large { url width height mimeType filesize filename }
            og { url width height mimeType filesize filename }
          }
        }
        fetchFromSEFAPI
        smcTeamId
        fogisTeamId
        fogisTeamSlug
        seasons {
          seasonYear
          tournaments {
            LeagueName
            leagueId
          }
        }
        players {
          title
  number
  position
  utlanad
  kommentar
  land
          image {
            id
            alt
            filename
            mimeType
            filesize
            width
            height
            focalX
            focalY
            url
            thumbnailURL
            sizes {
              thumbnail { url width height mimeType filesize filename }
              square { url width height mimeType filesize filename }
              small { url width height mimeType filesize filename }
              medium { url width height mimeType filesize filename }
            }
          }
        }
        staff {
          name
          role
          image {
            id
            alt
            filename
            mimeType
            filesize
            width
            height
            focalX
            focalY
            url
            thumbnailURL
            sizes {
              thumbnail { url width height mimeType filesize filename }
              square { url width height mimeType filesize filename }
              small { url width height mimeType filesize filename }
              medium { url width height mimeType filesize filename }
            }
          }
        }
        traningstider {
          dag
          startTid
          slutTid
          plats
          noteringar
        }
      }
    }
  }
`;
