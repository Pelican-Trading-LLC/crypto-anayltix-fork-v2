'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Warning, ShieldWarning, X, ChatTeardropText } from '@phosphor-icons/react'
import { PelicanCard, PelicanButton } from '@/components/ui/pelican'
import { cn } from '@/lib/utils'
import type { TargetAndTransition } from 'framer-motion'

const hoverLift: TargetAndTransition = {
  y: -1,
  boxShadow: '0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.15)',
  borderColor: 'rgba(255,255,255,0.15)',
  transition: { duration: 0.15, ease: 'easeOut' as const },
}

// ============================================================================
// Types
// ============================================================================

interface InsightCardProps {
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  type: string
  metrics?: Record<string, string | number | boolean | null>
  onDismiss?: () => void
  onAskPelican?: () => void
  compact?: boolean
}

// ============================================================================
// Config
// ============================================================================

const severityConfig = {
  info: {
    borderColor: 'var(--accent-primary)',
    bgTint: 'rgba(139,92,246,0.05)',
    icon: Lightbulb,
    dotColor: 'bg-[var(--accent-primary)]',
  },
  warning: {
    borderColor: 'var(--data-warning)',
    bgTint: 'rgba(245,158,11,0.05)',
    icon: Warning,
    dotColor: 'bg-[var(--data-warning)]',
  },
  critical: {
    borderColor: 'var(--data-negative)',
    bgTint: 'rgba(239,68,68,0.05)',
    icon: ShieldWarning,
    dotColor: 'bg-[var(--data-negative)]',
  },
} as const

// ============================================================================
// Component
// ============================================================================

export function InsightCard({
  title,
  description,
  severity,
  type,
  metrics,
  onDismiss,
  onAskPelican,
  compact = false,
}: InsightCardProps) {
  const config = severityConfig[severity]
  const Icon = config.icon

  if (compact) {
    return (
      <motion.div
        whileHover={hoverLift}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'border border-[var(--border-subtle)]',
          'transition-colors duration-150',
        )}
        style={{ backgroundColor: config.bgTint, borderLeftColor: config.borderColor, borderLeftWidth: 2 }}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dotColor)} />
        <span className="text-xs font-medium text-[var(--text-primary)] truncate">{title}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hoverLift}
    >
      <PelicanCard
        className="relative overflow-hidden"
        style={{
          borderLeftWidth: 3,
          borderLeftColor: config.borderColor,
          backgroundColor: config.bgTint,
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <Icon
            size={18}
            weight="regular"
            className="shrink-0 mt-0.5"
            style={{ color: config.borderColor }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              {description}
            </p>
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors duration-150"
              aria-label="Dismiss insight"
            >
              <X size={14} weight="regular" />
            </button>
          )}
        </div>

        {/* Metrics */}
        {metrics && Object.keys(metrics).length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[var(--border-subtle)]">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-[var(--text-muted)]">{key}: </span>
                <span className="font-mono tabular-nums text-[var(--text-primary)]">
                  {typeof value === 'number' ? value.toFixed(1) : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {onAskPelican && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <PelicanButton variant="ghost" size="sm" onClick={onAskPelican}>
              <ChatTeardropText size={14} weight="regular" />
              Ask Pelican
            </PelicanButton>
          </div>
        )}
      </PelicanCard>
    </motion.div>
  )
}
