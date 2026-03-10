import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  getOrder,
  updateOrderStatus,
  cancelOrder,
} from '@/lib/services/orders.service'
import type { OrderStatus } from '@/lib/types'

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
    const order = await getOrder(supabase, id, user.id)
    return NextResponse.json(order)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Order not found'
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
    let result

    if (body.status === 'cancelled') {
      result = await cancelOrder(supabase, id, user.id)
    } else if (body.status) {
      result = await updateOrderStatus(supabase, id, user.id, body.status as OrderStatus)
    } else {
      return NextResponse.json({ error: 'status is required' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update order'
    const status = message.includes('Not authorized') ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
