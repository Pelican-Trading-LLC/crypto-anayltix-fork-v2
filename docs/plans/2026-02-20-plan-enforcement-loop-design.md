# Trading Plan Enforcement Loop — Design Doc

**Date:** 2026-02-20
**Author:** Jack (via Claude)
**Status:** Approved

## Summary

Three features that turn the static trading plan into a living feedback loop:

1. **Pre-trade compliance persistence** — Save which plan rules were followed/violated on each trade
2. **Rule compliance analytics** — Show which rules make money and which the trader keeps breaking
3. **Pelican plan review** — Send compliance data to chat for AI-powered plan coaching

## Existing Infrastructure (Build On)

- `checkTradeAgainstPlan()` in `lib/trading/plan-check.ts` — validates 12+ rules, returns `PlanViolation[]` + `checklistItems[]`
- `PlanCheckSection` in log-trade-modal — renders violations + pre-entry checklist checkboxes
- `buildPlanComplianceSummary()` — generates plan context for chat
- `onAskPelican` → `openWithPrompt(null, prompt, "journal")` — all journal→chat wiring
- `useTradingPlan()` — already fetches active plan in modal

## Database Changes

### New columns on `trades`

```sql
plan_rules_followed TEXT[] DEFAULT '{}'
plan_rules_violated TEXT[] DEFAULT '{}'
plan_checklist_completed JSONB DEFAULT '{}'
```

### New RPC: `get_plan_compliance_stats`

Takes `p_user_id`, optional `p_start_date`, `p_end_date`. Returns per-rule stats:
- times_followed, wins/losses/pnl when followed, WR when followed
- times_violated, wins/losses/pnl when violated, WR when violated
- follow_rate (%), edge (WR difference)

## Feature 1: Persist Compliance Data

**Where:** `components/journal/log-trade-modal.tsx` → extend existing `PlanCheckSection`

**Logic:**
- After `checkTradeAgainstPlan()` runs, derive rule keys from violations
- Map each `PlanViolation` to a stable string key (e.g., `require_stop_loss`, `max_position_size`)
- Track pre-entry checklist checkbox state (already exists in modal)
- On submit, compute `followed[]`, `violated[]`, `checklistCompleted{}` and include in trade insert

**Rule key derivation:**
- Auto rules: map from `PlanViolation.rule_text` patterns → stable keys
- Manual checklist: use checklist text as key (sanitized)
- Rules that pass (no violation generated) → followed
- Rules that violate → violated

**Non-blocking:** Violations are tracked, never enforced. Trade always submits.

## Feature 2: Plan Compliance Analytics

**New hook:** `hooks/use-plan-compliance.ts`
- Calls `get_plan_compliance_stats` RPC
- Returns `RuleComplianceStat[]` with loading state
- Pattern: matches existing hooks (SWR or useEffect + state)

**New component:** `components/journal/insights/plan-compliance-card.tsx`
- Categories: "Money Makers" (edge >15, 3+ samples), "Don't Matter" (|edge| <10 or few samples), "Keep Breaking" (follow_rate <60, edge >10)
- Overall compliance bar
- Per-rule rows with followed vs violated breakdown
- "Ask Pelican" button in header
- Empty state linking to plan setup

**Placement:** First card in insights tab grid.

## Feature 3: Pelican Plan Review

**Two entry points:**
1. Plan tab — upgrade existing "Ask Pelican about compliance" button
2. Compliance card — "Ask Pelican" button in header

**Prompt builder:** `buildPlanReviewPrompt(plan, complianceStats, tradeStats)`
- Includes full plan rules
- Includes trading stats (win rate, PF, avg R, total P&L)
- Includes per-rule compliance data (the gold)
- Asks: which rules make money, which cost money, which to remove, which to add, overall grade

**Wiring:** Uses existing `openWithPrompt()` pattern.

## Type Updates

Add to Trade interface:
```typescript
plan_rules_followed: string[] | null
plan_rules_violated: string[] | null
plan_checklist_completed: Record<string, boolean> | null
```

New interfaces:
```typescript
interface RuleComplianceStat {
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

## Files Changed

| File | Change |
|------|--------|
| `hooks/use-trades.ts` | Add 3 fields to Trade interface |
| `types/trading.ts` | Add RuleComplianceStat interface |
| `lib/trading/plan-check.ts` | Add `deriveRuleKeys()` utility |
| `components/journal/log-trade-modal.tsx` | Save compliance data on submit |
| `hooks/use-plan-compliance.ts` | **NEW** — fetch compliance stats |
| `components/journal/insights/plan-compliance-card.tsx` | **NEW** — analytics card |
| `components/journal/insights-tab.tsx` | Import + render compliance card |
| `components/journal/trading-plan-tab.tsx` | Upgrade Pelican review button |
| `app/(features)/journal/page.tsx` | Pass compliance stats to tabs |

## Non-Goals

- No blocking/enforcement of trades (violations are advisory)
- No changes to streaming hooks
- No changes to close-trade-modal (future: post-trade compliance review)
