export async function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number>
) {
  const storeId = process.env.NEXT_PUBLIC_FRONTSPACE_STORE_ID

  if (!storeId || typeof window === 'undefined') return

  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeId,
      type: 'event',
      payload: {
        url: window.location.pathname,
        hostname: window.location.hostname,
        name: eventName,
        data: eventData,
      },
    }),
  }).catch(() => {})
}
