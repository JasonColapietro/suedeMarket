import { createHash } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export async function resolveApiKey(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer sk-sm_')) return null

  const key = authHeader.slice(7) // Remove 'Bearer '
  const hash = createHash('sha256').update(key).digest('hex')

  const admin = createAdminClient()
  const { data } = await admin
    .from('api_keys')
    .select('user_id')
    .eq('key_hash', hash)
    .eq('is_active', true)
    .single()

  if (!data) return null

  // Update last_used_at
  await admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', hash)

  return data.user_id as string
}
