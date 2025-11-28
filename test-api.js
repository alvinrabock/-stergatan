// Quick script to test if the Norkring API is responding

async function testAPIs() {
  console.log("🔍 Testing Norkring API...\n");

  const norkringUrl = "https://api-connect.norkring.net/norkring-as/part2/smc/v1/leagues/1/matches";

  // Test 1: Norkring API (the one failing in your code)
  try {
    console.log("Testing:", norkringUrl);
    const response = await fetch(norkringUrl, {
      method: "GET",
      headers: {
        "X-IBM-Client-Id": process.env.SMC_KEY || "",
        "X-IBM-Client-Secret": process.env.SMC_SECRET || "",
        "Accept": "application/json",
      },
    });

    console.log("✅ Response Status:", response.status, response.statusText);
    console.log("✅ Response OK:", response.ok);

    if (!response.ok) {
      const text = await response.text();
      console.log("❌ Response Body:", text.substring(0, 500));
    } else {
      console.log("✅ API is responding successfully!");
    }
  } catch (error) {
    console.error("❌ Fetch failed with error:");
    console.error(error.message);
    console.error("Full error:", error);
  }

  console.log("\n" + "=".repeat(60) + "\n");

  // Test 2: eBiljett API
  const ebiljettUrl = "https://foundationapi-stage.ebiljett.nu/v1/247/events?FromDate=2025-04-08";

  try {
    console.log("🔍 Testing eBiljett API...");
    console.log("Testing:", ebiljettUrl);
    const response = await fetch(ebiljettUrl, {
      headers: {
        Authorization: `Basic ${process.env.EBILJETT_BASIC_AUTH || ""}`,
      },
    });

    console.log("✅ Response Status:", response.status, response.statusText);
    console.log("✅ Response OK:", response.ok);

    if (!response.ok) {
      const text = await response.text();
      console.log("❌ Response Body:", text.substring(0, 500));
    } else {
      console.log("✅ API is responding successfully!");
    }
  } catch (error) {
    console.error("❌ Fetch failed with error:");
    console.error(error.message);
    console.error("Full error:", error);
  }
}

testAPIs();
