import type { MetadataRoute } from 'next'
import { SITE_URL } from './site-metadata'

// Only publicly reachable routes. Listing detail pages are intentionally absent
// until the catalog has stable public inventory to point crawlers at.
const ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/listings', changeFrequency: 'daily', priority: 0.8 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/login', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
