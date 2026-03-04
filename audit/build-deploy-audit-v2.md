# Pelican Trading AI — V2 Build & Deploy Audit

**Date:** 2026-03-04
**Build tool:** Next.js 14.2.35
**Target:** Vercel (iad1)

---

## 1. Build Status: PASS

```
npm run build → exit code 0
TypeScript errors: 0
ESLint errors: 0
ESLint warnings: 38 (non-blocking)
Static pages generated: 63/63
```

### Warning Breakdown

| Category | Count | Severity | Action |
|----------|-------|----------|--------|
| `@typescript-eslint/no-unused-vars` | 18 | LOW | Clean up unused imports/vars |
| `react-hooks/exhaustive-deps` | 7 | MEDIUM | Fix dep arrays or suppress intentionally |
| `@next/next/no-img-element` | 1 | LOW | `logo-img.tsx` uses `<img>` for dynamic ticker logos — acceptable |
| Webpack cache serialization | 3 | INFO | Cosmetic, no impact |
| Supabase Edge Runtime | 2 | INFO | Known `@supabase/realtime-js` using `process.versions` — harmless, runs in Node serverless functions |
| Sentry deprecation | 2 | LOW | `disableLogger` and `automaticVercelMonitors` — update to new Sentry config keys |

### Build-Time Noise (Not Errors)

Admin API routes log "Dynamic server usage" errors during static generation because they use `cookies()`. These are **expected** — Next.js attempts to statically render all routes during build, and routes that use cookies correctly bail out to dynamic rendering (marked with `ƒ` in output). This is working as designed.

Rate limiter logs 28 "UPSTASH_REDIS_REST_URL not set" messages during build. This is **expected** — the build environment doesn't have Redis credentials, and the rate limiter fails CLOSED (denies all) which is the safe behavior.

### ESLint Warnings to Fix (Quick Wins)

**Unused imports/vars (18 files):**

| File | Unused |
|------|--------|
| `heatmap/page.tsx:200` | `market` |
| `morning/page.tsx:310` | `isMarketOpen` |
| `playbooks/page.tsx:62` | `mutate` |
| `admin/conversations/[id]/page.tsx:3` | `useCallback` |
| `admin/conversations/route.ts:3` | `ConvoTag` |
| `stripe/webhook/route.ts:4` | `getPlanByPriceId`, `PLAN_CREDITS` |
| `conversation-sidebar.tsx:52` | `ConversationClass` |
| `conversation-sidebar.tsx:235` | `router` |
| `message-content.tsx:6` | `LabelValueTableResult` |
| `message-action-bar.tsx:12` | `isDestructiveAction` |
| `trading-context-panel.tsx:225` | `showCalendar` |
| `pair-detail-panel.tsx:11` | `getStrengthLabel` |
| `signal-cards.tsx:49` | `beginnerMode` |
| `performance-tab.tsx:12` | `PelicanButton` |
| `trade-detail-panel.tsx:7` | `DataCell` |
| `trader-profile-tab.tsx:22` | `BehavioralInsight`, `MilestoneProgress` |
| `strategy-showcase.tsx:163-164` | `VISIBLE_DESKTOP`, `VISIBLE_TABLET` |
| `news-headlines.tsx:5` | `cn` |
| `position-list.tsx:48` | `onLogTrade` |
| `positions-empty-state.tsx:69` | `Icon` |
| `confirm-destructive-action.tsx:4-5` | `motion`, `AnimatePresence`, `XCircle` |
| `interpret.ts:155` | `std` |
| `behavioral-analysis.ts:2` | `InsightCategory` |

**Estimated fix time:** 30 minutes for all 18 files.

---

## 2. Environment Variable Matrix

### All Variables Referenced in Code

| Variable | Required | Where Used | .env.example Status |
|----------|----------|-----------|---------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Required** | Auth, DB queries, middleware | Present |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Required** | Auth, DB queries, middleware | Present |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required** | Admin routes, webhooks | Present (as `SUPABASE_URL` duplicate entry + key) |
| `PEL_API_KEY` | **Required** | Backend API auth (chat streaming, regenerate) | Present |
| `OPENAI_API_KEY` | **Required** | Education chat, help chat, title generation | **MISSING** |
| `POLYGON_API_KEY` | **Required** | All market data routes (heatmap, candles, movers, quotes, sparklines, IPOs, earnings) | **MISSING** |
| `STRIPE_SECRET_KEY` | **Required** | Checkout, billing portal, webhook | **MISSING** |
| `STRIPE_WEBHOOK_SECRET` | **Required** | Webhook signature verification | **MISSING** |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | **Required** | Pricing page, checkout | **MISSING** |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | **Required** | Pricing page, checkout | **MISSING** |
| `NEXT_PUBLIC_STRIPE_POWER_PRICE_ID` | **Required** | Pricing page, checkout | **MISSING** |
| `UPSTASH_REDIS_REST_URL` | **Required** | Rate limiting (25 routes) | **MISSING** |
| `UPSTASH_REDIS_REST_TOKEN` | **Required** | Rate limiting (25 routes) | **MISSING** |
| `CRON_SECRET` | **Required** | Cron job auth (`/api/cron/correlations`) | **MISSING** |
| `FINNHUB_API_KEY` | **Required** | Earnings data | Present |
| `NEXT_PUBLIC_APP_URL` | **Required** | Stripe redirect URLs, OG meta | In vercel.json only |
| `NEXT_PUBLIC_BACKEND_URL` | Optional | Fly.io backend (has hardcoded fallback `pelican-backend.fly.dev`) | **MISSING** |
| `RESEND_API_KEY` | Optional | Email sending (if enabled) | **MISSING** |

**Status: 11 of 17 required variables missing from .env.example.**

Also present in .env.example but not found in code:
- `SUPABASE_URL` — duplicate of `NEXT_PUBLIC_SUPABASE_URL` (the server code uses `NEXT_PUBLIC_SUPABASE_URL` directly)
- `PEL_API_URL` — not referenced; backend URL uses `NEXT_PUBLIC_BACKEND_URL` instead
- `NEXT_PUBLIC_SITE_URL` — not referenced; code uses `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` — not referenced in current code

---

## 3. Vercel Configuration Issues

### 3.1 Region Mismatch

| Service | Region |
|---------|--------|
| Vercel functions | `iad1` (us-east-1, N. Virginia) |
| Supabase | `us-east-2` (Ohio) |
| Fly.io backend | Unknown — check `fly.toml` |

**Impact:** ~5-10ms additional latency on Supabase calls due to cross-region. For a trading platform where latency matters, this is worth noting.

**Recommendation:** Either move Vercel to `cle1` (us-east-2 equivalent) or confirm Supabase latency is acceptable. New Supabase projects can't change region after creation, so Vercel should adapt.

### 3.2 Function Memory (1024MB Everywhere)

```json
"app/api/**/*.ts": { "memory": 1024, "maxDuration": 10 }
```

This sets ALL API routes to 1024MB. Most routes (health checks, CRUD, ticker search) would work fine at 256MB or 512MB.

**Impact:** Higher memory = higher cost on Vercel Pro plan. At scale, 1024MB × 49 routes × request volume adds up.

**Recommendation:** Set the default to 512MB, and only keep 1024MB for:
- `help-chat` (OpenAI streaming)
- `messages/[id]/regenerate` (backend streaming)
- `upload` (file processing)
- `stripe/webhook` (complex processing)
- `correlations/calculate` (heavy math)
- `cron/correlations` (heavy math)

### 3.3 maxDuration Settings

| Route Pattern | maxDuration | Assessment |
|---------------|------------|------------|
| `correlations/calculate` | 60s | Correct — heavy computation |
| `cron/correlations` | 60s | Correct — batch processing |
| `help-chat` | 30s | Correct — OpenAI streaming |
| `messages/[id]/regenerate` | 30s | Correct — backend streaming |
| `upload` | 30s | Correct — file upload |
| `stripe/webhook` | 30s | Correct — webhook processing |
| Everything else | 10s | **Potentially tight** for `education-chat` (OpenAI streaming) |

**Recommendation:** Add `education-chat` to the 30s tier — it streams from OpenAI just like `help-chat`.

### 3.4 Cron Job Protection

```json
"crons": [
  { "path": "/api/cron/correlations", "schedule": "0 14 * * 1-5" },
  { "path": "/api/cron/correlations", "schedule": "0 23 * * 1-5" }
]
```

The route checks `CRON_SECRET` via Bearer token. Vercel crons automatically include the `CRON_SECRET` header. **Protected correctly.**

However, the route is also accessible via direct HTTP if someone guesses the URL and `CRON_SECRET` is weak. Recommend ensuring `CRON_SECRET` is a strong random string (32+ characters).

### 3.5 No-Op Rewrite

```json
"rewrites": [{ "source": "/api/:path*", "destination": "/api/:path*" }]
```

This maps API routes to themselves — a literal no-op. **Safe to remove.** It adds a tiny amount of routing overhead on every API request.

### 3.6 Hardcoded `NEXT_PUBLIC_APP_URL` in vercel.json

```json
"env": { "NEXT_PUBLIC_APP_URL": "https://pelicantrading.ai" }
```

This means staging deployments on `pelicantrading.org` will have Stripe redirect users to `pelicantrading.ai` after checkout. Preview deployments will also use the production URL.

**Recommendation:** Remove from `vercel.json` and set per-environment in the Vercel dashboard:
- Production: `https://pelicantrading.ai`
- Preview/Staging: `https://pelicantrading.org`

Or use `VERCEL_URL` with a fallback:
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`
```

---

## 4. Bundle Report

### Page Sizes (First Load JS)

| Page | Size | First Load JS | Assessment |
|------|------|--------------|------------|
| `/positions` | 41 kB | **511 kB** | HEAVY — largest page |
| `/playbooks` | 34.2 kB | **503 kB** | HEAVY |
| `/chat` | 97.5 kB | **492 kB** | Expected — main feature, many dynamic imports |
| `/correlations` | 33.7 kB | 469 kB | Acceptable — charting |
| `/morning` | 39.8 kB | 440 kB | Acceptable — streaming + charts |
| `/strategies/[slug]` | 16.1 kB | 438 kB | OK |
| `/journal` | 25.1 kB | 397 kB | OK |
| `/heatmap` | 21 kB | 349 kB | OK |
| `/earnings` | 19.2 kB | 350 kB | OK |
| Shared (all pages) | — | **204 kB** | HEAVY baseline |

### Largest Chunks

| Chunk | Size (raw) | Likely Contents |
|-------|-----------|----------------|
| `9753-*.js` | 359 kB | Shared framework (React, Radix, Framer Motion) |
| `3541-*.js` | 301 kB | recharts + d3 |
| `fd9d1056-*.js` | 169 kB | Supabase client |
| `6188-*.js` | 137 kB | Feature code (positions/playbooks) |
| `framework-*.js` | 137 kB | React framework |
| `main-*.js` | 132 kB | Next.js runtime |
| `52774a7f-*.js` | 116 kB | Framer Motion |
| `6677-*.js` | 111 kB | Feature code |
| `polyfills-*.js` | 110 kB | Polyfills |

### Dynamic Import Opportunities

**Already dynamically loaded (good):**
- TradingView widgets (`ssr: false`)
- EconomicCalendar, LogTradeModal, CloseTradeModal, SettingsModal
- TrialExhaustedModal, InsufficientCreditsModal
- TradingContextPanel, TextSelectionToolbar
- HelpChat, LandingPageClient, StrategyBrowse

**Should be dynamically loaded:**

| Import | Files | Size Impact |
|--------|-------|-------------|
| `recharts` | `dashboard-tab.tsx`, `holding-period-chart.tsx`, `time-of-day-chart.tsx` | ~300 kB (the `3541-*.js` chunk) — only loaded on journal/insights pages, but currently static import |
| `framer-motion` | 20+ feature pages | ~116 kB — tree-shakes well, but some pages import `AnimatePresence` without using it |
| `stripe` | 3 API routes | Server-only, no client bundle impact — OK |

**Key recommendation:** The `recharts` imports in `dashboard-tab.tsx` and insight chart components could use `next/dynamic` with `ssr: false` since charts are client-only. This would reduce the initial JS for `/journal` by ~300 kB.

### 204 kB Shared Baseline

Every page loads 204 kB of shared JS before any page-specific code. This includes:
- React + React DOM (~137 kB)
- Framer Motion core (~37 kB)
- Supabase client (~24 kB)
- Next.js runtime (~4 kB)

This is within acceptable range for a complex SPA but on the heavier side. The Framer Motion chunk could be reduced by importing specific modules (`framer-motion/dom`) instead of the full package, but this is a LOW priority optimization.

---

## 5. SEO Checklist

### Metadata Coverage

| Page | Has Metadata | Title | Description | OG |
|------|-------------|-------|------------|-----|
| `/` (landing) | YES | YES | YES | YES (JSON-LD + OG) |
| `/pricing` | YES | YES | YES | YES (JSON-LD) |
| `/faq` | YES | YES | YES | YES (JSON-LD) |
| `/how-to-use` | YES | YES | YES | Inherits from marketing layout |
| `/guide` | YES | YES | YES | Inherits |
| `/privacy` | YES | YES | YES | Inherits |
| `/terms` | YES | YES | YES | Inherits |
| `/strategies` | YES | YES | YES | Inherits |
| `/strategies/[slug]` | YES | Dynamic (`generateMetadata`) | Dynamic | Dynamic |
| `/chat` | YES | YES | YES | Inherits |
| `/correlations` | YES | YES | YES | Inherits |
| `/settings` | YES | YES | YES | Inherits |
| `/auth/*` | YES | Via layout | Via layout | Inherits |
| `/admin/*` | YES | Via layout | Via layout | Inherits |
| `/profile` | YES | Via layout | Via layout | Inherits |
| **`/earnings`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/heatmap`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/journal`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/morning`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/playbooks`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/positions`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/onboarding`** | **NO** | Uses template only | **MISSING** | **MISSING** |
| **`/accept-terms`** | **NO** | Uses template only | **MISSING** | **MISSING** |

**8 pages missing metadata.** The 6 feature pages (`/earnings`, `/heatmap`, `/journal`, `/morning`, `/playbooks`, `/positions`) get the template title from root layout ("Page Name | Pelican Trading") via the `%s` template, but have no explicit page title, description, or OG tags. These are behind auth so SEO impact is minimal, but it affects link previews when shared.

### OG Image
- `/public/og-image.png` exists (34.7 kB, properly sized)
- Referenced in root layout: `images: [{ url: '/og-image.png', width: 1200, height: 630 }]`
- Twitter card: `summary_large_image` with `@PelicanAI_` site handle

### robots.txt
```
Allow: /
Disallow: /auth/, /admin/, /chat/, /settings/, /profile/, /api/, /accept-terms/
```
**Correct** — all protected and app routes blocked. Marketing pages crawlable.

### sitemap.xml
Includes: `/`, `/pricing`, `/faq`, `/how-to-use`, `/strategies`, `/guide`, `/privacy`, `/terms`

**Missing from sitemap but should be included:**
- Individual strategy pages (`/strategies/[slug]`) — these are public, SEO-valuable pages that should use `generateSitemaps()` to enumerate all published strategies from the database

---

## 6. Header Conflicts (next.config.mjs vs vercel.json)

### How Vercel Processes Headers

On Vercel, headers from **both** `vercel.json` and `next.config.mjs` are applied. When both define the same header for the same path, **`next.config.mjs` wins** (it runs later in the pipeline). However, `vercel.json` headers are applied at the CDN edge layer, while `next.config.mjs` headers are applied at the origin.

### Specific Conflicts

| Header | next.config.mjs | vercel.json | Winner | Issue |
|--------|----------------|-------------|--------|-------|
| `X-Frame-Options` | `DENY` (all except `/demos/*`) | `SAMEORIGIN` (`/demos/*` only) | Both correct | **INTENTIONAL** — demos embeddable on same origin, everything else DENY |
| `Referrer-Policy` | `origin-when-cross-origin` | `strict-origin-when-cross-origin` | next.config wins for non-demo paths | **MISMATCH** — vercel.json's `strict-origin-when-cross-origin` is actually stricter and more standard. next.config's version sends the full URL origin to same-origin requests and only origin to cross-origin, while vercel.json's version sends origin to same-origin HTTPS and nothing on downgrade |
| `X-Content-Type-Options` | `nosniff` | `nosniff` | Both | **REDUNDANT** — remove from vercel.json |
| `X-XSS-Protection` | `1; mode=block` | `1; mode=block` | Both | **REDUNDANT** — remove from vercel.json |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | `camera=(), microphone=(), geolocation=()` | Both | **REDUNDANT** — remove from vercel.json |
| `Strict-Transport-Security` | Present | **MISSING** | next.config only | OK — Vercel adds HSTS automatically for all *.vercel.app and custom domains |
| `Content-Security-Policy` | Present (full CSP) | **MISSING** | next.config only | OK — CSP is complex enough it should only live in one place |
| `Cache-Control` (API) | Not set | `no-store, must-revalidate` | vercel.json | **GOOD** — prevents caching of API responses |
| `Cache-Control` (static) | Not set | `public, max-age=31536000, immutable` | vercel.json | **GOOD** — aggressive caching for static assets |

### Recommendation

**Consolidate to next.config.mjs** for security headers. Keep vercel.json only for:
- Cache-Control rules (CDN-level, appropriate for vercel.json)
- `/demos/*` X-Frame-Options override (if still needed)

Remove from vercel.json `/(.*)`  block:
- `X-Content-Type-Options` (redundant)
- `X-XSS-Protection` (redundant)
- `Referrer-Policy` (conflicts — standardize on `strict-origin-when-cross-origin` in next.config.mjs)
- `Permissions-Policy` (redundant)

Update next.config.mjs:
- Change `Referrer-Policy` to `strict-origin-when-cross-origin` (more standard, stricter)

---

## 7. Updated .env.example

See separate file: `.env.example` (updated in place).

---

## Summary

### Deploy Blockers: NONE

The build passes clean. Zero TypeScript errors, zero ESLint errors. The app is deployable.

### Pre-Deploy Recommendations (in priority order)

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | Update `.env.example` with all 17 vars | 10 min | Developer onboarding |
| 2 | Remove no-op rewrite from vercel.json | 1 min | Cleanliness |
| 3 | Fix `NEXT_PUBLIC_APP_URL` hardcoding for staging | 5 min | Staging broken Stripe redirects |
| 4 | Add `education-chat` to 30s maxDuration tier | 1 min | Prevents timeout on OpenAI streaming |
| 5 | Add metadata to 6 feature pages | 30 min | Link preview quality |
| 6 | Clean up 18 unused import warnings | 30 min | Code hygiene |
| 7 | Consolidate headers to next.config.mjs | 15 min | Remove conflicts |
| 8 | Add dynamic strategies to sitemap | 1 hr | SEO for public strategy pages |
| 9 | Consider region alignment (Vercel iad1 vs Supabase us-east-2) | Research | Latency |
| 10 | Dynamic import recharts in journal | 30 min | -300 kB on journal page |
