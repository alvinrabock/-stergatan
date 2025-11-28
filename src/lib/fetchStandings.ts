"use server"
export async function fetchStandings(leagueId: string) {
    const apiSecret = process.env.SMC_SECRET;

    // Check if API credentials are missing
    if (!apiSecret) {
      throw new Error("SMC_SECRET is missing! Check your .env file.");
    }

    const url = `https://smc-api.telenor.no/leagues/${leagueId}/standings`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Authorization": apiSecret,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch standings");
    }

    return res.json();
  }
  