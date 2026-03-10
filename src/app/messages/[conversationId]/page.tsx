import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  getConversationById,
  getMessages,
} from '@/lib/services/conversations.service'
import { MessageThread } from '@/components/messages/MessageThread'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let conversation
  try {
    conversation = await getConversationById(supabase, conversationId, user.id)
  } catch {
    redirect('/messages')
  }

  const { messages } = await getMessages(supabase, conversationId)

  const otherParty =
    conversation.buyer_id === user.id
      ? conversation.seller
      : conversation.buyer
  const otherName = otherParty?.display_name ?? 'Unknown'
  const listing = conversation.listing

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link
          href="/messages"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {otherName}
          </p>
          {listing && (
            <Link
              href={`/listings/${listing.id}`}
              className="truncate text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {listing.title}
            </Link>
          )}
        </div>
      </div>

      {/* Thread + input */}
      <MessageThread
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={messages}
      />
    </div>
  )
}
