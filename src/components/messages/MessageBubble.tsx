'use client'

import { cn } from '@/lib/utils'
import { formatCents, timeAgo } from '@/lib/utils'
import type { Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const isOffer = message.message_type === 'offer'
  const isSystem = message.message_type === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {message.sender?.display_name?.[0]?.toUpperCase() ?? '?'}
      </div>
      <div className={cn('flex max-w-[70%] flex-col', isOwn ? 'items-end' : 'items-start')}>
        {isOffer ? (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs font-medium text-primary">Offer</p>
            <p className="text-lg font-bold text-foreground">
              {message.offer_amount_cents != null
                ? formatCents(message.offer_amount_cents)
                : '—'}
            </p>
            {message.content && (
              <p className="mt-1 text-sm text-foreground">{message.content}</p>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'rounded-2xl px-4 py-2',
              isOwn
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground',
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
        <span className="mt-1 text-[10px] text-muted-foreground">
          {timeAgo(message.created_at)}
        </span>
      </div>
    </div>
  )
}
