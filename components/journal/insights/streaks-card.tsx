"use client"

import { PelicanCard } from "@/components/ui/pelican"
import { cn } from "@/lib/utils"
import { TrendUp, TrendDown, Fire } from "@phosphor-icons/react"
import type { StreakInsight } from "@/hooks/use-behavioral-insights"

interface StreaksCardProps {
  data: StreakInsight
}

export function StreaksCard({ data }: StreaksCardProps) {
  const isWinning = data.current_streak_type === "winning"
  const isLosing = data.current_streak_type === "losing"

  return (
    <PelicanCard className="p-5" noPadding>
      <div className="flex items-center gap-2 mb-4">
        <Fire size={18} weight="regular" className="text-[var(--text-muted)]" />
        <h3 className="text-sm font-medium text-[var(--text-primary)]">Streaks</h3>
      </div>

      {/* Current streak */}
      <div className="mb-4 p-3 rounded-lg bg-[var(--bg-elevated)]">
        <div className="text-xs text-[var(--text-muted)] mb-1">Current Streak</div>
        <div className="flex items-center gap-2">
          {isWinning && <TrendUp size={20} weight="bold" className="text-[var(--data-positive)]" />}
          {isLosing && <TrendDown size={20} weight="bold" className="text-[var(--data-negative)]" />}
          <span
            className={cn(
              "text-xl font-mono tabular-nums font-semibold",
              isWinning && "text-[var(--data-positive)]",
              isLosing && "text-[var(--data-negative)]",
              !isWinning && !isLosing && "text-[var(--text-secondary)]",
            )}
          >
            {data.current_streak_count}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            {isWinning ? "wins" : isLosing ? "losses" : "no active streak"}
          </span>
        </div>
      </div>

      {/* Best / Worst */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-1">Best Win Streak</div>
          <span className="text-lg font-mono tabular-nums font-semibold text-[var(--data-positive)]">
            {data.max_win_streak}
          </span>
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-1">Worst Loss Streak</div>
          <span className="text-lg font-mono tabular-nums font-semibold text-[var(--data-negative)]">
            {data.max_loss_streak}
          </span>
        </div>
      </div>

      {/* After consecutive losses */}
      <div className="space-y-2">
        {data.after_2_consecutive_losses.total_trades > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">After 2 losses</span>
            <span
              className={cn(
                "font-mono tabular-nums",
                data.after_2_consecutive_losses.win_rate >= 50
                  ? "text-[var(--data-positive)]"
                  : "text-[var(--data-negative)]",
              )}
            >
              {data.after_2_consecutive_losses.win_rate.toFixed(1)}% WR
              <span className="text-[var(--text-muted)] ml-1">
                ({data.after_2_consecutive_losses.total_trades} trades)
              </span>
            </span>
          </div>
        )}
        {data.after_3_consecutive_losses.total_trades > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">After 3 losses</span>
            <span
              className={cn(
                "font-mono tabular-nums",
                data.after_3_consecutive_losses.win_rate >= 50
                  ? "text-[var(--data-positive)]"
                  : "text-[var(--data-negative)]",
              )}
            >
              {data.after_3_consecutive_losses.win_rate.toFixed(1)}% WR
              <span className="text-[var(--text-muted)] ml-1">
                ({data.after_3_consecutive_losses.total_trades} trades)
              </span>
            </span>
          </div>
        )}
      </div>
    </PelicanCard>
  )
}
