# Pelican Trading AI — V2 Tech Debt Audit

**Date:** 2026-03-04
**Scope:** 546 files, 82,305 lines of TypeScript/TSX
**Method:** Automated scan + manual verification of every finding

---

## 1. Dead Files (Confirmed Orphaned)

All 15 files below are confirmed truly unused — not imported via barrel files, dynamic imports, config files, or test files. Each was individually verified.

### Components (14 files, 2,133 lines)

| File | Lines | Why Orphaned |
|------|-------|-------------|
| `lib/data/curated-strategies.ts` | 581 | Superseded by Supabase `strategies` table. Static data file from pre-DB era. |
| `components/chat/message-actions.tsx` | 399 | Replaced by `message-action-bar.tsx`. Exports `MessageActions` — never imported. |
| `components/admin/AnalyticsDashboard.tsx` | 346 | Replaced by inline `AdminAnalyticsPage` in `app/admin/analytics/page.tsx`. |
| `components/marketing/HeroChatDemo.tsx` | 222 | Marketing demo component never wired into any page or layout. |
| `components/onboarding/progress-widget.tsx` | 145 | Onboarding widget never integrated. Welcome screen has inline content. |
| `components/upgrade-modal.tsx` | 103 | Upgrade modal never wired up. Predates current credit/subscription system. |
| `components/how-to-use/DemoCard.tsx` | 76 | Replaced by `components/landing/how-to-use-page.tsx`. |
| `components/admin/RecentSignups.tsx` | 70 | Admin dashboard was rewritten with inline sub-components. |
| `components/playbooks/playbook-empty-state.tsx` | 53 | Replaced by inline `GlobalEmptyState` in playbooks page. |
| `components/chat/LearningModeToggle.tsx` | 31 | Learning mode toggle rendered elsewhere in current UI. |
| `components/admin/StatsCard.tsx` | 28 | Admin dashboard uses inline `AdminStatCard`. |
| `components/marketing/MobileStickyCtaBar.tsx` | 26 | Mobile CTA bar never added to any layout. |
| `components/force-dark-theme.tsx` | 23 | Was for strategies layout, now unused. |
| `components/marketing/SignUpButton.tsx` | 16 | CTA button never wired to any marketing page. |
| `components/marketing/HeroChatDemoLoader.tsx` | 14 | Dynamic import wrapper for dead `HeroChatDemo.tsx`. |

**Total deletable:** 15 files, 2,133 lines

---

## 2. Refactor Candidates (Components Over 500 Lines)

### Priority: HIGH

#### `log-trade-modal.tsx` (1,020 lines)
**Concerns mixed:** 18 `useState` calls, form validation, forex lot sizing, playbook checklists, plan compliance, edit mode prefill
**Split into:**
- `TradeFormFields` — core form inputs (ticker, direction, quantity, prices, dates, thesis)
- `ForexLotSizingSection` — conditional forex lot type/count/value display
- `RiskRewardDisplay` — position size, risk at stop, profit at target, R:R ratio
- `PlaybookChecklistSection` — playbook selector + checklist rendering
**Extract hooks:**
- `useTradeForm(editTrade, initialTicker, open)` — all 18 field states, prefill, reset, submit
- `useForexLotSizing(assetType, lotType, lotCount)` — 3 lot-size effects
- `usePlaybookChecklist(selectedPlaybook)` — checklist state + toggle logic

#### `trading-context-panel.tsx` (984 lines)
**Concerns mixed:** 5 rendering modes, watchlist CRUD, live price merging, alert price editing, market config data blob, duplicated tab bar JSX
**Split into:**
- `MarketOverviewTab` — indices, VIX, sectors, watchlist
- `WatchlistSection` with `WatchlistTickerRow` — per-ticker rows with price/alert/prompt
- `PriceAlertEditor` — inline alert editing form
- Extract market config data blob (lines 77–184) to `lib/market-panel-config.ts`
- Deduplicate tab bar (rendered identically in two branches)
**Extract hooks:**
- `useWatchlistWithPrices()` — merges watchlist + live quotes
- `useWatchlistEditor()` — 9 scattered editing state values + all handlers

#### `RecentConversations.tsx` (943 lines) — admin
**Concerns mixed:** conversation list + pagination, message cache, debounced filters, 5 inline sub-components, 3 inline `fetch()` calls
**Split into:**
- `ConversationFilters` — email/content filter inputs + source select
- `ConversationListItem` — per-row with expand toggle, modal, badges
- `ExpandedConversationView` — message list, metadata, copy-all, load-more
- Extract `AdminMessageRow`, `ConversationModal`, `SourceBadge` to separate files
**Extract hooks:**
- `useConversationList()` — SWR-based replacement for 3 raw `fetch()` calls
- `useMessageCache()` — messages cache, loading, toggle, load-more, copy

#### `conversation-sidebar.tsx` (929 lines)
**Concerns mixed:** conversation grouping, drag-to-resize, search, profile menu, admin status fetch, saved insights, theme toggle, 5 copy-pasted time-group render blocks
**Split into:**
- `ConversationGroupSection` — replaces 5 near-identical Today/Yesterday/7d/30d/Older blocks (~150 lines of duplication)
- `SavedInsightsView` — saved insights panel
- `SidebarFooter` — profile + popover + admin link + sign-out
- `SidebarHeader` — new chat button, collapse, search
**Extract hooks:**
- `useSidebarResize(width, onWidthChange)` — drag logic + cursor effect
- `useSidebarAdmin()` — replace inline Supabase query with SWR
- `useConversationGroups(conversations)` — time-group bucketing useMemo

### Priority: MEDIUM

#### `trading-plan-tab.tsx` (741 lines)
**Split into:** `PlanFormView`, `PlanViewMode`, `PlanComplianceCard`. Extract 7 inline UI primitives to `plan-form-primitives.tsx`.
**Extract:** `useTradingPlanForm(plan)` — all form state + handlers (~100 lines)

#### `trades-table.tsx` (695 lines)
**Split into:** `TradesTableDesktop`, `TradeCardMobile` (desktop/mobile share ~200 lines of duplicated P&L/status/grade logic).
**Extract:** `useTradeSort()`, `useTradeFilter()`. Move `getUnrealizedPnL` to `lib/trading/`.

#### `create-playbook-modal.tsx` (571 lines)
**Split into:** `PlaybookBasicInfoSection`, `PlaybookRulesSection`, `PlaybookInstrumentsSection`, `PlaybookChecklistSection`.
**Extract:** `usePlaybookForm(editPlaybook)` — 14 `useState` calls. `useTagList()` — shared add/remove/input pattern (instruments + checklist duplicate it).

#### `chat-container.tsx` (502 lines)
**Extract:** `useDragDropUpload(onFileUpload)` — 70 lines of drag event handlers. `useNewMessagesPill()` — complex useEffect.

### Priority: LOW

#### `portfolio-overview.tsx` (563 lines) — well-structured, just dense
#### `calendar-tab.tsx` (633 lines) — sub-components already extracted inline, just need separate files
#### `actions-tab.tsx` (560 lines) — 5 form sub-components already well-decomposed, need file splitting only

---

## 3. Duplicate Patterns

### 3.1 Triple `normalizeTicker` Implementation

Three separate implementations exist:

| Location | Function | Purpose |
|----------|----------|---------|
| `lib/utils.ts:17` | `normalizeTicker(ticker: string): string` | Simple uppercase + trim |
| `lib/ticker-normalizer.ts:34` | `normalizeTicker(raw: string): NormalizedTicker \| null` | Full parser with asset type detection, X:/C: prefix handling |
| `components/journal/log-trade-modal.tsx:150` | `normalizeTicker(tickerValue, assetType): string` | Form-specific with asset type context |

**Recommendation:** Consolidate into `lib/ticker-normalizer.ts` as the single source. The `lib/utils.ts` version is a subset. The modal version should call the canonical one.

### 3.2 Duplicate UUID Validation Regex

Same regex copy-pasted in two routes:
- `app/api/playbooks/adopt/route.ts:13`
- `app/api/conversations/[id]/messages/route.ts:29`

```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
```

**Recommendation:** Extract to `lib/validation.ts` as `isValidUUID(id: string): boolean`.

### 3.3 `uuid` Package vs `crypto.randomUUID()`

Mixed usage:
- `app/api/upload/route.ts` — imports `uuid` package (`v4 as uuidv4`)
- `hooks/use-watchlist.ts`, `hooks/use-file-upload.ts` — use native `crypto.randomUUID()`

**Recommendation:** Remove `uuid` dependency. Replace the one `uuidv4()` call in upload route with `crypto.randomUUID()` (available in Node 19+ / all modern browsers). Saves a dependency.

### 3.4 Chat Input State Pattern (4 implementations)

Four components each independently manage chat input state:
- `components/chat/EducationChat.tsx` — `[input, setInput]`
- `components/marketing/HelpChat.tsx` — `[input, setInput]`
- `components/pelican-panel/pelican-chat-panel.tsx` — `[inputValue, setInputValue]`
- `components/marketing/HeroChatDemo.tsx` — `[inputText, setInputText]` (dead file)

The first three are live. Each has its own submit handler, enter-key listener, and clear-on-send logic.

**Recommendation:** Extract `useChatInput()` hook with shared submit/clear/keypress logic. The three components have different submit targets but identical input management. LOW priority — these are separate features with different backends.

### 3.5 Admin Auth Pattern (Consolidated — No Action Needed)

All 13 admin routes use `requireAdmin()` from `lib/admin.ts`. This is well-consolidated.

### 3.6 Supabase Client Creation (Consolidated — No Action Needed)

All client-side code uses `createClient()` from `lib/supabase/client.ts`. All server-side code uses `createClient()` from `lib/supabase/server.ts`. No duplicate patterns.

---

## 4. Dependency Cleanup

### Unused Dependencies (safe to remove)

| Package | Reason | Savings |
|---------|--------|---------|
| `next-intl` | Zero imports anywhere. Custom `useTranslation` hook is used instead. | ~150KB |
| `uuid` | Only 1 import (`upload/route.ts`). Replace with native `crypto.randomUUID()`. | ~10KB |

### Correctly Used Despite Appearing Unused

| Package | Why It Looks Unused | Actually Used By |
|---------|-------------------|------------------|
| `@emotion/is-prop-valid` | No direct imports | Optional peer dep of `framer-motion` (reduces prop forwarding warnings) |
| `@types/d3-hierarchy` | No direct imports | Type definitions for `d3-hierarchy` (used in heatmap treemap) |
| `tw-animate-css` | No TS imports | Imported via `@import "tw-animate-css"` in `globals.css` |

### Icon Library Migration Status

| Library | Import Count | Files |
|---------|-------------|-------|
| **Phosphor Icons** (`@phosphor-icons/react`) | 128 imports | Primary library |
| **Lucide React** (`lucide-react`) | 58 imports | 58 files still using it |

**Lucide files breakdown:**
- `components/ui/*` (7 files) — Radix UI primitives (sheet, dialog, checkbox, etc.) — these use Lucide for close/check icons baked into the Radix pattern
- `components/settings/*` (7 files) — settings page
- `components/admin/*` (6 files) — admin panel
- `components/chat/*` (10 files) — various chat sub-components
- `app/admin/*` (8 files) — admin pages
- `app/auth/*` (4 files) — auth pages
- `app/chat/page.client.tsx` (1 file)
- Misc: pricing, heatmap, command-k, credit display, etc.

**Recommendation:** Full Lucide→Phosphor migration is a ~2-3 hour effort. Prioritize `components/ui/*` (shared primitives) first, then pages. The `lucide-react` package can be removed after migration.

### `.env.example` Gaps

Present: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PEL_API_KEY`, `PEL_API_URL`, `SITE_URL`, `DEV_SUPABASE_REDIRECT_URL`, `FINNHUB_API_KEY`

**Missing (needed for full setup):**
- `OPENAI_API_KEY`
- `POLYGON_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_POWER_PRICE_ID`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `CRON_SECRET`
- `SENTRY_DSN` / `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_BACKEND_URL`

---

## 5. Repo Hygiene

### Dev Artifacts to Remove from Git

#### Root-level files (DELETE — no ongoing value)

| File | Lines | Action |
|------|-------|--------|
| `AUDIT_REPORT.md` | ~500 | DELETE — superseded by this audit |
| `flywheel-audit-prompt.md` | ~100 | DELETE — one-time prompt, not source code |
| `setup-env.sh` | 15 | DELETE — only writes `NEXT_PUBLIC_BACKEND_URL` |
| `setup-env.ps1` | 15 | DELETE — same as above |

#### `docs/archive/` (ARCHIVE or DELETE — historical only)

| File | Lines | Action |
|------|-------|--------|
| `CLAUDE.md.bak` | ~800 | DELETE — stale backup |
| `test-memory.html` | ~200 | DELETE — debug artifact |
| `FIXES_SUMMARY.txt` | ~300 | KEEP in archive — useful post-mortem reference |
| `MESSAGE_PASSING_AUDIT_REPORT.md` | ~500 | KEEP in archive |
| `PHASE_1_COMPLETE.md` | ~200 | KEEP in archive — project history |
| `PHASE_2_COMPLETE.md` | ~200 | KEEP in archive |
| `PHASE_3A_COMPLETE.md` | ~200 | KEEP in archive |
| `PRODUCTION_FIXES_SUMMARY.md` | ~400 | KEEP in archive |
| `SUBSCRIPTION_AUDIT_REPORT.md` | ~500 | KEEP in archive |
| `SUPABASE_FRONTEND_AUDIT_REPORT.md` | ~500 | KEEP in archive |
| `SUPABASE_RLS_AUDIT_REPORT.md` | ~600 | KEEP in archive |
| `UI_DIAGNOSTIC_REPORT.md` | ~300 | KEEP in archive |
| `V2_CODEBASE_AUDIT.md` | ~800 | KEEP in archive — but superseded by this audit |
| `V2_DESIGN_TOKENS.md` | ~200 | KEEP in archive — design tokens are in globals.css now |
| `V2_IMPLEMENTATION_COMPLETE.md` | ~300 | KEEP in archive |
| `V2_UI_STYLE_GUIDE.md` | ~400 | KEEP in archive |

#### OS/Editor Junk

| File | Action |
|------|--------|
| `app/.DS_Store` | DELETE from git (`git rm --cached`). Fix `.gitignore`: change `.DS_Store` to `**/.DS_Store` |

### AI Agent Directories

| Directory | Tracked in Git? | Status |
|-----------|----------------|--------|
| `.claude/` | Yes (2 files: cursor+iflow skills) | **ACTIVE** — keep |
| `.cursor/` | Yes (1 file: firecrawl skill) | **ACTIVE** — keep |
| `.iflow/` | Yes (1 file: firecrawl skill) | May be active — verify with team |
| `.adal/` through `.zencoder/` (25+ dirs) | **No** — already gitignored | Already handled — `.gitignore` lines 46-77 exclude them all |

**Status:** The gitignore already covers all 25+ AI tool directories. Only `.claude/`, `.cursor/`, and `.iflow/` have tracked files (3 total). No action needed unless `.iflow/` is unused, in which case add it to gitignore and `git rm --cached .iflow/`.

---

## 6. Estimated Impact

### Lines Removable

| Category | Lines | Files |
|----------|-------|-------|
| Dead/orphaned code | 2,133 | 15 files |
| Dev artifacts (root + archive deletable) | ~1,930 | 7 files |
| `uuid` dependency elimination | ~10 | 1 import change |
| Conversation sidebar time-group dedup | ~150 | 1 file (refactor) |
| trades-table desktop/mobile dedup | ~200 | 1 file (refactor) |
| **Total immediately deletable** | **~4,413** | **~23 files** |

### Refactoring Savings (estimated after splitting)

| Refactor | Current Lines | Estimated After | Savings |
|----------|--------------|----------------|---------|
| 11 oversized components → hooks + sub-components | 7,643 | ~6,200 | ~1,443 |
| normalizeTicker consolidation | 3 impls | 1 impl | ~80 |
| UUID regex dedup | 2 copies | 1 shared | ~10 |

### Summary

| Metric | Value |
|--------|-------|
| Dead files to delete | 15 files, 2,133 lines |
| Dev artifacts to clean | 7 files, ~1,930 lines |
| Components needing refactor | 11 (4 HIGH, 3 MEDIUM, 4 LOW) |
| Duplicate patterns to consolidate | 4 patterns |
| Unused npm packages | 2 (`next-intl`, `uuid`) |
| Lucide→Phosphor migration remaining | 58 files |
| `.gitignore` fixes needed | 1 (`.DS_Store` → `**/.DS_Store`) |
| **Total lines removable (no refactor)** | **~4,400** |
| **Total lines removable (with refactor)** | **~5,900** |
| **% of codebase** | **~7.2%** |
