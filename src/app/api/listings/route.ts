import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { searchListings, createListing } from '@/lib/services/listings.service'
import type { ListingCondition, SearchListingsParams } from '@/lib/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const params: SearchListingsParams = {
    q: searchParams.get('q') ?? undefined,
    category_id: searchParams.get('category_id') ?? undefined,
    condition: (searchParams.get('condition') as ListingCondition) ?? undefined,
    min_price: searchParams.has('min_price')
      ? Number(searchParams.get('min_price'))
      : undefined,
    max_price: searchParams.has('max_price')
      ? Number(searchParams.get('max_price'))
      : undefined,
    sort: (searchParams.get('sort') as SearchListingsParams['sort']) ?? undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    offset: searchParams.has('offset')
      ? Number(searchParams.get('offset'))
      : undefined,
  }

  try {
    const result = await searchListings(supabase, params)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const listing = await createListing(supabase, user.id, body)
    return NextResponse.json(listing, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}
