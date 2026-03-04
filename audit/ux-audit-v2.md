# Pelican Trading AI — V2 UX Audit

**Date:** 2026-03-04
**Previous score:** 5.5/10 (Feb 17)
**Current score:** 7/10

---

## 1. Loading/Error Coverage

### Loading States (12/12 pages covered)

All feature pages have loading.tsx. All use skeleton/animate-pulse patterns (no spinners).

**Systemic issue:** All 12 files use hardcoded hex values (`#161616`, `#222`) instead of design tokens (`var(--bg-surface)`, `var(--bg-elevated)`). The `#161616` background doesn't match `--bg-base: #0a0a0f`, causing a visible flash on page load.

| Page | Has loading.tsx | Layout Match | Design Tokens | Quality |
|------|----------------|-------------|---------------|---------|
| `(features)` shared | Yes | Partial — generic, 4 elements | FAIL | Fair |
| `correlations` | Yes | Poor — single block vs matrix grid | FAIL | Poor |
| `earnings` | Yes | Good — filter pills + list rows | FAIL | Good |
| `heatmap` | Yes | Good — 4x8 tile grid | FAIL | Good |
| `journal` | Yes | Partial — missing stat cards | FAIL | Fair |
| `morning` | Yes | Good — 4 section blocks | FAIL | Good |
| `playbooks` | Yes | Good — 3-col card grid | FAIL | Good |
| `positions` | Yes | Good — 4 metric cards + content | FAIL | Good |
| `settings` | Yes | Excellent — sidebar + content split | FAIL | Best |
| `strategies` | Yes | Good — search + 3-col grid | FAIL | Good |
| `strategies/[slug]` | Yes | Good — detail page structure | FAIL | Good |
| `chat` | Yes | **Poor — main area is empty div** | FAIL | **Worst** |

### Error Boundaries (6 exist, 8 feature pages share 1 fallback)

| Scope | Has error.tsx | User Friendly | Retry Action | Sentry | Quality |
|-------|-------------|---------------|-------------|--------|---------|
| `(features)` shared | Yes | **NO — exposes raw error.message** | Yes (retry only) | No | **Poor** |
| `settings` | Yes | Yes | Yes | No | Fair |
| `chat` | Yes | Yes | Yes | No | Fair |
| `(marketing)` | Yes | Yes | Yes | No | Fair |
| `onboarding` | Yes | Yes | Yes (retry + skip-to-chat) | No | **Best** |
| `admin` | Yes | Yes | Yes | No | Poor |

**Missing per-page error.tsx:** correlations, earnings, heatmap, journal, morning, playbooks, positions, strategies (all fall back to the shared one that leaks `error.message`).

**Systemic issues:**
- 0/6 report to Sentry — production errors are invisible
- 5/6 use `console.error` in production (violates CLAUDE.md rule)
- `(features)/error.tsx` exposes raw `error.message` — security + UX risk
- No "Go home" secondary action (except onboarding) — if retry fails, user is stuck
- Off-design-system colors (`bg-blue-600`, `bg-background`)

---

## 2. Empty State Coverage

| View | Has Empty State | Quality | Notes |
|------|----------------|---------|-------|
| Journal page (zero trades) | Yes — dedicated `journal-empty-state.tsx` | **Excellent** | Feature list, 2 CTAs, Framer Motion stagger, design tokens |
| Trades table | Yes — two levels | Good | Global zero + per-filter zero. Plain text, no CTA |
| Dashboard charts | Yes — two levels | Good | "Log first trade" + "Close first trade to see charts" |
| Positions page (zero open) | Yes — dedicated `positions-empty-state.tsx` | Good | Feature list, 2 CTAs, stagger animation |
| Portfolio overview | Partial | Fair | Donut shows "No positions". Metric cards show zeros with no guidance |
| Correlations | Yes — three levels | **Excellent** | Zero, one-position (shows benchmarks), and loading states |
| Playbooks page | **Partial** | Fair | No dedicated full-page empty state. Individual tabs handle empty |
| Earnings | Yes — dedicated component | Good | Two states: no data + no filter matches |
| Morning brief | Yes — three states | Good | Pre-generate CTA, loading indicator, error state |
| Watchlist (sidebar) | **Unconfirmed** | Unknown | Not verified in audit |
| Insights charts | Yes | Fair | Conditional rendering but no "no data for this insight" message |

---

## 3. Mobile Responsiveness

**Infrastructure:**
- `useIsMobile()` hook exists (768px breakpoint via `matchMedia`)
- 361 responsive breakpoint class usages across components/app
- Chat sidebar renders in `<Sheet>` drawer on mobile
- Features layout uses `<Sheet>` for Pelican panel on mobile

**What works well:**
- `trades-table.tsx` — full mobile card view with `hidden md:block` / `md:hidden` split, 44px touch targets. Best mobile implementation.
- Journal/positions empty states — `flex-col sm:flex-row` button stacking
- Top nav — responsive with `useIsMobile()`
- Modals — use responsive max-width classes

**Issues:**

| Issue | Component | Severity |
|-------|-----------|----------|
| Chat skeleton is empty on mobile | `app/chat/loading.tsx` | HIGH — highest-traffic page |
| Correlation matrix unusable on mobile | `portfolio-correlations.tsx` | MEDIUM — horizontal scroll only for 6+ positions |
| No tablet detection | `use-mobile.ts` (768px only) | LOW — relies on Tailwind only for 768-1024px |
| Settings skeleton loses nav on mobile | `settings/loading.tsx` | LOW — layout flash |

---

## 4. Chat Integration Map

Two integration mechanisms exist:
1. **`router.push('/chat?prefill=...')`** — navigates to chat page with pre-filled prompt
2. **`openWithPrompt()` via `usePelicanPanelContext`** — opens Pelican side panel in-place (no page navigation)

| Feature | Integration | Mechanism | Works? |
|---------|------------|-----------|--------|
| **Strategies** — "Ask Pelican" button | Yes | `router.push('/chat?prefill=...')` | Yes |
| **Correlations** — pair detail panel | Yes | `openWithPrompt()` | Yes |
| **Correlations** — signal cards | Yes | `openWithPrompt()` | Yes |
| **Correlations** — portfolio overview | Yes | `openWithPrompt()` | Yes |
| **Playbooks** — detail view | Yes | `openWithPrompt()` | Yes |
| **Journal insights** — "Ask Pelican About This" | Yes | Buttons present (5 locations) | Yes |
| **Journal** — trader profile tab | Yes | "Ask Pelican to analyze" | Yes |
| **Watchlist** — "Ask Pelican" per ticker | Yes | `openWithPrompt()` | Yes |
| **Economic Calendar** | Yes | `openWithPrompt()` | Yes |
| **Command-K** ticker search | Yes | `openWithPrompt()` | Yes |
| **Heatmap** — click stock | **Not confirmed** | Not found in grep | **VERIFY** |
| **Earnings** — click row | **Not confirmed** | Not found in grep | **VERIFY** |
| **Morning brief** — "Discuss with Pelican" | **Not confirmed** | Not found in grep | **VERIFY** |
| **Positions** — health score ask | Yes | `portfolio-intelligence.tsx` | Yes |

**Note:** The `prefillChatMessage` utility mentioned in CLAUDE.md was not found as a shared function. Chat prefill uses two different mechanisms — `router.push` with query param (strategies) vs `openWithPrompt` context (everything else). This is intentional: strategies is a public page without the Pelican panel, while feature pages have the panel available.

---

## 5. Accessibility Issues

### Critical

| Issue | Impact | Scope |
|-------|--------|-------|
| **`--text-muted` (#5a5a6e) on `--bg-base` (#0a0a0f) = 3.2:1 ratio** | Fails WCAG AA (needs 4.5:1). Affects every table header, timestamp, label, caption. | Systemic — design token level |
| **`logo-img.tsx` — `<img>` without `alt`** | Every trade row and position card renders a ticker logo with no alt text. Screen readers announce nothing. | Every list/table with ticker logos |

### High

| Issue | Impact | Scope |
|-------|--------|-------|
| **Framer Motion animations ignore `prefers-reduced-motion`** | Stagger animations, y-axis translations fire even when user has motion sensitivity enabled. Framer Motion's `useReducedMotion()` hook is not used anywhere. | All animated pages (journal, positions, playbooks, correlations) |
| **~15 icon-only buttons lack `aria-label`** | Journal insights, trade replay controls, log-trade-modal increment/decrement buttons are invisible to screen readers. | Journal module primarily |

### Medium

| Issue | Files |
|-------|-------|
| `share-card-preview-modal.tsx` — `<img>` without `alt` or `next/image` | 1 file |
| Only 43 `aria-*` attributes across entire `components/` directory | Low for an app of this interactive density |
| CSS `prefers-reduced-motion` only covers 3 rules in globals.css — most motion is Framer Motion (JS) | Partial coverage |

---

## 6. Priority Fixes

### P0 — Fix Before Launch

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | **Fix `--text-muted` contrast** — lighten to `#7a7a8e` or similar (4.5:1 on `#0a0a0f`) | 5 min | Every page — systemic WCAG failure |
| 2 | **Add `alt` to `logo-img.tsx`** — `alt={ticker}` or `alt=""` for decorative | 5 min | Every trade/position list |
| 3 | **Stop exposing `error.message` in `(features)/error.tsx`** — use generic message | 10 min | Security + UX |
| 4 | **Fix chat loading skeleton** — add message bubbles + input bar placeholder | 20 min | Highest-traffic page |

### P1 — Fix This Sprint

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 5 | **Add Sentry to all 6 error boundaries** — `Sentry.captureException(error)` | 30 min | Production error visibility |
| 6 | **Replace hardcoded hex in 12 loading files** with design tokens | 1 hr | Eliminates background flash on every page load |
| 7 | **Add `useReducedMotion()` gate** to Framer Motion stagger variants | 1 hr | Accessibility — motion sensitivity |
| 8 | **Add `aria-label` to icon-only buttons** in journal module (~15 buttons) | 30 min | Screen reader users |
| 9 | **Add "Go to Chat" secondary action** to error boundaries | 20 min | Users stuck on retry-fail |
| 10 | **Remove `console.error` from error boundaries** — replaced by Sentry | 15 min | CLAUDE.md compliance |

### P2 — Post-Launch

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 11 | Add per-page error.tsx to 8 feature pages (or improve shared fallback) | 2 hr | Better error context |
| 12 | Add full-page empty state for playbooks | 30 min | New user experience |
| 13 | Add mobile-alternative for correlation matrix (card layout for >4 positions) | 2 hr | Mobile usability |
| 14 | Verify heatmap/earnings/morning chat integration points | 30 min | "Chat is the Hub" principle |
| 15 | DRY `journal-empty-state.tsx` + `positions-empty-state.tsx` into shared component | 30 min | Code quality |
| 16 | Upgrade correlations loading skeleton to match matrix layout | 20 min | Loading quality |

---

## Score Breakdown

| Category | Previous (Feb 17) | Current | Notes |
|----------|-------------------|---------|-------|
| Loading states | 3/10 | 7/10 | All pages covered, but hardcoded colors + poor chat skeleton |
| Error handling | 2/10 | 5/10 | Boundaries exist but leak errors, no Sentry, no escape hatch |
| Empty states | 5/10 | 8/10 | Excellent journal/positions/correlations. Playbooks gap. |
| Mobile | 6/10 | 7/10 | Trades table excellent. Correlation matrix problem. |
| Chat integration | 7/10 | 8/10 | Strong `openWithPrompt` pattern. 3 unverified points. |
| Accessibility | 3/10 | 4/10 | Systemic contrast failure. Missing alts. No reduced-motion. |
| **Overall** | **5.5/10** | **7/10** | Significant progress. P0 fixes would push to 8+. |
