import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getConversations } from '@/lib/services/conversations.service'
import { ConversationList } from '@/components/messages/ConversationList'

export default async function MessagesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const conversations = await getConversations(supabase, user.id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <ConversationList
          conversations={conversations}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}
