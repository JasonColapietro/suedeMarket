'use client'

import { ConversationItem } from './ConversationItem'
import type { Conversation } from '@/lib/types'

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
  activeId?: string
}

export function ConversationList({
  conversations,
  currentUserId,
  activeId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Start a conversation from a listing page
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          currentUserId={currentUserId}
          active={conv.id === activeId}
        />
      ))}
    </div>
  )
}
