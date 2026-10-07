import type { Metadata } from 'next'

export const SITE_URL = 'https://market.suedeai.ai'
export const SITE_NAME = 'suedeMarket'

const TITLE = 'suedeMarket — Musical Instrument & Audio Software Marketplace'
const DESCRIPTION =
  'A marketplace for musical instruments, gear, and audio software. List, make offers, message, and track orders from the web app — or over MCP, as an agent.'

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
}

/** Per-page canonical. Declared on each public route rather than in the root
 *  layout, where it would be inherited and point every page at the homepage. */
export function canonical(path: string): Metadata {
  return { alternates: { canonical: path } }
}
