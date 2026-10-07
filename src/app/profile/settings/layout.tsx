import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile settings | suedeMarket',
  robots: { index: false, follow: false },
}

export default function ProfileSettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
