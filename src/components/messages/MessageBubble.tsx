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
        <span className="rounded-full px-3 py-1 text-[12px] text-white/30">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/50">
        {message.sender?.display_name?.[0]?.toUpperCase() ?? '?'}
      </div>
      <div className={cn('flex max-w-[70%] flex-col', isOwn ? 'items-end' : 'items-start')}>
        {isOffer ? (
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
            <p className="text-[12px] font-medium tracking-[0.35em] uppercase text-accent/80">Offer</p>
            <p className="text-lg font-bold text-white">
              {message.offer_amount_cents != null
                ? formatCents(message.offer_amount_cents)
                : '—'}
            </p>
            {message.content && (
              <p className="mt-1 text-sm text-white/70">{message.content}</p>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'rounded-2xl px-4 py-2',
              isOwn
                ? 'bg-primary text-white'
                : 'bg-white/8 text-white/70',
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
        <span className="mt-1 text-[11px] text-white/20">
          {timeAgo(message.created_at)}
        </span>
      </div>
    </div>
  )
}
