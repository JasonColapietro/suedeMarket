import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  getOffer,
  acceptOffer,
  rejectOffer,
  counterOffer,
  withdrawOffer,
} from '@/lib/services/offers.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const offer = await getOffer(supabase, id, user.id)
    return NextResponse.json(offer)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Offer not found'
    const status = message.includes('Not authorized') ? 403 : 404
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action } = body

    let result
    switch (action) {
      case 'accept':
        result = await acceptOffer(supabase, id, user.id)
        break
      case 'reject':
        result = await rejectOffer(supabase, id, user.id)
        break
      case 'counter':
        if (!body.amount_cents) {
          return NextResponse.json(
            { error: 'amount_cents is required for counter offer' },
            { status: 400 },
          )
        }
        result = await counterOffer(supabase, id, user.id, body.amount_cents, body.message)
        break
      case 'withdraw':
        result = await withdrawOffer(supabase, id, user.id)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: accept, reject, counter, withdraw' },
          { status: 400 },
        )
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update offer'
    const status = message.includes('Not authorized') ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
