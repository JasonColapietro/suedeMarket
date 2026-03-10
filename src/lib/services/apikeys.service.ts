import { randomBytes, createHash } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ApiKey } from '@/lib/types'

export async function generateApiKey(
  supabase: SupabaseClient,
  userId: string,
  label?: string,
) {
  const raw = `sk-sm_${randomBytes(32).toString('hex')}`
  const hash = createHash('sha256').update(raw).digest('hex')
  const prefix = raw.slice(0, 12)

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      key_hash: hash,
      key_prefix: prefix,
      label: label ?? null,
    })
    .select('id, user_id, key_prefix, label, is_active, last_used_at, created_at')
    .single()

  if (error) throw error
  return { ...(data as Omit<ApiKey, 'key_hash'>), raw_key: raw }
}

export async function listApiKeys(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, user_id, key_prefix, label, is_active, last_used_at, created_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Omit<ApiKey, 'key_hash'>[]) ?? []
}

export async function revokeApiKey(
  supabase: SupabaseClient,
  id: string,
  userId: string,
) {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

export async function deleteApiKey(
  supabase: SupabaseClient,
  id: string,
  userId: string,
) {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}
