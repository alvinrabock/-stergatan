/**
 * Tenant-specific location/city configurations
 * Maps tenant IDs to their allowed cities for vehicle filtering
 */

export interface TenantLocations {
  cities: string[]
}

/**
 * Location configurations for each tenant
 * Cities should match the values in Typesense exactly (usually uppercase)
 */
export const TENANT_LOCATIONS: Record<string, TenantLocations> = {
  kronobergsbil: {
    cities: ['VÄXJÖ', 'LJUNGBY'],
  },
  laholmsbil: {
    cities: ['LAHOLM'],
  },
  newmanbil: {
    cities: ['HÄSSLEHOLM'],
  },
}

/**
 * Get allowed cities for a specific tenant
 * @param tenantId - The tenant ID (kronobergsbil, laholmsbil, newmanbil)
 * @returns Array of city names for the tenant
 */
export function getTenantCities(tenantId: string): string[] {
  return TENANT_LOCATIONS[tenantId]?.cities || TENANT_LOCATIONS.kronobergsbil.cities
}

/**
 * Get tenant cities as comma-separated string for Typesense filter
 * @param tenantId - The tenant ID
 * @returns Comma-separated city string (e.g., "VÄXJÖ,LJUNGBY")
 */
export function getTenantCitiesFilter(tenantId: string): string {
  return getTenantCities(tenantId).join(',')
}
