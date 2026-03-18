"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTodaysWarnings } from "@/hooks/use-todays-warnings"
import { useBehavioralInsights } from "@/hooks/use-behavioral-insights"
import { useTrades } from "@/hooks/use-trades"
import { useTraderProfile } from "@/hooks/use-trader-profile"
import { useTradePatterns } from "@/hooks/use-trade-patterns"
import { trackEvent } from "@/lib/tracking"
import {
  Warning,
  Fire,
  Briefcase,
  Brain,
  Newspaper,
  ChartLineUp,
  TrendDown,
  Lightning,
} from "@phosphor-icons/react"

// Market-specific default prompts (fallback when no personalization data)
const MARKET_DEFAULT_PROMPTS: Record<string, string[]> = {
  crypto: [
    "Crypto market pulse — BTC dominance and major moves",
    "Scan the top altcoins for momentum setups",
    "What's driving crypto sentiment right now?",
  ],
}

// Keep a flat export for backward compatibility
const DEFAULT_PROMPTS = [
  "Crypto market pulse — BTC dominance and major moves",
  "Explain funding rates like I trade ES futures",
  "What's the current derivatives setup on BTC?",
]

interface SuggestedChip {
  icon: React.ElementType
  label: string
  prompt: string
  priority: number
  severity?: 'warning' | 'critical'
}

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  const { warnings } = useTodaysWarnings()
  const { data: insights } = useBehavioralInsights()
  const { openTrades, closedTrades } = useTrades()
  const { survey } = useTraderProfile()
  const { patterns: activePatterns } = useTradePatterns()
  const primaryMarket = survey?.markets_traded?.[0] || 'crypto'

  const chips = useMemo((): SuggestedChip[] => {
    const result: SuggestedChip[] = []

    // Priority 0: Critical behavioral warnings (up to 2)
    warnings.slice(0, 2).forEach(w => {
      result.push({
        icon: Warning,
        label: w.title.length > 30 ? w.title.slice(0, 30) + '...' : w.title,
        prompt: `I have a trading warning: ${w.title}. ${w.message} What should I do today?`,
        priority: 0,
        severity: w.severity,
      })
    })

    // Priority 1: Critical detected patterns (not already surfaced as warnings)
    if (activePatterns.length > 0) {
      const warningTitles = new Set(warnings.map(w => w.title))
      const criticalPatterns = activePatterns.filter(
        p => p.severity === 'critical' && !warningTitles.has(p.title)
      )
      criticalPatterns.slice(0, 1).forEach(p => {
        result.push({
          icon: Warning,
          label: p.title.length > 30 ? p.title.slice(0, 30) + '...' : p.title,
          prompt: `Pelican, I have a detected pattern: "${p.title}" — ${p.description}. Analyze this and tell me what to change.`,
          priority: 1,
          severity: 'critical',
        })
      })
    }

    // Priority 1: Losing streak
    if (insights?.streaks?.current_streak_type === 'losing' && insights.streaks.current_streak_count >= 2) {
      result.push({
        icon: Fire,
        label: `${insights.streaks.current_streak_count}-trade losing streak`,
        prompt: `I'm on a ${insights.streaks.current_streak_count}-trade losing streak. Review my recent trades. Am I revenge trading or is this normal variance?`,
        priority: 1,
        severity: 'critical',
      })
    }

    // Priority 2: Worst-performing open position
    if (openTrades.length > 0) {
      const worst = openTrades.reduce((w, t) =>
        (t.pnl_percent ?? 0) < (w.pnl_percent ?? 0) ? t : w, openTrades[0]!)
      if (worst.pnl_percent != null && worst.pnl_percent < -5) {
        result.push({
          icon: TrendDown,
          label: `${worst.ticker} down ${Math.abs(worst.pnl_percent).toFixed(1)}%`,
          prompt: `My ${worst.ticker} ${worst.direction} position from $${worst.entry_price} is down ${Math.abs(worst.pnl_percent).toFixed(1)}%. Should I cut it or hold? What's the technical picture?`,
          priority: 2,
          severity: 'warning',
        })
      }
    }

    // Priority 3: Open positions review
    if (openTrades.length > 0) {
      result.push({
        icon: Briefcase,
        label: `Review ${openTrades.length} open position${openTrades.length > 1 ? 's' : ''}`,
        prompt: `Review all my open positions and tell me which ones to keep, trim, or exit. Be specific and honest.\n\n${openTrades.map(t => `${t.ticker} ${t.direction} @ $${t.entry_price}`).join('\n')}`,
        priority: 3,
      })
    }

    // Priority 4: Pattern analysis (established users with enough data)
    if (insights?.has_enough_data) {
      result.push({
        icon: Brain,
        label: 'Analyze my patterns',
        prompt: 'Give me a full analysis of my trading patterns. What are my strengths? Weaknesses? Where is my edge? Be brutally honest.',
        priority: 4,
      })
    }

    // Priority 4: Early user motivation (1-4 closed trades)
    const closedCount = closedTrades.length
    if (closedCount > 0 && closedCount < 5) {
      result.push({
        icon: Lightning,
        label: `${5 - closedCount} trade${5 - closedCount > 1 ? 's' : ''} until insights`,
        prompt: `I've logged ${closedCount} trade${closedCount > 1 ? 's' : ''}. What behavioral insights will you find once I hit 5? What should I focus on tracking?`,
        priority: 4,
      })
    }

    // Priority 5: Morning brief
    const briefPrompt = openTrades.length > 0
      ? `Crypto morning brief focused on my positions: ${openTrades.map(t => t.ticker).join(', ')}. Key levels, on-chain activity, and what to watch today.`
      : 'Crypto market brief. BTC action, ETH/BTC ratio, altcoin moves, and funding rates.'

    result.push({
      icon: Newspaper,
      label: 'Morning briefing',
      prompt: briefPrompt,
      priority: 5,
    })

    // Priority 5: Market overview
    const overview = {
      label: 'Market pulse',
      prompt: 'Crypto market pulse. BTC dominance, major moves, and sentiment overview.',
    }
    result.push({
      icon: ChartLineUp,
      label: overview.label,
      prompt: overview.prompt,
      priority: 5,
    })

    // Sort by priority, take top 6
    return result.sort((a, b) => a.priority - b.priority).slice(0, 6)
  }, [warnings, insights, openTrades, closedTrades, primaryMarket, activePatterns])

  // Fall back to defaults if no personalized chips
  const hasPersonalized = chips.some(c => c.priority < 5)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto">
      {hasPersonalized ? (
        chips.map((chip, index) => {
          const Icon = chip.icon
          return (
            <motion.button
              key={`${chip.label}-${index}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
              onClick={() => {
                if (disabled) return
                trackEvent({ eventType: 'suggested_prompt_clicked', feature: 'chat', data: { prompt: chip.label } })
                onSelect(chip.prompt)
              }}
              whileHover={disabled ? undefined : { scale: 1.02 }}
              disabled={disabled}
              className={cn(
                "px-4 py-3 rounded-xl text-sm border bg-[var(--bg-surface)] transition-all duration-150 flex items-center gap-2",
                disabled
                  ? "border-[var(--border-subtle)] text-[var(--text-disabled)] cursor-not-allowed"
                  : chip.severity === 'critical'
                    ? "border-[var(--data-negative)]/30 text-[var(--data-negative)] hover:bg-[var(--data-negative)]/5 cursor-pointer"
                    : chip.severity === 'warning'
                      ? "border-[var(--data-warning)]/30 text-[var(--data-warning)] hover:bg-[var(--data-warning)]/5 cursor-pointer"
                      : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/20 hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] cursor-pointer"
              )}
            >
              <Icon size={16} weight="regular" />
              {chip.label}
            </motion.button>
          )
        })
      ) : (
        (MARKET_DEFAULT_PROMPTS[primaryMarket] || MARKET_DEFAULT_PROMPTS.crypto!).map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
            onClick={() => {
              if (disabled) return
              trackEvent({ eventType: 'suggested_prompt_clicked', feature: 'chat', data: { prompt } })
              onSelect(prompt)
            }}
            whileHover={disabled ? undefined : { scale: 1.02 }}
            disabled={disabled}
            className={cn(
              "px-5 py-3 rounded-full text-[15px] border bg-card transition-all duration-150",
              disabled
                ? "border-border/30 text-muted-foreground/50 cursor-not-allowed"
                : "border-border text-foreground/70 hover:border-primary/20 hover:text-foreground hover:bg-accent cursor-pointer"
            )}
          >
            {prompt}
          </motion.button>
        ))
      )}
    </div>
  )
}

export { DEFAULT_PROMPTS as SUGGESTED_PROMPTS }
