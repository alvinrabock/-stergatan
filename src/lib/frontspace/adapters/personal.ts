/**
 * Personal (Staff) Adapter
 * Adapts Frontspace Personal type to match legacy Personal type from Payload
 */

import { frontspace } from '../client';
import type { Personal as _FrontspacePersonal } from '../types';
import type { Personal } from '@/types';

/**
 * Transform Frontspace Personal to legacy Personal format
 */
function transformPersonal(personal: any): Personal {
  // Frontspace stores custom fields in the 'content' object
  const content = personal.content || {};

  // Transform the photo/bild - it's a URL string in Frontspace
  const bildUrl = content.profilbild || content.bild;
  const photo = bildUrl ? {
    id: bildUrl,
    url: bildUrl,
    alt: personal.title,
    filename: bildUrl.split('/').pop() || 'profile.jpg',
  } : undefined;

  return {
    id: personal.id,
    slug: personal.slug,
    title: personal.title,
    namn: personal.title,
    befattning: content.roll || content.befattning,
    jobTitle: content.roll || content.befattning,
    avdelning: content.avdelning,
    bild: photo,
    photo: photo,
    telefon: content.telefon,
    phoneNumber: content.telefon,
    epost: content.email || content.epost,
    email: content.email || content.epost,
    beskrivning: content.beskrivning,
    visaPaHemsida: content.visaPaHemsida || false,
    sortOrder: personal.sort_order ?? content.sort_order ?? 999,
    createdAt: personal.created_at || personal.createdAt,
    updatedAt: personal.updated_at || personal.updatedAt,
  } as Personal;
}

/**
 * Fetch all staff members
 */
export async function fetchAllPersonal(limit = 100): Promise<Personal[]> {
  try {
    const { posts } = await frontspace.personal.getAll({ limit });
    return posts.map(transformPersonal);
  } catch (error) {
    console.error('Error fetching personal from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch single staff member by slug
 */
export async function fetchSinglePersonal(slug: string): Promise<Personal | null> {
  try {
    const personal = await frontspace.personal.getBySlug(slug);
    if (!personal) return null;

    return transformPersonal(personal);
  } catch (error) {
    console.error(`Error fetching personal ${slug} from Frontspace:`, error);
    return null;
  }
}

/**
 * Fetch staff members by department
 */
export async function fetchPersonalByAvdelning(avdelningSlug: string): Promise<Personal[]> {
  try {
    const { posts } = await frontspace.personal.getAll({
      filters: {
        'avdelning.slug': avdelningSlug,
      },
      limit: 100,
    });

    return posts.map(transformPersonal);
  } catch (error) {
    console.error(`Error fetching personal by avdelning ${avdelningSlug}:`, error);
    return [];
  }
}

/**
 * Fetch staff members for homepage
 */
export async function fetchHomepagePersonal(): Promise<Personal[]> {
  try {
    const { posts } = await frontspace.personal.getAll({
      filters: {
        visaPaHemsida: true,
      },
      limit: 100,
    });

    return posts.map(transformPersonal);
  } catch (error) {
    console.error('Error fetching homepage personal from Frontspace:', error);
    return [];
  }
}
