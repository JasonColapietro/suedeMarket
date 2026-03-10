import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateApiKey,
  listApiKeys,
  revokeApiKey,
} from '@/lib/services/apikeys.service'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const keys = await listApiKeys(supabase, user.id)
    return NextResponse.json(keys)
  } catch {
    return NextResponse.json({ error: 'Failed to list keys' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const result = await generateApiKey(supabase, user.id, body.label)
    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to generate key' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await revokeApiKey(supabase, id, user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to revoke key' }, { status: 500 })
  }
}
