"use server";

import client from "../apolloClient";
import { GET_TEAMS_WITH_SEF_ENABLED } from "./fetchTeamForMatchesQuery";

export const fetchTeamsWithSMC = async () => {
  const { data } = await client.query({
    query: GET_TEAMS_WITH_SEF_ENABLED,
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { tags: ['lag-data'] },
      },
    },
  });

  return data.Lags?.docs || [];
};
