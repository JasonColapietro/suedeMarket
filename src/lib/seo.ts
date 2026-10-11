import type { Metadata } from 'next'

const SITE_URL = 'https://market.suedeai.ai'
const SHARE_IMAGE = {
  url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80',
  width: 1920,
  height: 1280,
  alt: 'Wall-mounted guitars and a mixing console in a recording studio',
}

export function createPublicPageMetadata({
  path,
  title,
  description,
}: {
  path: string
  title: string
  description: string
}): Metadata {
  const url = new URL(path, SITE_URL).toString()

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'suedeMarket',
      title,
      description,
      url,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
    },
  }
}
