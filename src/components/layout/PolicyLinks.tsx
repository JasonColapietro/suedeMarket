// SuedeMarket is a Suede AI website, so it links the estate's published
// policy and contact pages instead of keeping copies of its own.
export const POLICY_LINKS = [
  { label: 'Privacy Policy', href: 'https://suedeai.ai/privacy' },
  { label: 'Terms of Service', href: 'https://suedeai.ai/terms' },
  { label: 'Contact', href: 'https://suedeai.ai/contact' },
] as const

export function PolicyLinks({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Suede AI policies" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {POLICY_LINKS.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="underline-offset-2 transition-colors hover:underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
