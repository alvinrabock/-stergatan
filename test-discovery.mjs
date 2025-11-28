// Simple test script to trigger league discovery
// Run with: node test-discovery.mjs

const SMC_BASE_URL = 'https://smc-api.telenor.no'
const OSTERS_TEAM_ID = '01JVVHS4ESCV6K0GYXXB0K1NHS'
const OSTERS_EXTERNAL_ID = '25526'

// You need to set this
const SMC_SECRET = '3fb0faf1-45df-464c-8371-de0e4309a3e2'

async function testDiscovery() {
  console.log('🔍 Testing league discovery...\n')

  try {
    // Step 1: Fetch all leagues
    console.log('Step 1: Fetching all leagues...')
    const leaguesResponse = await fetch(`${SMC_BASE_URL}/leagues`, {
      headers: {
        'Authorization': SMC_SECRET,
      },
    })

    if (!leaguesResponse.ok) {
      throw new Error(`Failed to fetch leagues: ${leaguesResponse.status}`)
    }

    const leagues = await leaguesResponse.json()
    console.log(`✓ Found ${leagues.length} total leagues\n`)

    // Step 2: Check first 3 leagues for Östers IF
    console.log('Step 2: Checking first 3 leagues for Östers IF...')

    for (let i = 0; i < Math.min(3, leagues.length); i++) {
      const league = leagues[i]
      console.log(`\nChecking: ${league.LeagueName} (ID: ${league.LeagueId})`)

      const teamsResponse = await fetch(`${SMC_BASE_URL}/leagues/${league.LeagueId}/teams`, {
        headers: {
          'Authorization': SMC_SECRET,
        },
      })

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json()
        const teams = teamsData.team || []
        console.log(`  → ${teams.length} teams in this league`)

        const ostersFound = teams.find(
          team =>
            team['team-id'] === OSTERS_TEAM_ID ||
            team['external-id'] === OSTERS_EXTERNAL_ID ||
            team.name === 'Östers IF'
        )

        if (ostersFound) {
          console.log(`  ✅ FOUND ÖSTERS IF!`)
          console.log(`     Team ID: ${ostersFound['team-id']}`)
          console.log(`     External ID: ${ostersFound['external-id']}`)
        } else {
          console.log(`  ❌ Östers IF not in this league`)
        }
      } else {
        console.log(`  ⚠️  Could not fetch teams (${teamsResponse.status})`)
      }
    }

    console.log('\n✓ Test completed!')
    console.log('\nTo run the full discovery, start your dev server and visit:')
    console.log('  http://localhost:3001/new-smc/admin')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testDiscovery()
