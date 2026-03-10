import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { makeOffer } from '@/lib/services/offers.service'

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
    if (!body.listing_id || !body.amount_cents) {
      return NextResponse.json(
        { error: 'listing_id and amount_cents are required' },
        { status: 400 },
      )
    }
    const offer = await makeOffer(supabase, user.id, body)
    return NextResponse.json(offer, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create offer'
    const status = message.includes('not active') || message.includes('your own') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
