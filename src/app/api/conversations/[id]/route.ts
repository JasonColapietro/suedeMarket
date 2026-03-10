import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getConversationById } from '@/lib/services/conversations.service'

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
    const conversation = await getConversationById(supabase, id, user.id)
    return NextResponse.json(conversation)
  } catch {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    )
  }
}
