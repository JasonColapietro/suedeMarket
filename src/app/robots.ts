import type { MetadataRoute } from 'next'
import { SITE_URL } from './site-metadata'

// Mirrors the crawl policy published on ip.suedeai.ai and dna.suedeai.ai:
// open to conventional crawlers and to AI answer engines alike.
const AI_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
]

// Authenticated surfaces hold per-account data and have nothing to index.
const PRIVATE_PATHS = ['/api/', '/dashboard', '/orders', '/messages', '/profile/settings']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: AI_USER_AGENTS, allow: '/', disallow: PRIVATE_PATHS },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
