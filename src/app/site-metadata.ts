import type { Metadata } from 'next'

const SITE_URL = 'https://market.suedeai.ai'
const TITLE = 'suedeMarket — Musical Instrument Marketplace'
const DESCRIPTION = 'Buy and sell musical instruments. Built for agents and humans.'

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'suedeMarket',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
}
