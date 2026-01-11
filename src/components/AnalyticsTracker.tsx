'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface AnalyticsTrackerProps {
  storeId: string
}

export function AnalyticsTracker({ storeId }: AnalyticsTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startTimeRef = useRef<number>(0)
  const urlRef = useRef<string>('')
  const lastTrackedUrlRef = useRef<string>('')

  const searchString = searchParams.toString()

  useEffect(() => {
    if (!storeId) return

    const url = pathname + (searchString ? `?${searchString}` : '')

    // Prevent duplicate tracking for the same URL
    if (url === lastTrackedUrlRef.current) return
    lastTrackedUrlRef.current = url

    startTimeRef.current = Date.now()
    urlRef.current = url

    // Track page view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId,
        type: 'event',
        payload: {
          url,
          hostname: window.location.hostname,
          referrer: document.referrer,
          language: navigator.language,
          ua: navigator.userAgent,
          screen: `${screen.width}x${screen.height}`,
        },
      }),
    }).catch(() => {})

    // Track duration on page leave
    const trackDuration = () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      if (duration > 0) {
        navigator.sendBeacon('/api/analytics', JSON.stringify({
          storeId,
          type: 'event',
          payload: {
            url: urlRef.current,
            hostname: window.location.hostname,
            name: 'page_leave',
            data: { duration },
          },
        }))
      }
    }

    window.addEventListener('beforeunload', trackDuration)

    return () => {
      window.removeEventListener('beforeunload', trackDuration)
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      if (duration > 0) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId,
            type: 'event',
            payload: {
              url: urlRef.current,
              hostname: window.location.hostname,
              name: 'page_leave',
              data: { duration },
            },
          }),
          keepalive: true,
        }).catch(() => {})
      }
    }
  }, [pathname, searchString, storeId])

  return null
}
