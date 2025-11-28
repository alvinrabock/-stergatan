/**
 * Safe client getter that works during both build-time and runtime
 *
 * - During build: uses default client with environment variables
 * - During runtime: tries to use tenant-aware client, falls back to default
 */

import client from './frontspace-client'
import { FrontspaceClient } from './frontspace-client'

/**
 * Get a Frontspace client that works safely during build and runtime
 *
 * This function attempts to use the tenant-aware client during runtime,
 * but falls back to the default client during build time when headers
 * are not available.
 */
export async function getClientSafe(): Promise<FrontspaceClient> {
  try {
    // Try to get headers - this will only work during runtime with actual requests
    const { headers } = await import('next/headers')
    const headersList = await headers()
    const host = headersList.get('host')

    // If we have a host header, use tenant-aware client
    if (host) {
      const { getTenantClient } = await import('./fetch-with-tenant')
      return await getTenantClient()
    }
  } catch {
    // Headers not available (build time) or other error - use default client
  }

  // Fall back to default client (used during build or when headers aren't available)
  return client
}
