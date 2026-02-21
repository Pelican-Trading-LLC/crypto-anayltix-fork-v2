'use client'

import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface PatternBadgeProps {
  text: string
  severity: 'info' | 'warning' | 'critical'
  tooltip?: string
}

// ============================================================================
// Config
// ============================================================================

const severityStyles = {
  info: 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]',
  warning: 'bg-[var(--data-warning)]/15 text-[var(--data-warning)]',
  critical: 'bg-[var(--data-negative)]/15 text-[var(--data-negative)]',
} as const

// ============================================================================
// Component
// ============================================================================

export function PatternBadge({ text, severity, tooltip }: PatternBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-1.5 py-0.5',
        'text-[10px] font-mono font-medium tabular-nums',
        'leading-none whitespace-nowrap',
        severityStyles[severity],
      )}
      title={tooltip}
    >
      {text}
    </span>
  )
}
