"use server";

import { Lag } from "@/types";
import client from "../apolloClient";
import { GET_SELECTED_GAMES } from "./fetchSelectedGamesQuery";

const REVALIDATE_LAG = 'lag-data';

export const GetSelectedGames = async () => {
    const { data } = await client.query({
      query: GET_SELECTED_GAMES,
      fetchPolicy: 'network-only',
      context: {
        fetchOptions: {
          next: { tags: REVALIDATE_LAG },
        },
      },
    });
  
    // Tell TypeScript the type here:
    const teams: Lag[] = data?.Lags?.docs || [];
  
    const teamsWithSelectedMatches = teams.filter(
      (team) => Array.isArray(team.selectedMatches) && team.selectedMatches.length > 0
    );
    
    return teamsWithSelectedMatches;
  };
  