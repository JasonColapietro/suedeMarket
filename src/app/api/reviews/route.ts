import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createReview, getReviewsForUser } from '@/lib/services/reviews.service'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  try {
    const reviews = await getReviewsForUser(supabase, userId)
    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
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
    if (!body.order_id || !body.rating) {
      return NextResponse.json(
        { error: 'order_id and rating are required' },
        { status: 400 },
      )
    }
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'rating must be between 1 and 5' },
        { status: 400 },
      )
    }
    const review = await createReview(supabase, user.id, body)
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create review'
    const status = message.includes('already reviewed') ? 409 : message.includes('Not authorized') ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
