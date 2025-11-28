import fs from 'fs/promises'
import path from 'path'

const CACHE_FILE_PATH = path.join(process.cwd(), 'src/data/league-cache.json')

export interface LeagueCacheData {
  teamId: string
  teamName: string
  lastUpdated: string | null
  leagues: {
    leagueId: string
    leagueName: string
    startDate: string
    endDate: string
    tournamentId: number
    seasonYear: string
    ostersTeamId?: string // League-specific Östers IF team ID
  }[]
}

export interface SeasonGroup {
  seasonYear: string
  tournaments: {
    LeagueName: string
    leagueId: string
    id: string
    tournamentId: number
  }[]
}

/**
 * Get topbar configuration based on current season's league
 */
export async function getTopbarConfig(): Promise<{ allsvenskan: number; superettan: number; damallsvenskan: number; elitettan: number }> {
  const cache = await getLeagueCache()

  // Default: no topbars
  const config = {
    allsvenskan: 0,
    superettan: 0,
    damallsvenskan: 0,
    elitettan: 0,
  }

  if (!cache) return config

  // Get current year
  const currentYear = new Date().getFullYear().toString()

  // Find leagues for current season
  const currentSeasonLeagues = cache.leagues.filter(l => l.seasonYear === currentYear)

  // Determine which league(s) to show based on league name
  for (const league of currentSeasonLeagues) {
    const leagueName = league.leagueName.toLowerCase()

    if (leagueName.includes('allsvenskan')) {
      config.allsvenskan = 1
    } else if (leagueName.includes('superettan')) {
      config.superettan = 1
    } else if (leagueName.includes('damallsvenskan')) {
      config.damallsvenskan = 1
    } else if (leagueName.includes('elitettan')) {
      config.elitettan = 1
    }
  }

  return config
}

/**
 * Reads the league cache from disk
 */
export async function getLeagueCache(): Promise<LeagueCacheData | null> {
  try {
    const cacheContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8')
    return JSON.parse(cacheContent)
  } catch (error) {
    console.error('Error reading league cache:', error)
    return null
  }
}

/**
 * Gets all leagues for a specific season
 */
export async function getLeaguesBySeason(seasonYear: string): Promise<LeagueCacheData['leagues']> {
  const cache = await getLeagueCache()
  if (!cache) return []

  return cache.leagues.filter(league => league.seasonYear === seasonYear)
}

/**
 * Gets all unique season years from the cache
 */
export async function getAllSeasons(): Promise<string[]> {
  const cache = await getLeagueCache()
  if (!cache) return []

  const seasons = [...new Set(cache.leagues.map(league => league.seasonYear))]
  return seasons.sort((a, b) => Number(b) - Number(a)) // Newest first
}

/**
 * Gets leagues grouped by season (formatted for MatchFilters compatibility)
 */
export async function getLeaguesGroupedBySeason(): Promise<SeasonGroup[]> {
  const cache = await getLeagueCache()
  if (!cache) return []

  const seasonMap = new Map<string, SeasonGroup>()

  cache.leagues.forEach(league => {
    if (!seasonMap.has(league.seasonYear)) {
      seasonMap.set(league.seasonYear, {
        seasonYear: league.seasonYear,
        tournaments: [],
      })
    }

    seasonMap.get(league.seasonYear)?.tournaments.push({
      LeagueName: league.leagueName,
      leagueId: league.leagueId,
      id: league.leagueId,
      tournamentId: league.tournamentId,
    })
  })

  return Array.from(seasonMap.values()).sort(
    (a, b) => Number(b.seasonYear) - Number(a.seasonYear)
  )
}

/**
 * Gets a specific league by ID
 */
export async function getLeagueById(leagueId: string): Promise<LeagueCacheData['leagues'][0] | null> {
  const cache = await getLeagueCache()
  if (!cache) return null

  return cache.leagues.find(league => league.leagueId === leagueId) || null
}

/**
 * Checks if the cache is stale (older than specified days)
 */
export async function isCacheStale(daysThreshold: number = 7): Promise<boolean> {
  const cache = await getLeagueCache()
  if (!cache?.lastUpdated) return true

  const lastUpdated = new Date(cache.lastUpdated)
  const now = new Date()
  const daysDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)

  return daysDiff > daysThreshold
}

/**
 * Triggers a cache refresh via the API route
 */
export async function refreshLeagueCache(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001'}/api/discover-leagues`, {
      method: 'POST',
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Error refreshing league cache:', error)
    return false
  }
}
