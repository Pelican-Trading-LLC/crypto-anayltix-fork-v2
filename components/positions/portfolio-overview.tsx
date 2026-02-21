'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendUp,
  TrendDown,
  Scales,
  ShieldCheck,
  Warning,
  CheckCircle,
  ArrowRight,
  ChartPie,
} from '@phosphor-icons/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PelicanCard, staggerContainer, staggerItem } from '@/components/ui/pelican'
import { formatCompactDollar } from '@/lib/positions/dashboard-utils'
import type {
  PortfolioStats,
  RiskSummary,
  PlanCompliance,
  AssetBreakdown,
} from '@/types/portfolio'

interface PortfolioOverviewProps {
  portfolio: PortfolioStats
  risk: RiskSummary
  planCompliance: PlanCompliance
  isLoading: boolean
}

// ── Color map for asset types ──────────────────────────────────────────
const ASSET_COLORS: Record<string, string> = {
  stock: 'var(--accent-primary)',
  crypto: 'var(--data-warning)',
  forex: 'var(--data-positive)',
  option: '#3b82f6',
  etf: '#14b8a6',
  future: '#8b5cf6',
  other: '#6b7280',
}

function getAssetColor(type: string): string {
  return ASSET_COLORS[type.toLowerCase()] ?? '#6b7280'
}

// ── Skeleton Loader ────────────────────────────────────────────────────
function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <PelicanCard className={className}>
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 rounded bg-[var(--bg-elevated)] animate-pulse" />
        <div className="h-6 w-20 rounded bg-[var(--bg-elevated)] animate-pulse" />
        <div className="h-3 w-16 rounded bg-[var(--bg-elevated)] animate-pulse" />
      </div>
    </PelicanCard>
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <PelicanCard className={className}>
      <div className="p-5 space-y-4">
        <div className="h-4 w-32 rounded bg-[var(--bg-elevated)] animate-pulse" />
        <div className="h-32 w-full rounded bg-[var(--bg-elevated)] animate-pulse" />
        <div className="h-3 w-48 rounded bg-[var(--bg-elevated)] animate-pulse" />
      </div>
    </PelicanCard>
  )
}

// ── Custom Tooltip for Pie Chart ───────────────────────────────────────
function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: AssetBreakdown & { fill: string } }>
}) {
  if (!active || !payload?.length) return null
  const first = payload[0]
  if (!first) return null
  const d = first.payload
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[var(--text-primary)] capitalize">
        {d.asset_type}
      </p>
      <p className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
        {formatCompactDollar(d.total_exposure)} ({d.pct_of_portfolio.toFixed(1)}%)
      </p>
      <p className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
        {d.count} position{d.count !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────
export function PortfolioOverview({
  portfolio,
  risk,
  planCompliance,
  isLoading,
}: PortfolioOverviewProps) {
  // ── Loading State ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <SkeletonCard />
      </div>
    )
  }

  // ── Metric Cards Data ──────────────────────────────────────────────
  const rrDisplay =
    risk.portfolio_rr_ratio !== null
      ? `${risk.portfolio_rr_ratio.toFixed(2)}:1`
      : '\u2014'

  const metricCards = [
    {
      label: 'Total Exposure',
      value: formatCompactDollar(portfolio.total_exposure),
      color: 'var(--text-primary)',
      sub: `${portfolio.total_positions} position${portfolio.total_positions !== 1 ? 's' : ''}`,
      icon: Wallet,
    },
    {
      label: 'Long',
      value: formatCompactDollar(portfolio.long_exposure),
      color: 'var(--data-positive)',
      sub: `${portfolio.direction_breakdown.long.count} position${portfolio.direction_breakdown.long.count !== 1 ? 's' : ''}`,
      icon: TrendUp,
    },
    {
      label: 'Short',
      value: formatCompactDollar(portfolio.short_exposure),
      color: 'var(--data-negative)',
      sub: `${portfolio.direction_breakdown.short.count} position${portfolio.direction_breakdown.short.count !== 1 ? 's' : ''}`,
      icon: TrendDown,
    },
    {
      label: 'Net Exposure',
      value: formatCompactDollar(portfolio.net_exposure),
      color:
        portfolio.net_exposure > 0
          ? 'var(--data-positive)'
          : portfolio.net_exposure < 0
            ? 'var(--data-negative)'
            : 'var(--text-primary)',
      sub: portfolio.net_exposure > 0 ? 'Net long' : portfolio.net_exposure < 0 ? 'Net short' : 'Neutral',
      icon: Scales,
    },
    {
      label: 'R:R Ratio',
      value: rrDisplay,
      color: 'var(--text-primary)',
      sub: risk.portfolio_rr_ratio !== null ? 'Risk to reward' : 'No risk defined',
      icon: ShieldCheck,
    },
  ]

  // ── Donut Data ─────────────────────────────────────────────────────
  const donutData = portfolio.asset_breakdown.map((ab) => ({
    ...ab,
    fill: getAssetColor(ab.asset_type),
  }))

  // ── Risk Budget Calculations ───────────────────────────────────────
  const totalPositions = risk.positions_with_defined_risk + risk.positions_without_risk
  const riskDefinedPct =
    totalPositions > 0
      ? Math.round((risk.positions_with_defined_risk / totalPositions) * 100)
      : 0
  const riskBarColor =
    riskDefinedPct > 80
      ? 'var(--data-positive)'
      : riskDefinedPct >= 50
        ? 'var(--data-warning)'
        : 'var(--data-negative)'

  // ── Plan Compliance ────────────────────────────────────────────────
  const violations: string[] = []
  if (planCompliance.has_active_plan) {
    if (planCompliance.over_position_limit) {
      violations.push(
        `Over position limit: ${planCompliance.current_open_positions}/${planCompliance.max_open_positions}`
      )
    }
    if (planCompliance.require_stop_loss && planCompliance.positions_missing_stop > 0) {
      violations.push(
        `${planCompliance.positions_missing_stop} position${planCompliance.positions_missing_stop !== 1 ? 's' : ''} missing stop loss`
      )
    }
    if (planCompliance.require_thesis && planCompliance.positions_missing_thesis > 0) {
      violations.push(
        `${planCompliance.positions_missing_thesis} position${planCompliance.positions_missing_thesis !== 1 ? 's' : ''} missing thesis`
      )
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* ── Row 1: Key Metrics ────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <motion.div key={card.label} variants={staggerItem}>
              <PelicanCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
                    {card.label}
                  </span>
                  <Icon
                    size={16}
                    weight="regular"
                    className="text-[var(--text-muted)]"
                  />
                </div>
                <div
                  className="text-xl font-semibold font-mono tabular-nums"
                  style={{ color: card.color }}
                >
                  {card.value}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {card.sub}
                </p>
              </PelicanCard>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Row 2: Visual Breakdowns ──────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Card A: Exposure Breakdown Donut */}
        <motion.div variants={staggerItem}>
          <PelicanCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ChartPie size={18} weight="regular" className="text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Exposure Breakdown
              </h3>
            </div>

            {donutData.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-[var(--text-muted)]">No positions to display</p>
              </div>
            ) : (
              <>
                <div className="relative h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="total_exposure"
                        stroke="none"
                      >
                        {donutData.map((entry) => (
                          <Cell
                            key={entry.asset_type}
                            fill={entry.fill}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<DonutTooltip />}
                        cursor={false}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                      {portfolio.total_positions}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      position{portfolio.total_positions !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  {donutData.map((entry) => (
                    <div key={entry.asset_type} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <span className="text-xs text-[var(--text-secondary)] capitalize">
                        {entry.asset_type}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                        {entry.pct_of_portfolio.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </PelicanCard>
        </motion.div>

        {/* Card B: Risk Budget */}
        <motion.div variants={staggerItem}>
          <PelicanCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} weight="regular" className="text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Risk Budget
              </h3>
            </div>

            {/* Total at risk / Potential reward */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Total at Risk
                </p>
                <p
                  className="text-lg font-semibold font-mono tabular-nums"
                  style={{ color: 'var(--data-negative)' }}
                >
                  {formatCompactDollar(risk.total_risk_usd)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Potential Reward
                </p>
                <p
                  className="text-lg font-semibold font-mono tabular-nums"
                  style={{ color: 'var(--data-positive)' }}
                >
                  {formatCompactDollar(risk.total_reward_usd)}
                </p>
              </div>
            </div>

            {/* Portfolio R:R Badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs text-[var(--text-muted)]">Portfolio R:R</span>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono tabular-nums"
                style={{
                  backgroundColor: 'var(--accent-muted)',
                  color: 'var(--accent-primary)',
                }}
              >
                {rrDisplay}
              </span>
            </div>

            {/* Risk Defined Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Risk-Defined Positions
                </span>
                <span
                  className="text-xs font-semibold font-mono tabular-nums"
                  style={{ color: riskBarColor }}
                >
                  {riskDefinedPct}%
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-[var(--bg-base)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: riskBarColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${riskDefinedPct}%` }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                />
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                <span className="font-mono tabular-nums">
                  {risk.positions_with_defined_risk}/{totalPositions}
                </span>
                {' '}positions ({riskDefinedPct}%) have defined risk
              </p>
            </div>
          </PelicanCard>
        </motion.div>
      </motion.div>

      {/* ── Row 3: Plan Compliance ────────────────────────────────────── */}
      <motion.div variants={staggerItem}>
        {!planCompliance.has_active_plan ? (
          <Link
            href="/journal?tab=plan"
            className="flex items-center justify-between rounded-xl px-4 py-3 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-colors duration-150"
            style={{ backgroundColor: 'var(--accent-glow)' }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} weight="regular" className="text-[var(--accent-primary)]" />
              <span className="text-sm text-[var(--text-secondary)]">
                Set up a Trading Plan to track position compliance
              </span>
            </div>
            <ArrowRight size={16} weight="bold" className="text-[var(--accent-primary)]" />
          </Link>
        ) : violations.length > 0 ? (
          <div
            className="rounded-xl px-4 py-3 border"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.06)',
              borderColor: 'rgba(245, 158, 11, 0.2)',
            }}
          >
            <div className="flex items-start gap-2">
              <Warning
                size={18}
                weight="fill"
                className="flex-shrink-0 mt-0.5"
                style={{ color: 'var(--data-warning)' }}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium" style={{ color: 'var(--data-warning)' }}>
                  Plan Violations
                </p>
                {violations.map((v) => (
                  <p key={v} className="text-xs text-[var(--text-secondary)]">
                    {v}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 border"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.06)',
              borderColor: 'rgba(34, 197, 94, 0.2)',
            }}
          >
            <CheckCircle
              size={18}
              weight="fill"
              style={{ color: 'var(--data-positive)' }}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              All positions comply with your trading plan
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
