// app/events/page.tsx

export default async function EventsPage() {
    const res = await fetch(
      'https://foundationapi-stage.ebiljett.nu/v1/247/events?FromDate=2025-04-08',
      {
        headers: {
          Authorization: `Basic ${process.env.EBILJETT_BASIC_AUTH}`,
        },
        cache: 'no-store',
      }
    );
  
    if (!res.ok) {
      const text = await res.text(); // just in case it's not JSON
      console.error('Error fetching data:', text);
      throw new Error('Failed to fetch events');
    }
  
    const rawData = await res.json();
    
    return (
      <pre className="whitespace-pre-wrap text-sm p-4">
        {JSON.stringify(rawData, null, 2)}
      </pre>
    );
  }
  