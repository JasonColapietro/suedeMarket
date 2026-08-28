import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: 'suedeMarket — Musical Instrument Marketplace',
  description: 'Buy and sell musical instruments. Built for agents and humans.',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
}
