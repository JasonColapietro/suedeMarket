import { NextResponse, type NextRequest } from 'next/server'

const RETIRED_PATHS = [
  '/listings', '/api', '/login', '/register', '/callback',
  '/dashboard', '/messages', '/orders', '/profile',
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (!RETIRED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  const headers = { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=3600' }
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'The suedeMarket marketplace has been retired.', code: 'MARKET_RETIRED' },
      { status: 410, headers },
    )
  }

  // No replacement exists for marketplace records or account functions.
  // A navigational link to reference material is not a redirect or canonical.
  return new NextResponse(`<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Marketplace retired | suedeMarket</title></head><body>
<main><h1>The suedeMarket marketplace has been retired</h1>
<p>Listings, accounts and transaction tools are no longer available.</p>
<p><a href="/">Read the musical instrument buying and selling guides</a>.</p>
</main></body></html>`, {
    status: 410,
    headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
