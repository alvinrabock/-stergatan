// Simple test comparing regular vs Fogis context goal events
const API_SECRET = '3fb0faf1-45df-464c-8371-de0e4309a3e2';

async function testFogisContext() {
  const leagueId = '01JR052JATX2RRWKD0GN4D2WT1'; // SMC ULID for Allsvenskan 2025
  const matchId = '01JR056XF5B30A8WWRZJ1RJFRC';  // SMC ULID for match
  const extLeagueId = '123864';  // Fogis tournament ID
  const extMatchId = '6143389';   // Fogis match ID

  console.log('🔍 Testing Regular vs Fogis Context Endpoints\n');
  console.log('═══════════════════════════════════════════════\n');

  // Test 1: Regular endpoint
  console.log('TEST 1: Regular Goal Events Endpoint');
  console.log('─────────────────────────────────────');
  const regularUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches/${matchId}/events/goal`;
  console.log('URL:', regularUrl);

  try {
    const response = await fetch(regularUrl, {
      headers: { 'Authorization': API_SECRET }
    });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const firstGoal = data[0];
      console.log('\n✅ First goal from REGULAR endpoint:');
      console.log('  player-id:', firstGoal['player-id']);
      console.log('  player-id type:', typeof firstGoal['player-id']);
      console.log('  Has ext-player-id?', 'ext-player-id' in firstGoal);
      console.log('  Has player-name?', 'player-name' in firstGoal);
    }
  } catch (error) {
    console.error('❌ Regular endpoint failed:', error.message);
  }

  console.log('\n');

  // Test 2: Fogis context endpoint
  console.log('TEST 2: Fogis Context Goal Events Endpoint');
  console.log('─────────────────────────────────────────');
  const fogisUrl = `https://smc-api.telenor.no/fogis/leagues/${extLeagueId}/matches/${extMatchId}/events/goal`;
  console.log('URL:', fogisUrl);

  try {
    const response = await fetch(fogisUrl, {
      headers: { 'Authorization': API_SECRET }
    });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const firstGoal = data[0];
      console.log('\n✅ First goal from FOGIS CONTEXT endpoint:');
      console.log('  player-id:', firstGoal['player-id']);
      console.log('  player-id type:', typeof firstGoal['player-id']);
      console.log('  Is numeric?', /^\d+$/.test(String(firstGoal['player-id'])));
      console.log('  Has ext-player-id?', 'ext-player-id' in firstGoal);
      if ('ext-player-id' in firstGoal) {
        console.log('  ext-player-id:', firstGoal['ext-player-id']);
      }
      console.log('  Has player-name?', 'player-name' in firstGoal);
      if ('player-name' in firstGoal) {
        console.log('  player-name:', firstGoal['player-name']);
      }
    }
  } catch (error) {
    console.error('❌ Fogis endpoint failed:', error.message);
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('\n📋 EXPECTED BEHAVIOR (according to PDF):');
  console.log('  - Fogis context should have player-id as Fogis numeric ID');
  console.log('  - OR have ext-player-id field with Fogis numeric ID');
  console.log('  - This would allow matching with lineup ext-player-id\n');
}

testFogisContext();
