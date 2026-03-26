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
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#D4A042]/5 border border-[#D4A042]/10">
        <WarningCircle size={14} className="text-[#D4A042] shrink-0" />
        <span className="text-[11px] text-[#D4A042]">{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="ml-auto text-[#D4A042] hover:text-[#D4A042] cursor-pointer">
            <ArrowsClockwise size={12} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <WarningCircle size={32} className="text-[#D4A042]/50 mb-3" />
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
