import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProfile, updateProfile } from '@/lib/services/profiles.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const profile = await getProfile(supabase, id)
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const allowed = ['display_name', 'bio', 'avatar_url', 'agent_description'] as const
    const updates: Record<string, string> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    const profile = await updateProfile(supabase, id, updates)
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
