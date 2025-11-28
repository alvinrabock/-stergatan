/**
 * Tenant-specific service booking contact information
 *
 * This file contains static contact data for each tenant's service booking section.
 * Each tenant has different locations with phone numbers and emails.
 */

export interface ServiceContact {
  name: string
  phone: string
  email: string
}

export interface TenantServiceContacts {
  locations: ServiceContact[]
}

/**
 * Service contact configurations for each tenant
 */
export const TENANT_SERVICE_CONTACTS: Record<string, TenantServiceContacts> = {
  kronobergsbil: {
    locations: [
      {
        name: 'Växjö',
        phone: '0470-719120',
        email: 'vaxjo@kronobergsbil.se',
      },
      {
        name: 'Ljungby',
        phone: '0372–25240',
        email: 'kontakt.ljungby@kronobergsbil.se',
      },
    ],
  },
  laholmsbil: {
    locations: [
      {
        name: 'Laholm',
        phone: '0430-369000',
        email: 'info@laholmsbil.se',
      },
    ],
  },
  newmanbil: {
    locations: [
      {
        name: 'Hässleholm',
        phone: '0451-384 000',
        email: 'info@newmanbil.se',
      },
    ],
  },
}

/**
 * Get service contacts for a specific tenant
 * @param tenantId - The tenant ID (kronobergsbil, laholmsbil, newmanbil)
 * @returns Service contact configuration for the tenant
 */
export function getServiceContacts(tenantId: string): TenantServiceContacts {
  return TENANT_SERVICE_CONTACTS[tenantId] || TENANT_SERVICE_CONTACTS.kronobergsbil
}
