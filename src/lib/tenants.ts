/**
 * Multi-tenant configuration
 *
 * This file defines the tenant configurations for each brand.
 * Store IDs are set via environment variables to support staging and production.
 */

export interface TenantConfig {
  id: string
  name: string
  storeId: string
  domains: string[]
  localhostPort?: number // For local testing
}

/**
 * Get tenant-specific environment variable with fallback to default
 * Example: getTenantEnvVar('kronobergsbil', 'API_KEY', 'default_key')
 * Will check: FRONTSPACE_API_KEY_KRONOBERGSBIL -> FRONTSPACE_API_KEY -> default
 */
export function getTenantEnvVar(
  tenantId: string,
  varName: 'API_KEY' | 'WEBHOOK_SECRET' | 'STORE_ID',
  defaultValue: string = ''
): string {
  const tenantUppercase = tenantId.toUpperCase()
  const tenantSpecific = process.env[`FRONTSPACE_${varName}_${tenantUppercase}`]
  const generic = process.env[`FRONTSPACE_${varName}`]

  return tenantSpecific || generic || defaultValue
}

/**
 * Get tenant configuration with Store ID from environment variables
 * This allows different Store IDs for staging vs production
 */
function createTenantConfig(
  id: string,
  name: string,
  domains: string[],
  localhostPort?: number
): TenantConfig {
  return {
    id,
    name,
    storeId: getTenantEnvVar(id, 'STORE_ID', ''),
    domains,
    localhostPort,
  }
}

export const TENANTS: Record<string, TenantConfig> = {
  kronobergsbil: createTenantConfig(
    'kronobergsbil',
    'Kronobergs Bil',
    ['kronobergsbil.se', 'www.kronobergsbil.se', 'kronobergsbil.coolify.frontspace.se'],
    3002
  ),
  laholmsbil: createTenantConfig(
    'laholmsbil',
    'Laholms Bil',
    ['laholmsbil.se', 'www.laholmsbil.se', 'laholmsbil.coolify.frontspace.se'],
    3003
  ),
  newmanbil: createTenantConfig(
    'newmanbil',
    'Newman Bil',
    ['newmanbil.se', 'www.newmanbil.se', 'newmanbil.coolify.frontspace.se'],
    3004
  ),
}

/**
 * Get tenant configuration by domain
 * Supports both production domains and localhost ports
 */
export function getTenantByDomain(host: string | null): TenantConfig | null {
  if (!host) {
    // Fallback to default tenant if no host (SSR edge cases)
    return TENANTS.kronobergsbil
  }

  // Check if it's localhost with port
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    // Extract port from host (e.g., "localhost:3003" -> "3003")
    const portMatch = host.match(/:(\d+)/)
    if (portMatch) {
      const port = parseInt(portMatch[1], 10)

      // Find tenant by localhost port
      const tenant = Object.values(TENANTS).find(t => t.localhostPort === port)
      if (tenant) {
        return tenant
      }
    }

    // Default to kronobergsbil for localhost:3000 or localhost without port
    return TENANTS.kronobergsbil
  }

  // Check production domains
  const hostname = host.split(':')[0] // Remove port if present

  for (const tenant of Object.values(TENANTS)) {
    if (tenant.domains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return tenant
    }
  }

  // Fallback to default tenant
  return TENANTS.kronobergsbil
}

/**
 * Get tenant by ID
 */
export function getTenantById(id: string): TenantConfig | null {
  return TENANTS[id] || null
}

/**
 * Get all tenants
 */
export function getAllTenants(): TenantConfig[] {
  return Object.values(TENANTS)
}

/**
 * Build URL for a location on its tenant's domain
 * Returns localhost URL with port in development, production domain otherwise
 * Automatically detects staging environment and uses Coolify domains
 * @param tenantId - The tenant ID
 * @param locationSlug - The location slug (not used for /fordon links)
 * @param basePath - The base path (default: '/anlaggningar', can use '/fordon' for vehicle listings)
 */
export function buildLocationUrl(tenantId: string, locationSlug: string = '', basePath: string = '/anlaggningar'): string {
  const tenant = getTenantById(tenantId)
  if (!tenant) {
    // Fallback to relative URL if tenant not found
    console.warn(`[buildLocationUrl] Tenant not found for ID: ${tenantId}`)
    const fullPath = locationSlug ? `${basePath}/${locationSlug}` : basePath
    return fullPath
  }

  // Build the full path (with or without slug)
  const fullPath = locationSlug ? `${basePath}/${locationSlug}` : basePath

  // In development mode, use localhost URLs with tenant-specific ports
  if (process.env.NODE_ENV === 'development') {
    // Check if we're actually on localhost (browser environment)
    if (typeof window !== 'undefined') {
      const currentHost = window.location.host
      if (currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
        // Use localhost with target tenant's port (not current host port)
        const url = `http://localhost:${tenant.localhostPort}${fullPath}`
        return url
      }
    }
  }

  // Check if we're on staging (Coolify domain) - works in both dev and prod
  if (typeof window !== 'undefined') {
    const currentHost = window.location.host
    if (currentHost.includes('coolify.frontspace.se')) {
      // Use the Coolify staging domain for this tenant
      const stagingDomain = tenant.domains.find(d => d.includes('coolify.frontspace.se'))
      if (stagingDomain) {
        return `https://${stagingDomain}${fullPath}`
      }
    }
  }

  // Production: use first domain from tenant config (production domain)
  // This will be used for:
  // 1. Production builds on production domains
  // 2. SSR/build time (no window object)
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const domain = tenant.domains[0]
  return `${protocol}://${domain}${fullPath}`
}
