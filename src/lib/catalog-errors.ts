// Log only diagnostic codes, never raw backend messages, headers or cookies.
export function reportCatalogError(resource: 'listings' | 'categories', error: unknown) {
  const fields = error && typeof error === 'object'
    ? error as { code?: unknown; message?: unknown; details?: unknown }
    : {}
  const code = typeof fields.code === 'string' && /^[A-Z0-9_]{1,40}$/.test(fields.code)
    ? fields.code
    : undefined
  const details = typeof fields.details === 'string' ? fields.details : ''
  const cause = ['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET']
    .find((value) => details.includes(value))
  const transport = fields.message === 'TypeError: fetch failed'
  console.error(`[catalog:${resource}] unavailable`, {
    code: code ?? (transport ? 'FETCH_FAILED' : 'UNKNOWN'),
    ...(cause ? { cause } : {}),
  })
}

export function catalogUnavailable(resource: 'listings' | 'categories', error: unknown) {
  reportCatalogError(resource, error)
  return Response.json(
    {
      error: `${resource === 'listings' ? 'Listings' : 'Categories'} are temporarily unavailable. Please try again shortly.`,
      code: 'CATALOG_UNAVAILABLE',
    },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
