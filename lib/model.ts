import { siteConfig } from '@/lib/config'

/**
 * Returns the configured AI model.
 *
 * On Vercel: uses AI Gateway via the string format "anthropic/model-id".
 * AI Gateway handles all authentication — no API key env var needed.
 * Configure BYOK credentials in Vercel > Settings > AI Gateway.
 *
 * For local development: set ANTHROPIC_API_KEY in .env.local,
 * which the @ai-sdk/anthropic provider reads automatically.
 */
export function getModel() {
  // When ANTHROPIC_API_KEY is set (local dev), use the direct provider
  // for lower latency (skips gateway proxy)
  if (process.env.ANTHROPIC_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { anthropic } = require('@ai-sdk/anthropic')
    return anthropic(siteConfig.model.id)
  }

  // Vercel AI Gateway — string format routed through gateway automatically
  return `anthropic/${siteConfig.model.id}`
}
