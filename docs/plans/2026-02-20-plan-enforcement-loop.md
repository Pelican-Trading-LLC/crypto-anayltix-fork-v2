# Plan Enforcement Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the static trading plan into a living feedback loop — persist compliance per trade, show analytics on which rules make money, and let Pelican review the plan with data.

**Architecture:** Extend existing `checkTradeAgainstPlan()` result to derive stable rule keys. Save followed/violated arrays on each trade insert. New RPC aggregates per-rule stats. New insight card categorizes rules. Enhanced Pelican review prompt includes compliance data.

**Tech Stack:** Supabase (migration + RPC), React hooks (SWR), Framer Motion, Phosphor Icons, Tailwind

---

### Task 1: Database Migration — Add compliance columns + RPC

**Files:**
- Database: Supabase migration via MCP

**Step 1: Apply column migration**

Add three columns to the `trades` table:

```sql
ALTER TABLE trades ADD COLUMN IF NOT EXISTS plan_rules_followed TEXT[] DEFAULT '{}';
ALTER TABLE trades ADD COLUMN IF NOT EXISTS plan_rules_violated TEXT[] DEFAULT '{}';
ALTER TABLE trades ADD COLUMN IF NOT EXISTS plan_checklist_completed JSONB DEFAULT '{}';
```

**Step 2: Create `get_plan_compliance_stats` RPC**

```sql
CREATE OR REPLACE FUNCTION get_plan_compliance_stats(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  v_start TIMESTAMPTZ := COALESCE(p_start_date, NOW() - INTERVAL '1 year');
  v_end TIMESTAMPTZ := COALESCE(p_end_date, NOW());
BEGIN
  WITH followed_rules AS (
    SELECT unnest(plan_rules_followed) AS rule_key, id, pnl_amount
    FROM trades
    WHERE user_id = p_user_id
      AND entry_date::timestamptz BETWEEN v_start AND v_end
      AND status = 'closed'
      AND array_length(plan_rules_followed, 1) > 0
  ),
  violated_rules AS (
    SELECT unnest(plan_rules_violated) AS rule_key, id, pnl_amount
    FROM trades
    WHERE user_id = p_user_id
      AND entry_date::timestamptz BETWEEN v_start AND v_end
      AND status = 'closed'
      AND array_length(plan_rules_violated, 1) > 0
  ),
  all_rule_keys AS (
    SELECT DISTINCT rule_key FROM followed_rules
    UNION
    SELECT DISTINCT rule_key FROM violated_rules
  ),
  followed_agg AS (
    SELECT
      rule_key,
      COUNT(*) AS times_followed,
      COUNT(*) FILTER (WHERE pnl_amount > 0) AS wins_when_followed,
      COUNT(*) FILTER (WHERE pnl_amount <= 0) AS losses_when_followed,
      COALESCE(SUM(pnl_amount), 0) AS pnl_when_followed
    FROM followed_rules
    GROUP BY rule_key
  ),
  violated_agg AS (
    SELECT
      rule_key,
      COUNT(*) AS times_violated,
      COUNT(*) FILTER (WHERE pnl_amount > 0) AS wins_when_violated,
      COUNT(*) FILTER (WHERE pnl_amount <= 0) AS losses_when_violated,
      COALESCE(SUM(pnl_amount), 0) AS pnl_when_violated
    FROM violated_rules
    GROUP BY rule_key
  )
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'rule_key', k.rule_key,
      'times_followed', COALESCE(f.times_followed, 0),
      'wins_when_followed', COALESCE(f.wins_when_followed, 0),
      'losses_when_followed', COALESCE(f.losses_when_followed, 0),
      'pnl_when_followed', ROUND(COALESCE(f.pnl_when_followed, 0)::numeric, 2),
      'wr_when_followed', CASE
        WHEN COALESCE(f.times_followed, 0) > 0
        THEN ROUND(COALESCE(f.wins_when_followed, 0)::numeric / f.times_followed::numeric * 100, 1)
        ELSE 0 END,
      'times_violated', COALESCE(v.times_violated, 0),
      'wins_when_violated', COALESCE(v.wins_when_violated, 0),
      'losses_when_violated', COALESCE(v.losses_when_violated, 0),
      'pnl_when_violated', ROUND(COALESCE(v.pnl_when_violated, 0)::numeric, 2),
      'wr_when_violated', CASE
        WHEN COALESCE(v.times_violated, 0) > 0
        THEN ROUND(COALESCE(v.wins_when_violated, 0)::numeric / v.times_violated::numeric * 100, 1)
        ELSE 0 END,
      'follow_rate', CASE
        WHEN (COALESCE(f.times_followed, 0) + COALESCE(v.times_violated, 0)) > 0
        THEN ROUND(COALESCE(f.times_followed, 0)::numeric / (COALESCE(f.times_followed, 0) + COALESCE(v.times_violated, 0))::numeric * 100, 1)
        ELSE 0 END,
      'edge', CASE
        WHEN COALESCE(f.times_followed, 0) > 0
        THEN ROUND(COALESCE(f.wins_when_followed, 0)::numeric / f.times_followed::numeric * 100, 1)
        ELSE 0 END
        -
        CASE
        WHEN COALESCE(v.times_violated, 0) > 0
        THEN ROUND(COALESCE(v.wins_when_violated, 0)::numeric / v.times_violated::numeric * 100, 1)
        ELSE 0 END
    )
  ), '[]'::jsonb)
  INTO result
  FROM all_rule_keys k
  LEFT JOIN followed_agg f ON f.rule_key = k.rule_key
  LEFT JOIN violated_agg v ON v.rule_key = k.rule_key;

  RETURN result;
END;
$$;
```

**Step 3: Verify migration**

Run: `SELECT column_name FROM information_schema.columns WHERE table_name = 'trades' AND column_name IN ('plan_rules_followed', 'plan_rules_violated', 'plan_checklist_completed');`
Expected: 3 rows returned.

Run: `SELECT proname FROM pg_proc WHERE proname = 'get_plan_compliance_stats';`
Expected: 1 row.

---

### Task 2: Add rule key derivation utility to `lib/trading/plan-check.ts`

**Files:**
- Modify: `lib/trading/plan-check.ts:1-250`
- Modify: `types/trading.ts:102-108`

**Step 1: Add RuleComplianceStat type to `types/trading.ts`**

After line 108 (after `PlanViolation`), add:

```typescript
// ── Rule Compliance Stats (from get_plan_compliance_stats RPC) ──

export interface RuleComplianceStat {
  rule_key: string
  times_followed: number
  wins_when_followed: number
  losses_when_followed: number
  pnl_when_followed: number
  wr_when_followed: number
  times_violated: number
  wins_when_violated: number
  losses_when_violated: number
  pnl_when_violated: number
  wr_when_violated: number
  follow_rate: number
  edge: number
}
```

**Step 2: Add `deriveComplianceData` function to `lib/trading/plan-check.ts`**

After the `buildPlanComplianceSummary` function (line 250), add:

```typescript
/**
 * Map a PlanViolation to a stable rule key for compliance tracking.
 * Each violation type + rule pattern maps to a consistent key.
 */
function violationToRuleKey(v: PlanViolation): string {
  const text = v.rule_text.toLowerCase()
  if (text.includes('risk per trade exceeds')) return 'max_risk_per_trade'
  if (text.includes('position size') && text.includes('%')) return 'max_position_size_pct'
  if (text.includes('position value') && text.includes('exceeds')) return 'max_position_size_usd'
  if (text.includes('max open positions')) return 'max_open_positions'
  if (text.includes('max daily trades')) return 'max_trades_per_day'
  if (text.includes('daily loss limit')) return 'max_daily_loss'
  if (text.includes('consecutive losses')) return 'max_consecutive_losses'
  if (text.includes('no re-entry on same ticker')) return 'no_same_ticker_after_loss'
  if (text.includes('not in your allowed assets')) return 'allowed_asset_types'
  if (text.includes('blocked tickers')) return 'blocked_tickers'
  if (text.includes('requires a stop loss')) return 'require_stop_loss'
  if (text.includes('requires a take profit')) return 'require_take_profit'
  if (text.includes('requires a trade thesis')) return 'require_thesis'
  if (text.includes('r:r ratio')) return 'min_risk_reward'
  return `unknown_${v.violation_type}`
}

/**
 * Given the active plan's applicable rule keys, violations from checkTradeAgainstPlan,
 * and the user's checklist checkbox state, compute compliance arrays.
 */
export function deriveComplianceData(
  plan: TradingPlan,
  violations: PlanViolation[],
  checklistItems: { text: string; checked: boolean }[],
  checklistChecked: boolean[],
): {
  followed: string[]
  violated: string[]
  checklistCompleted: Record<string, boolean>
} {
  const followed: string[] = []
  const violated: string[] = []
  const checklistCompleted: Record<string, boolean> = {}

  // Track which rule keys have violations
  const violatedKeys = new Set(violations.map(violationToRuleKey))

  // Determine all applicable auto-check rule keys from the plan
  const applicableRules: string[] = []
  if (plan.require_stop_loss) applicableRules.push('require_stop_loss')
  if (plan.require_take_profit) applicableRules.push('require_take_profit')
  if (plan.require_thesis) applicableRules.push('require_thesis')
  if (plan.min_risk_reward_ratio) applicableRules.push('min_risk_reward')
  if (plan.max_position_size_usd) applicableRules.push('max_position_size_usd')
  if (plan.max_position_size_pct) applicableRules.push('max_position_size_pct')
  if (plan.max_risk_per_trade_pct) applicableRules.push('max_risk_per_trade')
  if (plan.max_open_positions) applicableRules.push('max_open_positions')
  if (plan.max_trades_per_day) applicableRules.push('max_trades_per_day')
  if (plan.max_daily_loss) applicableRules.push('max_daily_loss')
  if (plan.max_consecutive_losses_before_stop) applicableRules.push('max_consecutive_losses')
  if (plan.no_same_ticker_after_loss) applicableRules.push('no_same_ticker_after_loss')
  if (plan.allowed_asset_types?.length) applicableRules.push('allowed_asset_types')
  if (plan.blocked_tickers?.length) applicableRules.push('blocked_tickers')

  // For each applicable rule, check if there's a violation
  for (const key of applicableRules) {
    if (violatedKeys.has(key)) {
      violated.push(key)
      checklistCompleted[key] = false
    } else {
      followed.push(key)
      checklistCompleted[key] = true
    }
  }

  // Process manual checklist items
  checklistItems.forEach((item, i) => {
    const sanitizedKey = `checklist_${item.text.slice(0, 40).replace(/\s+/g, '_').toLowerCase()}`
    const isChecked = checklistChecked[i] ?? false
    checklistCompleted[sanitizedKey] = isChecked
    if (isChecked) {
      followed.push(sanitizedKey)
    } else {
      violated.push(sanitizedKey)
    }
  })

  return { followed, violated, checklistCompleted }
}
```

**Step 3: Verify no build errors**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds (no changes to imports needed yet).

**Step 4: Commit**

```bash
git add lib/trading/plan-check.ts types/trading.ts
git commit -m "feat: add rule key derivation for plan compliance tracking"
```

---

### Task 3: Extend Trade interface and logTrade to persist compliance

**Files:**
- Modify: `hooks/use-trades.ts:7-48` (Trade interface + TradeFormData)
- Modify: `hooks/use-trades.ts:114-152` (logTrade function)

**Step 1: Add compliance fields to Trade interface**

In `hooks/use-trades.ts`, add after line 29 (`ai_grade` field):

```typescript
  plan_rules_followed: string[] | null
  plan_rules_violated: string[] | null
  plan_checklist_completed: Record<string, boolean> | null
```

**Step 2: Add compliance fields to TradeFormData**

In `hooks/use-trades.ts`, add after `is_paper` (line 47):

```typescript
  plan_rules_followed?: string[]
  plan_rules_violated?: string[]
  plan_checklist_completed?: Record<string, boolean>
```

**Step 3: Include compliance fields in the insert**

In `hooks/use-trades.ts` `logTrade` function (line 121-141), add the three fields to the insert object:

```typescript
  plan_rules_followed: tradeData.plan_rules_followed || [],
  plan_rules_violated: tradeData.plan_rules_violated || [],
  plan_checklist_completed: tradeData.plan_checklist_completed || {},
```

**Step 4: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add hooks/use-trades.ts
git commit -m "feat: extend Trade interface with plan compliance fields"
```

---

### Task 4: Wire compliance data into log-trade-modal submit flow

**Files:**
- Modify: `components/journal/log-trade-modal.tsx:84-141` (handleSubmit)

**Step 1: Compute compliance data in handleSubmit**

In `log-trade-modal.tsx`, the `handleSubmit` function (line 84) needs to compute compliance before calling `onSubmit`. Add after line 100 (after `tags` is computed) and before line 104 (`await onSubmit`):

```typescript
      // Compute plan compliance data
      let planComplianceData: {
        plan_rules_followed?: string[]
        plan_rules_violated?: string[]
        plan_checklist_completed?: Record<string, boolean>
      } = {}

      if (plan) {
        const planCheckResult = checkTradeAgainstPlan(
          {
            ticker: normalizedTicker,
            asset_type: assetType,
            direction,
            quantity: parseFloat(quantity),
            entry_price: parseFloat(entryPrice),
            stop_loss: stopLoss ? parseFloat(stopLoss) : null,
            take_profit: takeProfit ? parseFloat(takeProfit) : null,
            entry_date: entryDate,
            thesis: thesis || null,
            setup_tags: tags.length > 0 ? tags : undefined,
          },
          plan,
          existingTrades,
        )

        const { followed, violated, checklistCompleted } = deriveComplianceData(
          plan,
          planCheckResult.violations,
          planCheckResult.checklistItems,
          checklistChecked,
        )

        planComplianceData = {
          plan_rules_followed: followed,
          plan_rules_violated: violated,
          plan_checklist_completed: checklistCompleted,
        }
      }
```

Then include `...planComplianceData` in the `onSubmit` call (line 104-118):

```typescript
      await onSubmit({
        ticker: normalizedTicker,
        asset_type: assetType,
        direction,
        quantity: parseFloat(quantity),
        entry_price: parseFloat(entryPrice),
        stop_loss: stopLoss ? parseFloat(stopLoss) : null,
        take_profit: takeProfit ? parseFloat(takeProfit) : null,
        entry_date: entryDate,
        thesis: thesis || null,
        notes: notes || null,
        setup_tags: tags.length > 0 ? tags : undefined,
        conviction: parseInt(conviction),
        is_paper: isPaper,
        ...planComplianceData,
      })
```

**Step 2: Add import for `deriveComplianceData`**

Update line 8 import:
```typescript
import { checkTradeAgainstPlan, deriveComplianceData } from "@/lib/trading/plan-check"
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add components/journal/log-trade-modal.tsx
git commit -m "feat: persist plan compliance data when logging trades"
```

---

### Task 5: Create `use-plan-compliance` hook

**Files:**
- Create: `hooks/use-plan-compliance.ts`

**Step 1: Write the hook**

```typescript
"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"
import type { RuleComplianceStat } from "@/types/trading"

export function usePlanCompliance(startDate?: string, endDate?: string) {
  const supabase = useMemo(() => createClient(), [])

  const { data, error, isLoading, mutate } = useSWR<RuleComplianceStat[]>(
    ['plan-compliance', startDate, endDate],
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase.rpc('get_plan_compliance_stats', {
        p_user_id: user.id,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
      })

      if (error) throw error
      return (data as RuleComplianceStat[]) || []
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return
        setTimeout(() => revalidate({ retryCount }), 5000 * (retryCount + 1))
      },
    }
  )

  return {
    stats: data || [],
    isLoading,
    error: error ?? null,
    refresh: mutate,
  }
}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add hooks/use-plan-compliance.ts
git commit -m "feat: add use-plan-compliance hook for rule compliance stats"
```

---

### Task 6: Build Plan Compliance analytics card

**Files:**
- Create: `components/journal/insights/plan-compliance-card.tsx`

**Step 1: Write the card component**

```tsx
'use client'

import { useMemo } from 'react'
import { Shield, Check, X, Equals, Sparkle } from '@phosphor-icons/react'
import { PelicanCard } from '@/components/ui/pelican'
import { cn } from '@/lib/utils'
import type { RuleComplianceStat } from '@/types/trading'

// Human-readable labels for rule keys
const RULE_LABELS: Record<string, string> = {
  require_stop_loss: 'Stop loss set',
  require_take_profit: 'Take profit set',
  require_thesis: 'Thesis documented',
  min_risk_reward: 'Min R:R met',
  max_position_size_usd: 'Position size (USD)',
  max_position_size_pct: 'Position size (%)',
  max_risk_per_trade: 'Risk per trade limit',
  max_open_positions: 'Max open positions',
  max_trades_per_day: 'Max trades/day',
  max_daily_loss: 'Daily loss limit',
  max_consecutive_losses: 'Consecutive loss limit',
  no_same_ticker_after_loss: 'No re-entry after loss',
  allowed_asset_types: 'Allowed asset types',
  blocked_tickers: 'Blocked tickers',
}

function getRuleLabel(key: string): string {
  if (RULE_LABELS[key]) return RULE_LABELS[key]
  // Checklist items: strip prefix and convert underscores
  if (key.startsWith('checklist_')) {
    return key.replace('checklist_', '').replace(/_/g, ' ')
  }
  return key.replace(/_/g, ' ')
}

interface CategorizedRules {
  moneyMakers: RuleComplianceStat[]
  dontMatter: RuleComplianceStat[]
  keepBreaking: RuleComplianceStat[]
}

function categorizeRules(stats: RuleComplianceStat[]): CategorizedRules {
  const minSamples = 3

  const moneyMakers: RuleComplianceStat[] = []
  const dontMatter: RuleComplianceStat[] = []
  const keepBreaking: RuleComplianceStat[] = []

  for (const r of stats) {
    const totalSamples = r.times_followed + r.times_violated
    if (totalSamples < 2) {
      dontMatter.push(r)
      continue
    }

    const hasEdge = r.edge > 15 && r.times_followed >= minSamples
    const noEdge = Math.abs(r.edge) < 10 || totalSamples < minSamples
    const breaking = r.follow_rate < 60 && r.edge > 10

    if (hasEdge) moneyMakers.push(r)
    else if (breaking) keepBreaking.push(r)
    else dontMatter.push(r)
  }

  moneyMakers.sort((a, b) => b.edge - a.edge)
  keepBreaking.sort((a, b) => a.follow_rate - b.follow_rate)

  return { moneyMakers, dontMatter, keepBreaking }
}

function formatPnl(amount: number): string {
  const prefix = amount >= 0 ? '+' : ''
  return `${prefix}$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function RuleRow({ stat, variant }: { stat: RuleComplianceStat; variant: 'money' | 'breaking' | 'neutral' }) {
  const label = getRuleLabel(stat.rule_key)
  const totalSamples = stat.times_followed + stat.times_violated

  return (
    <div className={cn(
      'px-3 py-2.5 rounded-lg border transition-colors',
      variant === 'money' && 'bg-[var(--data-positive)]/[0.04] border-[var(--data-positive)]/10',
      variant === 'breaking' && 'bg-[var(--data-warning)]/[0.04] border-[var(--data-warning)]/10',
      variant === 'neutral' && 'bg-[var(--bg-surface)] border-[var(--border-subtle)]',
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <span className="text-[var(--text-muted)]">
            Follow: <span className="text-[var(--text-secondary)]">{stat.follow_rate.toFixed(0)}%</span>
          </span>
          <span className="text-[var(--text-muted)]">
            Edge: <span className={cn(
              stat.edge > 0 ? 'text-[var(--data-positive)]' : stat.edge < 0 ? 'text-[var(--data-negative)]' : 'text-[var(--text-secondary)]'
            )}>{stat.edge > 0 ? '+' : ''}{stat.edge.toFixed(0)}%</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
        <span>
          Followed {stat.times_followed}x: {stat.wr_when_followed.toFixed(0)}% WR, {formatPnl(stat.pnl_when_followed)}
        </span>
        {stat.times_violated > 0 && (
          <span>
            Violated {stat.times_violated}x: {stat.wr_when_violated.toFixed(0)}% WR, {formatPnl(stat.pnl_when_violated)}
          </span>
        )}
        {totalSamples < 5 && (
          <span className="italic">Low sample size</span>
        )}
      </div>
    </div>
  )
}

interface PlanComplianceCardProps {
  stats: RuleComplianceStat[]
  onAskPelican: (prompt: string) => void
  isLoading?: boolean
}

export function PlanComplianceCard({ stats, onAskPelican, isLoading }: PlanComplianceCardProps) {
  const categorized = useMemo(() => categorizeRules(stats), [stats])

  // Overall compliance rate
  const overallFollowRate = useMemo(() => {
    if (stats.length === 0) return 0
    const totalFollowed = stats.reduce((sum, r) => sum + r.times_followed, 0)
    const totalViolated = stats.reduce((sum, r) => sum + r.times_violated, 0)
    const total = totalFollowed + totalViolated
    return total > 0 ? (totalFollowed / total) * 100 : 0
  }, [stats])

  if (isLoading) {
    return (
      <PelicanCard>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 bg-[var(--bg-elevated)] rounded" />
          <div className="h-3 w-full bg-[var(--bg-elevated)] rounded" />
          <div className="h-20 w-full bg-[var(--bg-elevated)] rounded" />
        </div>
      </PelicanCard>
    )
  }

  // Empty state
  if (stats.length === 0) {
    return (
      <PelicanCard>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={18} weight="bold" className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Plan Compliance</h3>
        </div>
        <div className="text-center py-6">
          <Shield size={32} weight="thin" className="text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-secondary)]">No compliance data yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
            Log trades with your trading plan active to see which rules are making you money.
          </p>
        </div>
      </PelicanCard>
    )
  }

  return (
    <PelicanCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={18} weight="bold" className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Plan Compliance</h3>
        </div>
        <button
          onClick={() => onAskPelican('__plan_review__')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-muted)] transition-colors"
        >
          <Sparkle size={14} weight="bold" />
          Ask Pelican
        </button>
      </div>

      {/* Overall compliance bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--text-muted)]">Overall Compliance</span>
          <span className="text-sm font-mono tabular-nums font-semibold text-[var(--text-primary)]">
            {overallFollowRate.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              overallFollowRate >= 80 ? 'bg-[var(--data-positive)]' :
              overallFollowRate >= 60 ? 'bg-[var(--data-warning)]' :
              'bg-[var(--data-negative)]'
            )}
            style={{ width: `${Math.min(overallFollowRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Money Makers */}
      {categorized.moneyMakers.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Check size={14} weight="bold" className="text-[var(--data-positive)]" />
            <span className="text-xs font-medium text-[var(--data-positive)] uppercase tracking-wider">
              Rules that make you money
            </span>
          </div>
          <div className="space-y-1.5">
            {categorized.moneyMakers.map(stat => (
              <RuleRow key={stat.rule_key} stat={stat} variant="money" />
            ))}
          </div>
        </div>
      )}

      {/* Keep Breaking */}
      {categorized.keepBreaking.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <X size={14} weight="bold" className="text-[var(--data-warning)]" />
            <span className="text-xs font-medium text-[var(--data-warning)] uppercase tracking-wider">
              Rules you keep breaking
            </span>
          </div>
          <div className="space-y-1.5">
            {categorized.keepBreaking.map(stat => (
              <RuleRow key={stat.rule_key} stat={stat} variant="breaking" />
            ))}
          </div>
        </div>
      )}

      {/* Don't Matter */}
      {categorized.dontMatter.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Equals size={14} weight="bold" className="text-[var(--text-muted)]" />
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Inconclusive
            </span>
          </div>
          <div className="space-y-1.5">
            {categorized.dontMatter.map(stat => (
              <RuleRow key={stat.rule_key} stat={stat} variant="neutral" />
            ))}
          </div>
        </div>
      )}
    </PelicanCard>
  )
}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add components/journal/insights/plan-compliance-card.tsx
git commit -m "feat: add plan compliance analytics insight card"
```

---

### Task 7: Integrate compliance card into Insights tab

**Files:**
- Modify: `components/journal/insights-tab.tsx:1-19` (imports)
- Modify: `components/journal/insights-tab.tsx:100-101` (hook call)
- Modify: `components/journal/insights-tab.tsx:193-197` (render, after Row 1)

**Step 1: Add imports**

After line 18 (`CalendarCard` import), add:

```typescript
import { PlanComplianceCard } from "@/components/journal/insights/plan-compliance-card"
import { usePlanCompliance } from "@/hooks/use-plan-compliance"
```

**Step 2: Add hook call inside component**

After line 101 (`useBehavioralInsights` call), add:

```typescript
  const { stats: complianceStats, isLoading: complianceLoading } = usePlanCompliance()
```

**Step 3: Render compliance card**

Insert a new row BEFORE the current Row 1 (line 193), right after the header (line 191):

```tsx
      {/* Row 0: Plan Compliance (full width) */}
      <motion.div variants={staggerItem} className="mb-6">
        <PlanComplianceCard
          stats={complianceStats}
          onAskPelican={onAskPelican}
          isLoading={complianceLoading}
        />
      </motion.div>
```

**Step 4: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add components/journal/insights-tab.tsx
git commit -m "feat: add plan compliance card to insights tab"
```

---

### Task 8: Build enhanced Pelican plan review prompt + wire to plan tab

**Files:**
- Modify: `lib/trading/plan-check.ts` (add `buildPlanReviewPrompt`)
- Modify: `components/journal/trading-plan-tab.tsx:19-26` (imports, props)
- Modify: `components/journal/trading-plan-tab.tsx:170` (component args)
- Modify: `components/journal/trading-plan-tab.tsx:682-688` (Pelican button)

**Step 1: Add `buildPlanReviewPrompt` to `lib/trading/plan-check.ts`**

After `deriveComplianceData`, add:

```typescript
import type { RuleComplianceStat } from '@/types/trading'
import type { TradeStats } from '@/hooks/use-trade-stats'

/**
 * Build a comprehensive prompt for Pelican to review the trading plan
 * with compliance data and trading stats.
 */
export function buildPlanReviewPrompt(
  plan: TradingPlan,
  complianceStats: RuleComplianceStat[] | null,
  tradeStats: TradeStats | null,
): string {
  let prompt = 'Review my trading plan and tell me what\'s working, what\'s not, and what to change.\n\n'

  prompt += '=== MY TRADING PLAN ===\n'
  prompt += `Name: "${plan.name}"\n`

  if (plan.max_trades_per_day) prompt += `Max trades/day: ${plan.max_trades_per_day}\n`
  if (plan.max_open_positions) prompt += `Max open positions: ${plan.max_open_positions}\n`
  if (plan.max_position_size_usd) prompt += `Max position size: $${plan.max_position_size_usd.toLocaleString()}\n`
  if (plan.min_risk_reward_ratio) prompt += `Min R:R: ${plan.min_risk_reward_ratio}:1\n`
  if (plan.max_risk_per_trade_pct) prompt += `Max risk/trade: ${plan.max_risk_per_trade_pct}%\n`
  if (plan.max_daily_loss) prompt += `Max daily loss: $${plan.max_daily_loss}\n`
  if (plan.max_weekly_loss) prompt += `Max weekly loss: $${plan.max_weekly_loss}\n`
  if (plan.max_monthly_loss) prompt += `Max monthly loss: $${plan.max_monthly_loss}\n`
  if (plan.require_stop_loss) prompt += 'Rule: Every trade must have a stop loss\n'
  if (plan.require_take_profit) prompt += 'Rule: Every trade must have a take profit\n'
  if (plan.require_thesis) prompt += 'Rule: Every trade must have a thesis\n'
  if (plan.avoid_first_15_min) prompt += 'Rule: Avoid first 15 minutes\n'
  if (plan.first_hour_only) prompt += 'Rule: First hour only\n'
  if (!plan.friday_trading_allowed) prompt += 'Rule: No Friday trading\n'
  if (plan.max_consecutive_losses_before_stop) prompt += `Stop after ${plan.max_consecutive_losses_before_stop} consecutive losses\n`
  if (plan.no_same_ticker_after_loss) prompt += 'Rule: No re-entry on same ticker after loss\n'
  if (plan.cooldown_after_max_loss_hours) prompt += `Cooldown after max loss: ${plan.cooldown_after_max_loss_hours} hours\n`

  if (plan.pre_entry_checklist?.length) {
    prompt += '\nPre-entry checklist:\n'
    plan.pre_entry_checklist.forEach(item => { prompt += `- ${item}\n` })
  }

  if (tradeStats) {
    prompt += '\n=== MY TRADING STATS ===\n'
    prompt += `Total closed trades: ${tradeStats.closed_trades}\n`
    prompt += `Win rate: ${tradeStats.win_rate?.toFixed(1)}%\n`
    prompt += `Profit factor: ${tradeStats.profit_factor?.toFixed(2)}\n`
    prompt += `Avg R: ${tradeStats.avg_r_multiple?.toFixed(2)}\n`
    prompt += `Total P&L: $${tradeStats.total_pnl?.toLocaleString()}\n`
    prompt += `Largest win: $${tradeStats.largest_win?.toLocaleString()}\n`
    prompt += `Largest loss: $${tradeStats.largest_loss?.toLocaleString()}\n`
  }

  if (complianceStats?.length) {
    prompt += '\n=== RULE COMPLIANCE DATA ===\n'
    prompt += '(Follow = I obeyed the rule. Violate = I broke it.)\n\n'

    complianceStats.forEach(r => {
      const total = r.times_followed + r.times_violated
      if (total === 0) return
      prompt += `Rule: "${r.rule_key}"\n`
      prompt += `  Followed ${r.times_followed}x: ${r.wr_when_followed}% WR, $${r.pnl_when_followed.toLocaleString()} P&L\n`
      prompt += `  Violated ${r.times_violated}x: ${r.wr_when_violated}% WR, $${r.pnl_when_violated.toLocaleString()} P&L\n`
      prompt += `  Follow rate: ${r.follow_rate}% | Edge: ${r.edge > 0 ? '+' : ''}${r.edge}%\n\n`
    })
  }

  prompt += '\n=== WHAT I NEED FROM YOU ===\n'
  prompt += '1. Which rules are clearly making me money? (keep these, maybe tighten them)\n'
  prompt += '2. Which rules am I breaking that are costing me? (be honest)\n'
  prompt += '3. Which rules don\'t have enough data or don\'t seem to matter? (consider removing)\n'
  prompt += '4. What rules am I MISSING that my stats suggest I need?\n'
  prompt += '5. Rate my plan A through F and tell me the single most impactful change I could make.\n'

  return prompt
}
```

Note: The `import type` for `TradeStats` should be at the top of the file. Move the imports to the top alongside existing imports.

**Step 2: Update TradingPlanTab props and component**

In `components/journal/trading-plan-tab.tsx`:

Update the interface (line 23-26):
```typescript
interface TradingPlanTabProps {
  trades: Trade[]
  onAskPelican: (prompt: string) => void
  complianceStats?: RuleComplianceStat[]
  tradeStats?: TradeStats | null
}
```

Update the component signature (line 170):
```typescript
export function TradingPlanTab({ trades, onAskPelican, complianceStats, tradeStats }: TradingPlanTabProps) {
```

Add imports:
```typescript
import type { RuleComplianceStat } from '@/types/trading'
import type { TradeStats } from '@/hooks/use-trade-stats'
import { buildPlanReviewPrompt } from '@/lib/trading/plan-check'
```

**Step 3: Upgrade the Pelican compliance button (line 682-688)**

Replace the existing button with two buttons:

```tsx
          <div className="flex items-center gap-2">
            <PelicanButton
              onClick={() => onAskPelican(buildPlanComplianceSummary(plan, trades) + '\n\nAm I following my trading plan today? Analyze my compliance and give me feedback.')}
              variant="secondary"
              size="sm"
            >
              Ask Pelican about today
            </PelicanButton>
            <PelicanButton
              onClick={() => onAskPelican(buildPlanReviewPrompt(plan, complianceStats || null, tradeStats || null))}
              variant="secondary"
              size="sm"
            >
              <Sparkle size={14} weight="bold" />
              Review my plan
            </PelicanButton>
          </div>
```

Add `Sparkle` to the Phosphor imports (line 5):
```typescript
import { ..., Sparkle } from '@phosphor-icons/react'
```

**Step 4: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add lib/trading/plan-check.ts components/journal/trading-plan-tab.tsx
git commit -m "feat: enhanced Pelican plan review with compliance data"
```

---

### Task 9: Wire compliance data from journal page to tabs

**Files:**
- Modify: `app/(features)/journal/page.tsx:1-42` (imports)
- Modify: `app/(features)/journal/page.tsx:118-119` (hook calls)
- Modify: `app/(features)/journal/page.tsx:400-404` (TradingPlanTab props)

**Step 1: Add imports**

Add after line 11 (`useTradeStats` import):
```typescript
import { usePlanCompliance } from "@/hooks/use-plan-compliance"
```

**Step 2: Add hook call**

After line 118 (`useTradeStats` call), add:
```typescript
  const { stats: complianceStats } = usePlanCompliance()
```

**Step 3: Pass compliance data and trade stats to TradingPlanTab**

Update the TradingPlanTab render (line 400-403):
```tsx
                <TradingPlanTab
                  trades={trades}
                  onAskPelican={handleAskPelican}
                  complianceStats={complianceStats}
                  tradeStats={stats}
                />
```

**Step 4: Handle `__plan_review__` sentinel from compliance card**

The compliance card sends `'__plan_review__'` as the prompt when "Ask Pelican" is clicked. We need to intercept this in the insights tab or journal page to build the full review prompt.

In `components/journal/insights-tab.tsx`, wrap the `onAskPelican` passed to the compliance card:

```typescript
  // Import at top
  import { useTradingPlan } from "@/hooks/use-trading-plan"
  import { useTradeStats } from "@/hooks/use-trade-stats"
  import { buildPlanReviewPrompt } from "@/lib/trading/plan-check"

  // Inside the component
  const { plan } = useTradingPlan()
  const { stats: tradeStats } = useTradeStats()

  const handleComplianceAskPelican = useCallback((prompt: string) => {
    if (prompt === '__plan_review__' && plan) {
      onAskPelican(buildPlanReviewPrompt(plan, complianceStats, tradeStats))
    } else {
      onAskPelican(prompt)
    }
  }, [plan, complianceStats, tradeStats, onAskPelican])
```

Then pass `handleComplianceAskPelican` to the `PlanComplianceCard`:
```tsx
        <PlanComplianceCard
          stats={complianceStats}
          onAskPelican={handleComplianceAskPelican}
          isLoading={complianceLoading}
        />
```

**Step 5: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds with zero errors.

**Step 6: Commit**

```bash
git add app/\(features\)/journal/page.tsx components/journal/insights-tab.tsx
git commit -m "feat: wire compliance data through journal page to all tabs"
```

---

### Task 10: Final build verification and combined commit

**Step 1: Full build**

Run: `npm run build 2>&1 | tail -30`
Expected: Build succeeds cleanly.

**Step 2: Verify all new/changed files exist**

```bash
ls -la hooks/use-plan-compliance.ts
ls -la components/journal/insights/plan-compliance-card.tsx
grep -c "deriveComplianceData\|buildPlanReviewPrompt" lib/trading/plan-check.ts
grep -c "plan_rules_followed\|plan_rules_violated" hooks/use-trades.ts
grep -c "planComplianceData\|deriveComplianceData" components/journal/log-trade-modal.tsx
grep -c "PlanComplianceCard\|complianceStats" components/journal/insights-tab.tsx
grep -c "complianceStats\|buildPlanReviewPrompt" components/journal/trading-plan-tab.tsx
grep -c "usePlanCompliance\|complianceStats" app/\(features\)/journal/page.tsx
```

**Step 3: No console.log check**

```bash
grep -r "console\.log" hooks/use-plan-compliance.ts components/journal/insights/plan-compliance-card.tsx lib/trading/plan-check.ts
```
Expected: No output.

**Step 4: Final squash commit (if individual commits weren't made)**

```bash
git add -A
git commit -m "feat: pre-trade checklist enforcement, rule compliance analytics, Pelican plan review — the plan is alive"
```
