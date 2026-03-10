'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-white/10 bg-[#1a1a22] p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        disabled={disabled}
        className={cn(
          'flex-1 resize-none rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white',
          'placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:opacity-50',
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={cn(
          'rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white',
          'hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
        )}
      >
        Send
      </button>
    </form>
  )
}
