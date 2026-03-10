import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  getListingById,
  updateListing,
  deleteListing,
} from '@/lib/services/listings.service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()

  try {
    const listing = await getListingById(supabase, id)
    return NextResponse.json(listing)
  } catch {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
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
    const listing = await updateListing(supabase, id, user.id, body)
    return NextResponse.json(listing)
  } catch {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(
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
    await deleteListing(supabase, id, user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}
