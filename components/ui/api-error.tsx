'use client'

import { WarningCircle, ArrowsClockwise } from '@phosphor-icons/react'

interface Props {
  message: string
  onRetry?: () => void
  compact?: boolean
}

export function ApiError({ message, onRetry, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
        <WarningCircle size={14} className="text-amber-500 shrink-0" />
        <span className="text-[11px] text-amber-500">{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="ml-auto text-amber-500 hover:text-amber-400 cursor-pointer">
            <ArrowsClockwise size={12} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <WarningCircle size={32} className="text-amber-500/50 mb-3" />
      <p className="text-[13px] text-muted-foreground mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowsClockwise size={14} /> Retry
        </button>
      )}
    </div>
  )
}
