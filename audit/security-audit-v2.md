# Pelican Trading AI — V2 Security Audit

**Date:** 2026-03-04
**Scope:** 49 API routes, 17 dangerouslySetInnerHTML usages, CSP/headers, secrets, error leakage
**Auditor:** Claude Code (automated + manual trace)

---

## 1. Route-by-Route Table

### Legend
- **Auth**: `getUser()` = Supabase in-handler auth, `admin` = admin role check, `CRON_SECRET` = bearer token, `webhook` = Stripe signature, `IP RL` = IP-based rate limit only, `NONE` = no in-handler auth
- **RL**: Rate limited via `lib/rate-limit.ts` (Upstash Redis)
- **Err Safe**: Catches don't leak `error.message` to client (uses NODE_ENV guard or generic message)
- **Cost**: External paid API calls or database writes

| # | Route | Auth | RL | Err Safe | Cost/Risk | Verdict |
|---|-------|------|----|----------|-----------|---------|
| 1 | `/api/admin/analytics` | admin | No | Yes | None | SAFE |
| 2 | `/api/admin/content` | admin | No | Yes | None | SAFE |
| 3 | `/api/admin/conversations/[id]/full` | admin | No | Yes | None | SAFE |
| 4 | `/api/admin/conversations/[id]/messages` | admin | No | Yes | None | SAFE |
| 5 | `/api/admin/conversations` | admin | No | Yes | None | SAFE |
| 6 | `/api/admin/features` | admin | No | Yes | None | SAFE |
| 7 | `/api/admin/health` | admin | No | Yes | None | SAFE |
| 8 | `/api/admin/revenue` | admin | No | Yes | None | SAFE |
| 9 | `/api/admin/stats` | admin | No | Yes | None | SAFE |
| 10 | `/api/admin/users/[id]/credits` | admin | No | Yes | Supabase write | SAFE |
| 11 | `/api/admin/users/[id]/detail` | admin | No | Yes | None | SAFE |
| 12 | `/api/admin/users/[id]/grant-credits` | admin | No | Yes | Supabase write | SAFE |
| 13 | `/api/admin/users` | admin | No | Yes | None | SAFE |
| 14 | `/api/brief/movers` | getUser() | Yes | Yes | Polygon, Supabase write | SAFE |
| 15 | `/api/candles` | getUser() | Yes | Yes | Polygon | SAFE |
| 16 | `/api/conversations/[id]/generate-title` | getUser() | Yes | Yes | OpenAI, Supabase write | SAFE |
| 17 | `/api/conversations/[id]/messages` | getUser() | Yes | Yes | None | SAFE |
| 18 | `/api/conversations/[id]` | getUser() | No | Yes | Supabase write | LOW RISK |
| 19 | `/api/conversations` | getUser() | No | Yes | Supabase write | LOW RISK |
| 20 | `/api/correlations/calculate` | admin | No | **No** | Supabase write | **NEEDS FIX** |
| 21 | `/api/correlations/matrix` | getUser() | Yes | **No** | None | **NEEDS FIX** |
| 22 | `/api/correlations/pair` | getUser() | Yes | **No** | None | **NEEDS FIX** |
| 23 | `/api/cron/correlations` | CRON_SECRET | No | **No** | Supabase write | **NEEDS FIX** |
| 24 | `/api/earnings` | getUser() | Yes | Yes | Supabase write | SAFE |
| 25 | `/api/economic-calendar` | getUser() | Yes | Yes | Supabase write | SAFE |
| 26 | `/api/education-chat` | getUser() | Yes | Yes | OpenAI | SAFE |
| 27 | `/api/grade-trade` | getUser() | Yes | Yes | Supabase write | SAFE |
| 28 | `/api/health` | NONE | No | N/A | None | SAFE |
| 29 | `/api/heatmap/crypto` | getUser() | Yes | Yes | Polygon, Supabase write | SAFE |
| 30 | `/api/heatmap/forex` | getUser() | Yes | Yes | Polygon, Supabase write | SAFE |
| 31 | `/api/heatmap` | getUser() | Yes | Yes | Polygon, Supabase write | SAFE |
| 32 | `/api/help-chat` | IP RL | Yes | Yes | OpenAI | SAFE |
| 33 | `/api/ipos` | getUser() | Yes | Yes | Polygon | SAFE |
| 34 | `/api/market-data` | getUser() | Yes | Yes | Polygon | SAFE |
| 35 | `/api/market/pulse` | getUser() | Yes | Yes | Polygon | SAFE |
| 36 | `/api/market/quotes` | getUser() | Yes | Yes | Polygon | SAFE |
| 37 | `/api/market/sparklines` | getUser() | Yes | Yes | Polygon | SAFE |
| 38 | `/api/messages/[id]/regenerate` | getUser() | Yes | Yes | Supabase write | SAFE |
| 39 | `/api/movers/crypto` | getUser() | Yes | Yes | Polygon | SAFE |
| 40 | `/api/movers/forex` | getUser() | Yes | Yes | Polygon | SAFE |
| 41 | `/api/playbooks/adopt` | getUser() | **No** | Yes | Supabase write | **NEEDS FIX** |
| 42 | `/api/share-card` | getUser() (GET only) | **No** | **No** | None | **NEEDS FIX** |
| 43 | `/api/strategies/[slug]` | NONE | No | Yes | None | LOW RISK |
| 44 | `/api/strategies` | NONE | **No** | **No** | None | **NEEDS FIX** |
| 45 | `/api/stripe/billing-portal` | getUser() | **No** | Yes | Stripe | **NEEDS FIX** |
| 46 | `/api/stripe/create-checkout` | getUser() | Yes | Yes | Stripe | SAFE |
| 47 | `/api/stripe/webhook` | webhook | No | Yes | Stripe, Supabase write | SAFE |
| 48 | `/api/tickers/search` | getUser() | Yes | Yes | Polygon | SAFE |
| 49 | `/api/upload` | getUser() | Yes | Yes | Supabase write | SAFE |

### Summary
- **SAFE:** 37 routes
- **LOW RISK:** 3 routes (auth via middleware, missing rate limit on low-cost ops)
- **NEEDS FIX:** 9 routes

### Notes on middleware auth
All non-public API routes get middleware-level auth via `lib/supabase/middleware.ts` → `updateSession()` which calls `getUser()` and returns 401 for unauthenticated requests. Public routes (bypassing middleware auth): `/api/health`, `/api/help-chat`, `/api/stripe/webhook`, `/api/strategies`, `/api/share-card`.

The middleware fails CLOSED on Supabase errors (redirects to login). The rate limiter fails CLOSED when Redis is unavailable (denies all).

---

## 2. XSS Findings (dangerouslySetInnerHTML)

### Sanitization Infrastructure
- **`lib/sanitize.ts`**: Custom utility with `escapeHtml()`, `sanitizeMessage()`, `sanitizeUrl()`. Does NOT use DOMPurify.
- **`isomorphic-dompurify`**: In `package.json` (`^2.29.0`). Actively imported in:
  - `components/chat/message/format-utils.ts` — all `formatLine()` output passes through `DOMPurify.sanitize()` with strict `ALLOWED_TAGS`
  - `components/marketing/HelpChat.tsx` — wraps `formatMessage()` output
  - `lib/glossary/term-matcher.ts` — `applyLearningHighlights()` output
- **`formatLine()`**: Key shared function. Calls `escapeHtml()` first, applies markdown transforms, then `DOMPurify.sanitize()` with allowlisted tags. Any code path using it is sanitized.

### Findings

| # | File:Line | Source | User Data? | Sanitized? | Risk |
|---|-----------|--------|------------|------------|------|
| 1 | `components/chat/EducationChat.tsx:183` | User chat messages | **YES** | **NO** | **CRITICAL** |
| 2 | `components/chat/message/message-content.tsx:234` | AI postText fallback | No (AI) | **NO** | **HIGH** |
| 3 | `components/marketing/HelpChat.tsx:254` | User chat messages | YES | Partial (DOMPurify default config) | **MEDIUM** |
| 4 | `components/morning/interactive-brief.tsx:196` | AI streaming content | No (AI) | Yes (formatLine/DOMPurify per-line) | MEDIUM |
| 5 | `components/morning/interactive-brief.tsx:307` | AI brief intro | No (AI) | Yes (2x DOMPurify layers) | MEDIUM |
| 6 | `components/morning/interactive-brief.tsx:356` | AI brief sections | No (AI) | Yes (2x DOMPurify layers) | MEDIUM |
| 7 | `components/chat/message/text-segment.tsx:134` | AI assistant messages | No (AI) | Yes (formatLine/DOMPurify) | MEDIUM |
| 8 | `components/admin/RecentConversations.tsx:325` | Admin — assistant msgs | No | Yes (formatLine/DOMPurify) | LOW |
| 9 | `components/admin/UserDetail.tsx:114` | Admin — assistant msgs | No | Yes (formatLine/DOMPurify) | LOW |
| 10 | `app/admin/conversations/[id]/page.tsx:185` | Admin — assistant msgs | No | Yes (formatLine/DOMPurify) | LOW |
| 11 | `app/admin/conversations/page.tsx:139` | Admin — assistant msgs | No | Yes (formatLine/DOMPurify) | LOW |
| 12 | `app/(marketing)/faq/page.tsx:72` | Hardcoded JSON-LD | No | N/A (static) | SAFE |
| 13 | `app/(marketing)/page.tsx:58` | Hardcoded JSON-LD | No | N/A (static) | SAFE |
| 14 | `app/(marketing)/page.tsx:64` | Hardcoded JSON-LD | No | N/A (static) | SAFE |
| 15 | `app/layout.tsx:56` | Hardcoded theme script | No | N/A (static) | SAFE |
| 16 | `app/pricing/page.tsx:69` | Hardcoded JSON-LD | No | N/A (static) | SAFE |

### Detail on Critical/High Findings

**CRITICAL — `EducationChat.tsx:183`**
```tsx
// VULNERABLE: user messages rendered as raw HTML
__html: msg.type === 'bot' ? formatMarkdown(msg.content) : msg.content
```
User-typed messages are injected directly into `__html` with zero sanitization. `<img src=x onerror=alert(document.cookie)>` would execute. Self-XSS (user attacking themselves) has low direct impact, but if education chat history is ever shared, displayed in admin, or persisted to DB and rendered elsewhere, this becomes stored XSS.

**Fix:** Render user messages as plain text React nodes, or wrap in `DOMPurify.sanitize(msg.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true })`.

**HIGH — `message-content.tsx:234`**
```tsx
// VULNERABLE: AI postText fallback — no DOMPurify
dangerouslySetInnerHTML={{ __html: labelValueData.postText.replace(/\n/g, '<br/>') }}
```
The `postText` from AI responses is rendered with only `\n→<br/>` replacement. If the AI is prompt-injected into producing HTML, it executes here. The primary rendering path (when `postSegments.length > 0`) uses `TextSegment` which IS sanitized — this is only the fallback branch.

**Fix:** Run through `formatLine()` per line:
```tsx
__html: labelValueData.postText.split('\n').map(line => formatLine(line)).join('<br/>')
```

**MEDIUM — `HelpChat.tsx:254`**
```tsx
// WEAK: DOMPurify with default (permissive) config for user messages
__html: DOMPurify.sanitize(msg.type === 'bot' ? formatMessage(msg.content) : msg.content)
```
DOMPurify default config allows broad tags (`<img>`, `<form>`, `<input>`, `<video>`, etc.) which enable UI redressing. This is a public-facing, unauthenticated chat widget.

**Fix:** Restrict user messages: `DOMPurify.sanitize(msg.content, { ALLOWED_TAGS: [], KEEP_CONTENT: true })`

---

## 3. Error Leakage

Routes that return raw `error.message` to clients without the `NODE_ENV` guard:

| Route | Pattern | Risk |
|-------|---------|------|
| `/api/correlations/calculate` | `return NextResponse.json({ error: message }, { status: 500 })` | MEDIUM — admin-only, but leaks Supabase internals |
| `/api/correlations/matrix` | `correlations.error?.message` leaked in 500 | MEDIUM — user-facing |
| `/api/correlations/pair` | `pairData.error.message` leaked in 500 | MEDIUM — user-facing |
| `/api/cron/correlations` | `error.message` in 500 response | LOW — cron-only, but response visible in Vercel logs |
| `/api/share-card` | `error.message` in POST error response | MEDIUM — public endpoint |
| `/api/strategies` | `error.message` in 500 | MEDIUM — public endpoint |

### Routes with correct pattern (for reference)
```typescript
// GOOD — conversations/route.ts, conversations/[id]/route.ts, messages/[id]/regenerate/route.ts
details: process.env.NODE_ENV === 'production' ? undefined : (error instanceof Error ? error.message : "Unknown error")

// GOOD — stripe/create-checkout/route.ts, stripe/billing-portal/route.ts
error: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : error.message
```

**Why this matters:** Raw error messages can expose database schema, table names, RLS policy details, API key formats, and internal service URLs. Attackers use these to map the backend.

---

## 4. Secrets & Configuration

### Hardcoded Secrets: NONE FOUND
No `sk_live`, `sk_test`, `service_role`, or real JWT tokens in source code.

### JWT Placeholder in `lib/supabase/client.ts`
```typescript
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.signature"
```
**SAFE** — Decodes to `{"alg":"HS256","typ":"JWT"}` + literal `placeholder` + literal `signature`. Used only at build-time prerender when env vars are absent. Never reaches production runtime.

### `NEXT_PUBLIC_*` Variables — All Safe

| Variable | Assessment |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Safe — designed to be public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Safe — public by design, RLS enforces access |
| `NEXT_PUBLIC_APP_URL` | Safe — site URL |
| `NEXT_PUBLIC_BACKEND_URL` | Safe — public Fly.io URL |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Safe — price IDs are public |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Safe |
| `NEXT_PUBLIC_STRIPE_POWER_PRICE_ID` | Safe |

No secret variables are exposed via `NEXT_PUBLIC_` prefix.

### Bearer Token Usage — All Clean
All 5 routes using `Bearer` tokens reference `process.env.*` variables. No hardcoded tokens.

### Files That Shouldn't Be in Git

| File | Risk | Contains Secrets? |
|------|------|-------------------|
| `app/.DS_Store` | LOW | No — macOS metadata, leaks directory structure |
| `docs/archive/CLAUDE.md.bak` | LOW | No — old instructions backup |
| `docs/archive/test-memory.html` | LOW | No — debug HTML page |
| `setup-env.sh` | LOW | No — only writes `NEXT_PUBLIC_BACKEND_URL` (public) |
| `setup-env.ps1` | LOW | No — same as above |
| `setup-supabase-env.ps1` | LOW | No — prompts user interactively, no hardcoded values |

**`.gitignore` bug:** `.DS_Store` rule only matches root level. `app/.DS_Store` slips through. Fix: change to `**/.DS_Store`.

### `.env.example` — Clean
All placeholder values (`your_*_here`). Missing entries for: `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `CRON_SECRET`. Not a security issue but hurts onboarding.

### Git History
One `.env.example` commit found (legitimate). No `.env` or `.env.local` files in git history.

---

## 5. Security Headers

### Header Configuration Locations
- **`next.config.mjs`**: Full header set including CSP, HSTS, X-Frame-Options. Applied to `/((?!demos/).*)`.
- **`vercel.json`**: Partial header set (no CSP, no HSTS). Applied to `/(.*)`  and `/demos/(.*)`.

### Vercel Precedence Rules
On Vercel, `vercel.json` headers are applied FIRST, then `next.config.mjs` headers are MERGED on top. When both define the same header, `next.config.mjs` wins for matching paths.

### Conflicts & Issues

| Issue | Detail | Severity |
|-------|--------|----------|
| **Referrer-Policy mismatch** | `next.config.mjs`: `origin-when-cross-origin`, `vercel.json`: `strict-origin-when-cross-origin` | LOW — next.config wins for non-demo paths; `strict-origin-when-cross-origin` is actually stricter and more standard |
| **X-Frame-Options: /demos/** | `vercel.json` sets `SAMEORIGIN` for `/demos/*`, `next.config.mjs` excludes `/demos/` from DENY rule | INTENTIONAL — allows embedding demo pages in iframes on same origin. Verify this is still needed. |
| **CSP `unsafe-eval`** | Required by TradingView charting SDK. Documented in next.config.mjs comment. Applies globally. | MEDIUM — `unsafe-eval` is a known risk. TODO comment exists to scope it to chart pages only via middleware. Should be prioritized. |
| **CSP `unsafe-inline`** | Both `script-src` and `style-src` have `unsafe-inline` | MEDIUM — `unsafe-inline` for scripts undermines CSP protections. Consider nonce-based approach for scripts; `unsafe-inline` for styles is acceptable with Tailwind. |
| **Missing HSTS in vercel.json** | Only in `next.config.mjs` | OK — next.config.mjs applies it globally (Vercel also adds HSTS automatically for *.vercel.app) |
| **Missing CSP in vercel.json** | Only in `next.config.mjs` | OK — next.config.mjs is the authoritative source |

### CSP connect-src Coverage

| Destination | Covered? |
|-------------|----------|
| `*.supabase.co` | Yes |
| `*.supabase.in` | Yes |
| `wss://*.supabase.co` (realtime) | Yes |
| `api.polygon.io` | Yes |
| `s3.tradingview.com` | Yes |
| `*.sentry.io` | Yes |
| `*.stripe.com` | Yes |
| `pelican-trading-api.fly.dev` | Yes (via `*.fly.dev`) |
| `blob:` | Yes |
| `api.elbstream.com` | **Missing from connect-src** (only in img-src) — verify if API calls are made |
| `assets.parqet.com` | **Missing from connect-src** (only in img-src) — verify if API calls are made |

### Recommendation
The `unsafe-eval` in CSP is the biggest header-level concern. The documented plan to scope it via middleware to chart-only pages should be a V2 priority. Consider using nonces for inline scripts to allow removing `unsafe-inline` from `script-src`.

---

## 6. Priority Fixes (Pre-Launch)

### P0 — Fix Before Launch

| # | Issue | File(s) | Effort | Impact |
|---|-------|---------|--------|--------|
| 1 | **XSS: User messages rendered as raw HTML** | `components/chat/EducationChat.tsx:183` | 15 min | CRITICAL — self-XSS, potential stored XSS if messages are persisted |
| 2 | **XSS: AI postText fallback unsanitized** | `components/chat/message/message-content.tsx:234` | 15 min | HIGH — prompt injection → script execution |
| 3 | **Error leakage: 6 routes expose error.message** | `correlations/calculate`, `correlations/matrix`, `correlations/pair`, `cron/correlations`, `share-card`, `strategies` | 30 min | MEDIUM — exposes internals to attackers |

### P1 — Fix This Sprint

| # | Issue | File(s) | Effort | Impact |
|---|-------|---------|--------|--------|
| 4 | **Missing rate limit: Stripe billing-portal** | `app/api/stripe/billing-portal/route.ts` | 10 min | Abuse vector — unauthenticated Stripe API calls |
| 5 | **Missing rate limit: playbooks/adopt** | `app/api/playbooks/adopt/route.ts` | 10 min | DB write spam |
| 6 | **XSS: HelpChat user messages too permissive** | `components/marketing/HelpChat.tsx:254` | 10 min | MEDIUM — public-facing, UI redressing possible |
| 7 | **Git cleanup: Remove tracked junk files** | `.DS_Store`, `.bak`, setup scripts | 10 min | Hygiene — directory structure leakage |
| 8 | **Fix .gitignore: `.DS_Store` → `**/.DS_Store`** | `.gitignore` | 2 min | Prevents future leaks |

### P2 — Post-Launch

| # | Issue | File(s) | Effort | Impact |
|---|-------|---------|--------|--------|
| 9 | **Scope CSP `unsafe-eval` to chart pages only** | `middleware.ts` or `next.config.mjs` | 2 hrs | Reduces CSP attack surface on marketing/settings pages |
| 10 | **Add rate limits to conversation CRUD** | `conversations/route.ts`, `conversations/[id]/route.ts` | 20 min | Prevent DB write spam |
| 11 | **Add rate limit to share-card** | `app/api/share-card/route.tsx` | 10 min | Public endpoint, abuse prevention |
| 12 | **Add rate limit to strategies (public)** | `app/api/strategies/route.ts` | 10 min | Scraping prevention |
| 13 | **Complete `.env.example`** | `.env.example` | 10 min | Developer onboarding |
| 14 | **Consider nonce-based CSP for inline scripts** | `next.config.mjs`, `middleware.ts` | 4 hrs | Eliminates `unsafe-inline` from script-src |

---

## Appendix: Middleware Auth Coverage

The middleware (`lib/supabase/middleware.ts`) provides first-line auth for all non-public routes. It calls `getUser()` and returns 401 for unauthenticated API requests. Routes explicitly marked public in middleware:

```
/api/health          — Health check (intentional)
/api/help-chat       — Public chat widget (IP rate limited)
/api/stripe/webhook  — Stripe signature verified
/api/strategies      — Public strategy listings
/api/share-card      — OG image generation
```

All other API routes get middleware auth even if they don't call `getUser()` in-handler. The in-handler auth is defense-in-depth. Routes that rely solely on middleware auth (no in-handler `getUser()`):

- All 13 admin routes (use service role + `is_admin` check instead)
- `/api/strategies`, `/api/strategies/[slug]` (public, read-only)
- `/api/health` (public, no data)
- `/api/help-chat` (public, IP rate limited)
- `/api/cron/correlations` (CRON_SECRET)
- `/api/stripe/webhook` (Stripe signature)
- `/api/correlations/calculate` (admin check)
