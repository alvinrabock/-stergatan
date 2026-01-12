/**
 * Track a custom analytics event
 * Uses sendBeacon for non-blocking, survives page navigation
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number>
) {
  const storeId = process.env.NEXT_PUBLIC_FRONTSPACE_STORE_ID

  if (!storeId || typeof window === 'undefined') return

  const payload = JSON.stringify({
    storeId,
    type: 'event',
    payload: {
      url: window.location.pathname,
      hostname: window.location.hostname,
      name: eventName,
      data: eventData,
    },
  })

  // sendBeacon is non-blocking, survives page navigation, low priority
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', payload)
  } else {
    // Fallback for older browsers
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }
}
