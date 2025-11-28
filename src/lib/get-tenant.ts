/**
 * Utility to get current tenant from request
 */

import { getTenantByDomain, getTenantEnvVar, type TenantConfig } from './tenants'

/**
 * Get current tenant based on request host header
 * Use this in Server Components and Server Actions
 */
export async function getCurrentTenant(): Promise<TenantConfig> {
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const host = headersList.get('host')

  const tenant = getTenantByDomain(host)

  if (!tenant) {
    // This should never happen due to fallback, but TypeScript needs it
    throw new Error(`No tenant configuration found for host: ${host}`)
  }

  return tenant
}

/**
 * Get current store ID
 * Shorthand for getting just the store ID
 */
export async function getCurrentStoreId(): Promise<string> {
  const tenant = await getCurrentTenant()
  return tenant.storeId
}

/**
 * Get API key for current tenant
 * Checks tenant-specific env var first, then falls back to generic
 */
export async function getCurrentApiKey(): Promise<string> {
  const tenant = await getCurrentTenant()
  return getTenantEnvVar(tenant.id, 'API_KEY', process.env.FRONTSPACE_API_KEY || '')
}

/**
 * Get webhook secret for current tenant
 * Checks tenant-specific env var first, then falls back to generic
 */
export async function getCurrentWebhookSecret(): Promise<string> {
  const tenant = await getCurrentTenant()
  return getTenantEnvVar(tenant.id, 'WEBHOOK_SECRET', process.env.FRONTSPACE_WEBHOOK_SECRET || '')
}
