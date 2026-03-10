import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/services/listings.service'

export async function GET() {
  const supabase = await createClient()
  try {
    const categories = await getCategories(supabase)
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
