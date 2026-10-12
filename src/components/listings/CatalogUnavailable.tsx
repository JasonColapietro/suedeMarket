export function CatalogUnavailable({
  categoriesOnly = false,
  retryHref = '/listings',
}: {
  categoriesOnly?: boolean
  retryHref?: string
}) {
  return (
    <div role="status" className="rounded-sm border border-white/10 bg-[#1a1a22] px-6 py-8 text-center">
      <p className="text-lg font-medium text-white/80">
        {categoriesOnly ? 'Category filters temporarily unavailable' : 'Listings temporarily unavailable'}
      </p>
      <p className="mt-2 text-sm text-white/60">Please try again shortly.</p>
      {/* A full request retries the failed queries, even for the current URL. */}
      <a href={retryHref} className="mt-4 inline-block text-sm text-white underline underline-offset-4">
        Try again
      </a>
    </div>
  )
}
