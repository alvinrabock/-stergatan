import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const SMC_BASE_URL = 'https://smc-api.telenor.no'
const OSTERS_TEAM_ID = '01JVVHS4ESCV6K0GYXXB0K1NHS'
const OSTERS_EXTERNAL_ID = '25526'
const CACHE_FILE_PATH = path.join(process.cwd(), 'src/data/league-cache.json')

interface League {
  LeagueId: string
  LeagueName: string
  StartDate: string
  EndDate: string
  tournamentID: number
}

interface Team {
  'team-id': string
  'external-id': string
  name: string
  'engaging-team': string
}

interface TeamResponse {
  team: Team[]
}

interface LeagueCache {
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

async function fetchFromSMC(endpoint: string) {
  const apiKey = process.env.SMC_SECRET

  if (!apiKey) {
    throw new Error('SMC_SECRET not configured')
  }

  const response = await fetch(`${SMC_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`SMC API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function discoverOstersLeagues() {
  console.log('🔍 Starting league discovery for Östers IF...')

  // Step 1: Fetch all leagues
  const leagues: League[] = await fetchFromSMC('/leagues')
  console.log(`📋 Found ${leagues.length} total leagues`)

  // Step 2: Check each league for Östers IF
  const ostersLeagues = []

  for (const league of leagues) {
    try {
      // Fetch teams for this league
      const teamsResponse: TeamResponse = await fetchFromSMC(`/leagues/${league.LeagueId}/teams`)

      // Find Östers IF team in this league
      const ostersTeam = teamsResponse.team?.find(
        team =>
          team['team-id'] === OSTERS_TEAM_ID ||
          team['external-id'] === OSTERS_EXTERNAL_ID ||
          team.name === 'Östers IF'
      )

      if (ostersTeam) {
        // Extract year from StartDate for season grouping
        const seasonYear = new Date(league.StartDate).getFullYear().toString()

        ostersLeagues.push({
          leagueId: league.LeagueId,
          leagueName: league.LeagueName,
          startDate: league.StartDate,
          endDate: league.EndDate,
          tournamentId: league.tournamentID,
          seasonYear,
          ostersTeamId: ostersTeam['team-id'], // Store league-specific team ID
        })

        console.log(`✅ Found Östers IF in: ${league.LeagueName} (${seasonYear}) - Team ID: ${ostersTeam['team-id']}`)
      }
    } catch (error) {
      console.error(`⚠️  Error checking league ${league.LeagueId}:`, error)
      // Continue with other leagues even if one fails
    }
  }

  console.log(`🎯 Total leagues with Östers IF: ${ostersLeagues.length}`)

  // Step 3: Create cache data
  const cacheData: LeagueCache = {
    teamId: OSTERS_TEAM_ID,
    teamName: 'Östers IF',
    lastUpdated: new Date().toISOString(),
    leagues: ostersLeagues.sort((a, b) => {
      // Sort by season year (newest first), then by league name
      if (a.seasonYear !== b.seasonYear) {
        return Number(b.seasonYear) - Number(a.seasonYear)
      }
      return a.leagueName.localeCompare(b.leagueName)
    }),
  }

  // Step 4: Write to cache file
  await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2), 'utf-8')
  console.log('💾 Cache file updated successfully')

  return cacheData
}

export async function GET(request: Request) {
  try {
    // Check if force refresh is requested
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'

    // Read existing cache
    let cacheData: LeagueCache | null = null
    try {
      const cacheContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8')
      cacheData = JSON.parse(cacheContent)
    } catch {
      console.log('No existing cache found, will create new one')
    }

    // Check if cache needs refresh
    const needsRefresh =
      forceRefresh ||
      !cacheData?.lastUpdated ||
      cacheData.leagues.length === 0

    if (needsRefresh) {
      console.log('🔄 Refreshing league cache...')
      cacheData = await discoverOstersLeagues()
    } else {
      console.log('✓ Using cached league data')
    }

    return NextResponse.json({
      success: true,
      data: cacheData,
      fromCache: !needsRefresh,
    })

  } catch (error) {
    console.error('❌ League discovery error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Force refresh on POST
    console.log('🔄 Manual refresh triggered')
    const cacheData = await discoverOstersLeagues()

    return NextResponse.json({
      success: true,
      data: cacheData,
      message: 'League cache refreshed successfully',
    })

  } catch (error) {
    console.error('❌ League discovery error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
