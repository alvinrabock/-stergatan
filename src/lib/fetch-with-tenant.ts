/**
 * Tenant-aware data fetching utilities
 *
 * These functions automatically use the current tenant's store ID
 * and API key based on the request domain.
 */

import { getCurrentStoreId, getCurrentApiKey } from './get-tenant'
import { FrontspaceClient } from './frontspace-client'
import type { Page, Header, Footer } from './frontspace-client'

/**
 * Get a Frontspace client for the current tenant
 * Uses tenant-specific API key if available
 */
export async function getTenantClient() {
  const [storeId, apiKey] = await Promise.all([
    getCurrentStoreId(),
    getCurrentApiKey()
  ])

  return new FrontspaceClient(
    process.env.FRONTSPACE_API_URL || 'http://localhost:3000/api/graphql',
    storeId,
    apiKey
  )
}

/**
 * Fetch a page by slug for the current tenant
 */
export async function getPage(slug: string): Promise<Page | null> {
  const client = await getTenantClient()
  return client.getPage(slug)
}

/**
 * Fetch all pages for the current tenant
 */
export async function getAllPages(): Promise<Page[]> {
  const client = await getTenantClient()
  return client.getAllPages()
}

/**
 * Fetch all page slugs for the current tenant
 */
export async function getAllPageSlugs(): Promise<string[]> {
  const client = await getTenantClient()
  return client.getAllPageSlugs()
}

/**
 * Fetch header for the current tenant
 */
export async function getHeader(): Promise<Header | null> {
  const client = await getTenantClient()
  return client.getHeader()
}

/**
 * Fetch footer for the current tenant
 */
export async function getFooter(): Promise<Footer | null> {
  const client = await getTenantClient()
  return client.getFooter()
}
