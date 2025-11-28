/**
 * Webhook alias - redirects to the main webhook handler
 * This provides backward compatibility for webhook URLs using /api/webhooks/frontspace
 */

export { GET, POST } from '@/app/api/frontspace/webhook/route';
