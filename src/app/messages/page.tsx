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
    <div className="min-h-screen bg-[#0f0f14] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-normal text-white">
          Your <span className="font-serif italic">Messages</span>
        </h1>
        <div className="overflow-hidden rounded-sm border border-white/10 bg-[#1a1a22]">
          <ConversationList
            conversations={conversations}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  )
}
