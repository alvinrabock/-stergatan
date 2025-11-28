// Quick test to find Fogis league IDs
const API_SECRET = '3fb0faf1-45df-464c-8371-de0e4309a3e2';

async function testFogisLeagues() {
  console.log('🔍 Fetching Fogis leagues...\n');

  try {
    const response = await fetch('https://smc-api.telenor.no/fogis/leagues', {
      headers: {
        'Authorization': API_SECRET,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Fogis leagues response:\n');
    console.log(JSON.stringify(data, null, 2));

    // Try to find Allsvenskan
    if (Array.isArray(data)) {
      const allsvenskan = data.find(league =>
        league.name?.toLowerCase().includes('allsvenskan') ||
        league['league-name']?.toLowerCase().includes('allsvenskan')
      );

      if (allsvenskan) {
        console.log('\n🎯 Found Allsvenskan:');
        console.log(JSON.stringify(allsvenskan, null, 2));
      }
    }
  } catch (error) {
    console.error('❌ Fetch failed:', error.message);
  }
}

testFogisLeagues();
