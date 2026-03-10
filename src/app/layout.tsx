import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'suedeMarket — Musical Instrument Marketplace',
  description: 'Buy and sell musical instruments. Built for agents and humans.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  )
}
