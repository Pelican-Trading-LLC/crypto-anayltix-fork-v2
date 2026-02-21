"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTodaysWarnings } from "@/hooks/use-todays-warnings"
import { useBehavioralInsights } from "@/hooks/use-behavioral-insights"
import { useTrades } from "@/hooks/use-trades"
import {
  Warning,
  Fire,
  Briefcase,
  Brain,
  Newspaper,
  ChartLineUp,
} from "@phosphor-icons/react"

// Default prompts (fallback when no personalization data)
const DEFAULT_PROMPTS = [
  "What are the top gaining stocks today?",
  "Analyze AAPL's technical setup",
  "Why is the market down today?",
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
  const { openTrades } = useTrades()

  const chips = useMemo((): SuggestedChip[] => {
    const result: SuggestedChip[] = []

    // Warning-driven chips (highest priority)
    const firstWarning = warnings[0]
    if (firstWarning) {
      result.push({
        icon: Warning,
        label: firstWarning.title.length > 30 ? firstWarning.title.slice(0, 30) + '...' : firstWarning.title,
        prompt: `I have a trading warning: ${firstWarning.title}. ${firstWarning.message} What should I do?`,
        priority: 1,
        severity: firstWarning.severity,
      })
    }

    // Losing streak chip
    if (insights?.streaks?.current_streak_type === 'losing' && insights.streaks.current_streak_count >= 2) {
      result.push({
        icon: Fire,
        label: `${insights.streaks.current_streak_count}-trade losing streak`,
        prompt: `I'm on a ${insights.streaks.current_streak_count}-trade losing streak. Review my recent trades. Am I revenge trading or is this normal variance?`,
        priority: 1,
      })
    }

    // Open positions chip
    if (openTrades.length > 0) {
      result.push({
        icon: Briefcase,
        label: `Review ${openTrades.length} open position${openTrades.length > 1 ? 's' : ''}`,
        prompt: `Review all my open positions and tell me which ones to keep, trim, or exit. Be specific and honest.`,
        priority: 3,
      })
    }

    // Pattern analysis chip (if enough data)
    if (insights?.has_enough_data) {
      result.push({
        icon: Brain,
        label: 'Analyze my patterns',
        prompt: 'Give me a full analysis of my trading patterns. What are my strengths? Weaknesses? Where is my edge? Be brutally honest.',
        priority: 4,
      })
    }

    // Morning brief chip
    result.push({
      icon: Newspaper,
      label: 'Morning briefing',
      prompt: 'Give me a morning brief. What should I be watching today?',
      priority: 5,
    })

    // Market overview chip
    result.push({
      icon: ChartLineUp,
      label: 'Market overview',
      prompt: 'Quick market overview. How are indices, sectors, and key levels looking?',
      priority: 5,
    })

    // Sort by priority, take top 4
    return result.sort((a, b) => a.priority - b.priority).slice(0, 4)
  }, [warnings, insights, openTrades])

  // Fall back to defaults if no personalized chips
  const hasPersonalized = chips.some(c => c.priority < 5)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {hasPersonalized ? (
        chips.map((chip, index) => {
          const Icon = chip.icon
          return (
            <motion.button
              key={`${chip.label}-${index}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
              onClick={() => !disabled && onSelect(chip.prompt)}
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
        DEFAULT_PROMPTS.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
            onClick={() => !disabled && onSelect(prompt)}
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
