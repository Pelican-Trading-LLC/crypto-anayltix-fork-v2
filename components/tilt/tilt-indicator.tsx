'use client'

import { cn } from '@/lib/utils'

interface TiltIndicatorProps {
  isOnTilt: boolean
  alertCount: number
}

export function TiltIndicator({ isOnTilt, alertCount }: TiltIndicatorProps) {
  if (alertCount === 0) return null

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
      isOnTilt
        ? "bg-[var(--data-negative)]/15 text-[var(--data-negative)] animate-pulse"
        : "bg-[var(--data-warning)]/15 text-[var(--data-warning)]"
    )}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {isOnTilt ? 'On Tilt' : `${alertCount} warning${alertCount > 1 ? 's' : ''}`}
    </div>
  )
}
