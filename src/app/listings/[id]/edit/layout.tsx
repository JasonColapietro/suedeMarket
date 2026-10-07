import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit your listing | suedeMarket',
  robots: { index: false, follow: false },
}

export default function EditListingLayout({ children }: { children: React.ReactNode }) {
  return children
}
