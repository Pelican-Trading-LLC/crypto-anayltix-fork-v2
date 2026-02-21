'use client'

import { useMemo } from 'react'
import {
  ShieldWarning,
  Warning,
  ShieldSlash,
  Target,
  Flame,
  Crosshair,
  Scales,
  CheckCircle,
} from '@phosphor-icons/react'
import type { IconProps } from '@phosphor-icons/react'
import type { PortfolioPosition } from '@/types/portfolio'
import type { BehavioralInsights } from '@/hooks/use-behavioral-insights'
import type { TodayWarning } from '@/hooks/use-todays-warnings'

// ============================================================================
// Types
// ============================================================================

interface TodaysActionsProps {
  positions: PortfolioPosition[]
  insights: BehavioralInsights | null
  warnings: TodayWarning[]
  onAction: (chatPrompt: string) => void
  onEditPosition: (position: PortfolioPosition) => void
}

interface Action {
  priority: number
  icon: React.ComponentType<IconProps>
  iconColor: string
  label: string
  detail: string
  actionLabel: string
  actionType: 'chat' | 'edit'
  chatPrompt?: string
  position?: PortfolioPosition
}

// ============================================================================
// Helpers
// ============================================================================

function formatNum(n: number | null | undefined): string {
  if (n == null) return '?'
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toLocaleString()}`
}

function buildScanPrompt(p: PortfolioPosition): string {
  return [
    `Scan my ${p.ticker} ${p.direction.toUpperCase()} position.`,
    `Entry: $${p.entry_price}. Size: ${formatNum(p.position_size_usd)}.`,
    p.stop_loss ? `Stop: $${p.stop_loss} (${p.distance_to_stop_pct}% away).` : 'No stop loss set.',
    p.take_profit ? `Target: $${p.take_profit} (${p.distance_to_target_pct}% away).` : 'No target set.',
    p.thesis ? `Thesis: "${p.thesis}".` : '',
    `Conviction: ${p.conviction || '?'}/10. Held for ${p.days_held} days.`,
    'Give me: current technicals, whether my thesis holds, key levels, and your recommendation — hold, add, trim, or exit.',
  ].filter(Boolean).join(' ')
}

// ============================================================================
// Component
// ============================================================================

export function TodaysActions({ positions, insights, warnings, onAction, onEditPosition }: TodaysActionsProps) {
  const avgSize = useMemo(() => {
    if (positions.length === 0) return 0
    return positions.reduce((s, p) => s + p.position_size_usd, 0) / positions.length
  }, [positions])

  const actions = useMemo(() => {
    const list: Action[] = []

    // Priority 0 — Critical behavioral warnings
    for (const w of warnings) {
      if (w.severity === 'critical') {
        list.push({
          priority: 0, icon: ShieldWarning, iconColor: 'text-red-400',
          label: w.title, detail: w.message,
          actionLabel: w.action + ' \u2192', actionType: 'chat',
          chatPrompt: `I have a critical warning: "${w.title}" — ${w.message}. What should I do?`,
        })
      }
    }

    for (const p of positions) {
      // Priority 1 — Tight stop
      if (p.has_stop_loss && p.distance_to_stop_pct != null && p.distance_to_stop_pct < 2) {
        list.push({
          priority: 1, icon: Warning, iconColor: 'text-amber-400',
          label: `${p.ticker} stop is ${p.distance_to_stop_pct.toFixed(1)}% away`,
          detail: `Tight stop at $${p.stop_loss}. Decide: widen, hold, or exit.`,
          actionLabel: 'Plan \u2192', actionType: 'chat', chatPrompt: buildScanPrompt(p),
        })
      }

      // Priority 1 — No stop loss
      if (!p.has_stop_loss) {
        list.push({
          priority: 1, icon: ShieldSlash, iconColor: 'text-red-400',
          label: `${p.ticker} has no stop loss`,
          detail: `${formatNum(p.position_size_usd)} at risk with no defined exit.`,
          actionLabel: 'Set stop \u2192', actionType: 'edit', position: p,
        })
      }

      // Priority 2 — Approaching target
      if (p.has_take_profit && p.distance_to_target_pct != null && p.distance_to_target_pct < 5) {
        list.push({
          priority: 2, icon: Target, iconColor: 'text-emerald-400',
          label: `${p.ticker} approaching target ($${p.take_profit})`,
          detail: `${p.distance_to_target_pct.toFixed(1)}% away. Plan your exit strategy.`,
          actionLabel: 'Plan exit \u2192', actionType: 'chat', chatPrompt: buildScanPrompt(p),
        })
      }

      // Priority 3 — Never scanned, held 7+ days
      if (p.days_held >= 7 && p.pelican_scan_count === 0) {
        list.push({
          priority: 3, icon: Crosshair, iconColor: 'text-[var(--accent-primary)]',
          label: `Review ${p.ticker} \u2014 held ${p.days_held} days, never scanned`,
          detail: "Get Pelican's assessment to validate thesis.",
          actionLabel: 'Scan \u2192', actionType: 'chat', chatPrompt: buildScanPrompt(p),
        })
      }

      // Priority 4 — Oversized
      if (avgSize > 0 && p.position_size_usd > avgSize * 2.5) {
        list.push({
          priority: 4, icon: Scales, iconColor: 'text-amber-400',
          label: `${p.ticker} is ${(p.position_size_usd / avgSize).toFixed(1)}x avg size`,
          detail: `${formatNum(p.position_size_usd)} vs avg ${formatNum(avgSize)}. Consider trimming.`,
          actionLabel: 'Review \u2192', actionType: 'chat', chatPrompt: buildScanPrompt(p),
        })
      }
    }

    // Priority 3 — Losing streak
    if (insights?.streaks?.current_streak_type === 'losing' && insights.streaks.current_streak_count >= 2) {
      list.push({
        priority: 3, icon: Flame, iconColor: 'text-red-400',
        label: `${insights.streaks.current_streak_count}-trade losing streak active`,
        detail: 'Consider reducing sizes until streak breaks.',
        actionLabel: 'Review \u2192', actionType: 'chat',
        chatPrompt: `I'm on a ${insights.streaks.current_streak_count}-trade losing streak. Analyze my recent trades and suggest adjustments.`,
      })
    }

    list.sort((a, b) => a.priority - b.priority)
    return list.slice(0, 5)
  }, [positions, insights, warnings, avgSize])

  // ── Empty / all-clear state ──────────────────────────────────────────────
  if (actions.length === 0) {
    const stopsSet = positions.every((p) => p.has_stop_loss)
    return (
      <div className="rounded-xl border bg-emerald-500/5 border-emerald-500/20 overflow-hidden">
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] uppercase tracking-widest font-medium text-[var(--text-muted)]">
            Today&apos;s Actions
          </span>
        </div>
        <div className="px-4 pb-3 flex items-center gap-2">
          <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              All clear &mdash; no actions needed right now.
            </p>
            <p className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
              {positions.length} position{positions.length !== 1 ? 's' : ''} healthy
              {stopsSet ? ' \u00b7 All stops set' : ''}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Actions list ─────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <span className="text-[10px] uppercase tracking-widest font-medium text-[var(--text-muted)]">
          Today&apos;s Actions
        </span>
      </div>
      {actions.map((a, i) => {
        const Icon = a.icon
        return (
          <div
            key={i}
            className={`px-4 py-3 flex items-start gap-3${i > 0 ? ' border-t border-[var(--border-subtle)]' : ''}`}
          >
            <Icon size={18} weight="bold" className={`${a.iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">{a.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{a.detail}</p>
            </div>
            <button
              onClick={() => a.actionType === 'chat' && a.chatPrompt ? onAction(a.chatPrompt) : a.position ? onEditPosition(a.position) : undefined}
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-medium whitespace-nowrap transition-colors mt-0.5"
            >
              {a.actionLabel}
            </button>
          </div>
        )
      })}
    </div>
  )
}
