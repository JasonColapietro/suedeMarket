import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getMyOrders, createOrderFromOffer } from '@/lib/services/orders.service'

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const role = (searchParams.get('role') as 'buying' | 'selling') ?? 'buying'
    const orders = await getMyOrders(supabase, user.id, role)
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
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
    if (!body.offer_id) {
      return NextResponse.json(
        { error: 'offer_id is required' },
        { status: 400 },
      )
    }
    const order = await createOrderFromOffer(supabase, body.offer_id, user.id, body)
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order'
    const status = message.includes('not accepted') || message.includes('Not authorized') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
