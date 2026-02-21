"use client"

import { PelicanCard } from "@/components/ui/pelican"
import { cn } from "@/lib/utils"
import { CalendarCheck } from "@phosphor-icons/react"
import type { CalendarInsight } from "@/hooks/use-behavioral-insights"

interface CalendarCardProps {
  data: CalendarInsight
}

function StatRow({
  label,
  winRate,
  trades,
  pnl,
}: {
  label: string
  winRate: number
  trades: number
  pnl?: number
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-3 text-sm">
        <span
          className={cn(
            "font-mono tabular-nums",
            winRate > 50
              ? "text-[var(--data-positive)]"
              : winRate >= 40
                ? "text-[var(--text-secondary)]"
                : "text-[var(--data-negative)]",
          )}
        >
          {winRate.toFixed(1)}%
        </span>
        <span className="text-[var(--text-muted)] font-mono tabular-nums text-xs">
          {trades} trades
        </span>
        {pnl !== undefined && (
          <span
            className={cn(
              "font-mono tabular-nums text-xs",
              pnl >= 0 ? "text-[var(--data-positive)]" : "text-[var(--data-negative)]",
            )}
          >
            {pnl >= 0 ? "+" : ""}${pnl.toFixed(0)}
          </span>
        )}
      </div>
    </div>
  )
}

export function CalendarCard({ data }: CalendarCardProps) {
  return (
    <PelicanCard className="p-5" noPadding>
      <div className="flex items-center gap-2 mb-4">
        <CalendarCheck size={18} weight="regular" className="text-[var(--text-muted)]" />
        <h3 className="text-sm font-medium text-[var(--text-primary)]">Calendar Patterns</h3>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {data.opex_fridays.total_trades > 0 && (
          <StatRow
            label="OPEX Fridays"
            winRate={data.opex_fridays.win_rate}
            trades={data.opex_fridays.total_trades}
            pnl={data.opex_fridays.total_pnl}
          />
        )}
        {data.mondays.total_trades > 0 && (
          <StatRow
            label="Mondays"
            winRate={data.mondays.win_rate}
            trades={data.mondays.total_trades}
            pnl={data.mondays.total_pnl}
          />
        )}
        {data.fridays.total_trades > 0 && (
          <StatRow
            label="Fridays"
            winRate={data.fridays.win_rate}
            trades={data.fridays.total_trades}
            pnl={data.fridays.total_pnl}
          />
        )}
        {data.first_trade_of_day.total_trades > 0 && (
          <StatRow
            label="First Trade of Day"
            winRate={data.first_trade_of_day.win_rate}
            trades={data.first_trade_of_day.total_trades}
          />
        )}
      </div>

      {data.opex_fridays.total_trades === 0 &&
        data.mondays.total_trades === 0 &&
        data.fridays.total_trades === 0 &&
        data.first_trade_of_day.total_trades === 0 && (
          <p className="text-center text-sm text-[var(--text-muted)] py-4">
            Not enough calendar data yet
          </p>
        )}
    </PelicanCard>
  )
}
