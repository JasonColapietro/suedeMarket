import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile, Listing, Review } from '@/lib/types'

export async function getProfile(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(
  supabase: SupabaseClient,
  id: string,
  data: {
    display_name?: string
    bio?: string
    avatar_url?: string
    agent_description?: string
  },
) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return profile as Profile
}

export async function getProfileListings(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, category:categories!category_id(*)')
    .eq('seller_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Listing[]) ?? []
}

export async function getProfileReviews(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(*)')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Review[]) ?? []
}
