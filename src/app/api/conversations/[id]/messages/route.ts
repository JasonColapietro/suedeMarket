import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  getConversationById,
  getMessages,
  sendMessage,
} from '@/lib/services/conversations.service'

export async function GET(
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

  // Verify the user is a participant
  try {
    await getConversationById(supabase, id, user.id)
  } catch {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    )
  }

  const { searchParams } = new URL(request.url)
  const limit = searchParams.has('limit')
    ? Number(searchParams.get('limit'))
    : 50
  const offset = searchParams.has('offset')
    ? Number(searchParams.get('offset'))
    : 0

  try {
    const result = await getMessages(supabase, id, limit, offset)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    )
  }
}

export async function POST(
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

  // Verify the user is a participant
  try {
    await getConversationById(supabase, id, user.id)
  } catch {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    )
  }

  try {
    const { content, message_type, offer_amount_cents } = await request.json()
    if (!content) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 },
      )
    }

    const message = await sendMessage(supabase, id, user.id, {
      content,
      message_type,
      offer_amount_cents,
    })
    return NextResponse.json(message, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }
}
