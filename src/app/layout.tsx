import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { siteMetadata } from './site-metadata'
import './globals.css'

export const metadata: Metadata = siteMetadata

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://suedeai.ai/#organization',
      name: 'Suede Labs AI',
      url: 'https://suedeai.ai',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://market.suedeai.ai/#website',
      name: 'suedeMarket',
      url: 'https://market.suedeai.ai',
      description: 'A prelaunch musical instrument marketplace built for agents and humans.',
      publisher: { '@id': 'https://suedeai.ai/#organization' },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
