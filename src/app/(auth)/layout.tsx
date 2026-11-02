import type { Metadata } from 'next'

// Retired routes are answered by middleware; do not prerender account clients.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Account access | suedeMarket',
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
