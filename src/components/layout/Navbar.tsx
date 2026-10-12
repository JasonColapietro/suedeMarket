import Link from 'next/link'

export function Navbar() {
  return (
    <nav aria-label="Guide navigation" className="border-b border-white/10 bg-[#0f0f14] px-6 py-5 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-sm font-semibold tracking-wider">suedeMarket · guides</Link>
        <div className="flex flex-wrap gap-6 text-sm text-white/80">
          <Link href="/#buying-guide">Buying checklist</Link>
          <Link href="/#selling-guide">Selling guide</Link>
          <Link href="/ai-instructions">Citation guide</Link>
        </div>
      </div>
    </nav>
  )
}
