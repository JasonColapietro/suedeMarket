'use client'

import Link from 'next/link'
import { cn, timeAgo } from '@/lib/utils'
import type { Conversation } from '@/lib/types'

interface ConversationItemProps {
  conversation: Conversation
  currentUserId: string
  active?: boolean
}

export function ConversationItem({
  conversation,
  currentUserId,
  active,
}: ConversationItemProps) {
  const otherParty =
    conversation.buyer_id === currentUserId
      ? conversation.seller
      : conversation.buyer
  const otherName = otherParty?.display_name ?? 'Unknown'
  const listingTitle = conversation.listing?.title ?? 'Untitled listing'
  const listingImage = (conversation.listing as { images?: string[] })?.images?.[0]
  const lastMsg = conversation.last_message

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={cn(
        'flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/50',
        active && 'bg-accent/50',
      )}
    >
      {/* Avatar / listing thumbnail */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
        {listingImage ? (
          <img
            src={listingImage}
            alt={listingTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
            {otherName[0]?.toUpperCase() ?? '?'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium text-foreground">
            {otherName}
          </span>
          {lastMsg && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {timeAgo(lastMsg.created_at)}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{listingTitle}</p>
        {lastMsg && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {lastMsg.message_type === 'offer'
              ? 'Sent an offer'
              : lastMsg.content}
          </p>
        )}
      </div>
    </Link>
  )
}
