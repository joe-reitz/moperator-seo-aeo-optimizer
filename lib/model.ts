import { anthropic } from '@ai-sdk/anthropic'
import { siteConfig } from '@/lib/config'

/**
 * Returns the configured AI model.
 *
 * On Vercel with AI Gateway: the gateway auto-provisions ANTHROPIC_API_KEY,
 * so this works without any manual configuration.
 *
 * For local development: set ANTHROPIC_API_KEY in .env.local
 * (see .env.example for instructions).
 */
export function getModel() {
  return anthropic(siteConfig.model.id)
}
