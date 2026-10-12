import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/services/listings.service'
import { catalogUnavailable } from '@/lib/catalog-errors'

export async function GET() {
  try {
    const supabase = await createClient()
    const categories = await getCategories(supabase)
    return NextResponse.json(categories)
  } catch (error) {
    return catalogUnavailable('categories', error)
  }
}
