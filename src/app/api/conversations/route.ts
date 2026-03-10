import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  getConversations,
  getOrCreateConversation,
} from '@/lib/services/conversations.service'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const conversations = await getConversations(supabase, user.id)
    return NextResponse.json(conversations)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 },
    )
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
    const { listing_id } = await request.json()
    if (!listing_id) {
      return NextResponse.json(
        { error: 'listing_id is required' },
        { status: 400 },
      )
    }

    const conversation = await getOrCreateConversation(
      supabase,
      listing_id,
      user.id,
    )
    return NextResponse.json(conversation, { status: 201 })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to create conversation'
    const status = message.includes('your own listing') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
