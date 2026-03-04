# Pelican Trading AI — V2 Data Integrity Audit

**Date:** 2026-03-04
**Scope:** Supabase client usage, RLS, data flows (trades, Stripe, conversations, uploads), admin routes

---

## 1. Supabase Client Matrix

| Client | File | Key Used | Where Called | Correct? |
|--------|------|----------|-------------|----------|
| `createBrowserClient` | `lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client components, hooks | YES |
| `createServerClient` | `lib/supabase/server.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | API routes, Server Components | YES |
| `createServerClient` | `lib/supabase/middleware.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Middleware (session refresh) | YES |
| `createSupabaseClient` (service role) | `lib/admin.ts` → `getServiceClient()` | `SUPABASE_SERVICE_ROLE_KEY` | Admin API routes ONLY | YES |

### Key Findings

**Service role isolation: PASS** — `SUPABASE_SERVICE_ROLE_KEY` is referenced in exactly ONE file (`lib/admin.ts`). No client components, hooks, or non-admin routes use it. The `getServiceClient()` function validates env vars at runtime and throws with a clear message if missing.

**Build-time safety: PASS** — Both `client.ts` and `server.ts` have build-safe fallbacks when env vars are absent (placeholder client / mock query builder). These only activate during `next build` prerender and never reach production runtime.

**Anon key in server routes: CORRECT** — Server-side API routes use the anon key + user's cookie session, which means RLS policies apply. The service role (which bypasses RLS) is only used via `getServiceClient()` in admin routes. This is the correct pattern — user-facing routes should always go through RLS.

**No `createRouteHandlerClient`:** Not used anywhere. The codebase uses the newer `createServerClient` from `@supabase/ssr` consistently. This is correct and up to date.

---

## 2. RLS Status

### What's Verifiable from Code

**Admin bypass pattern: CORRECT** — `requireAdmin()` in `lib/admin.ts`:
1. Authenticates user via `supabase.auth.getUser()` (anon key, respects session)
2. Then creates a service-role client to check `is_admin` on `user_credits` table
3. Returns 401 if not authenticated, 403 if not admin
4. Only AFTER both checks does it return the service client for admin operations

**No `is_admin()` in user-facing RLS policies** — Confirmed: `is_admin` is only checked in `lib/admin.ts` and `app/api/admin/users/route.ts` (to return admin status in the user list). It is never used in RLS policy definitions in the migration files found.

**User-scoped queries: CORRECT** — All user-facing API routes use the anon-key Supabase client with the user's session. RLS policies filter by `user_id = auth.uid()` automatically. Examples:
- `conversations/route.ts`: `.eq("user_id", user.id)` (belt-and-suspenders with RLS)
- `conversations/[id]/messages/route.ts`: `.eq('user_id', user.id)` on messages query
- `upload/route.ts`: insert with `user_id: userId` from `getUser()`

### What Needs Dashboard Verification

| Check | Table | What to Verify |
|-------|-------|---------------|
| RLS enabled | ALL 37+ tables | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` is active |
| SELECT policies | `trades`, `conversations`, `messages`, `daily_journal`, `playbooks`, `watchlist` | `user_id = (SELECT auth.uid())` — no `OR is_admin()` |
| INSERT policies | `trades`, `conversations`, `messages` | `user_id = auth.uid()` enforced |
| UPDATE/DELETE policies | `trades`, `conversations`, `messages` | `user_id = (SELECT auth.uid())` |
| RPC functions | `close_trade`, `get_trade_stats`, `get_equity_curve`, etc. | `SECURITY DEFINER` + `SET search_path = public` |
| Storage RLS | `pelican` bucket | User can only access own uploads |

---

## 3. Data Flow Maps

### 3.1 Trade Logging Flow

```
User → log-trade-modal.tsx → supabase.from('trades').insert() [CLIENT-SIDE]
                                    ↓
                              RLS policy enforces user_id = auth.uid()
```

**Validation:**
- Client-side form validation in `log-trade-modal.tsx` (required fields, numeric ranges)
- No server-side API route for trade creation — inserts go directly from client to Supabase
- `user_id` is set by RLS policy (`auth.uid()`), NOT by client code — **CORRECT**
- No Zod schema found for trades — validation is form-level only

**Risk:** LOW — RLS enforces ownership. Client-side validation is sufficient since RLS is the real guard. A malicious client could insert trades with bad data (e.g., negative prices) but only into their own account.

**Recommendation:** Consider adding a database CHECK constraint for `entry_price > 0`, `quantity > 0` to prevent nonsensical data even from direct API calls.

### 3.2 Stripe Webhook Flow

```
Stripe → POST /api/stripe/webhook → signature verify → process event → supabase (service role)
```

**Verification Results:**

| Check | Status | Detail |
|-------|--------|--------|
| Signature verification | PASS | `stripe.webhooks.constructEvent(body, signature, webhookSecret)` |
| Raw body preserved | PASS | Uses `request.text()`, not `request.json()` |
| Middleware bypass | PASS | `middleware.ts` line 38: explicitly skips `/api/stripe/webhook` |
| Body parsing disabled | PASS | `export const runtime = 'nodejs'` + `export const dynamic = 'force-dynamic'` |

**Events handled:**

| Event | Action | Status |
|-------|--------|--------|
| `checkout.session.completed` | Creates subscriber via `setup_subscriber` RPC | PASS — uses RPC (atomic) |
| `invoice.paid` (renewal) | Resets monthly credits via `reset_monthly_credits` RPC | PASS — uses RPC |
| `invoice.payment_failed` | Sets plan to `past_due` | PASS |
| `customer.subscription.deleted` | Cancels via `cancel_subscription` RPC | PASS — uses RPC |
| `customer.subscription.updated` | Updates plan/credits on plan change | PASS |

**Edge cases:**

| Scenario | Handled? | Notes |
|----------|----------|-------|
| Missing `user_id` in session | YES | `break` with console.error — idempotent |
| Missing `plan` in metadata | YES | `break` with console.error |
| Duplicate webhook events | PARTIAL | RPCs are likely idempotent but not explicitly guarded. Stripe sends retries. |
| Referral bonus failure | YES | `catch` + log, doesn't block subscription setup |
| Race: webhook vs redirect | LOW RISK | `setup_subscriber` RPC is atomic. If redirect hits first, user sees stale data until next refresh. |

**Finding:** The `invoice.paid` handler retrieves `user_id` from `subscription.metadata.user_id`. If the subscription was created before metadata was added (legacy users), this will silently fail to reset credits. Verify all active subscriptions have `user_id` in Stripe metadata.

### 3.3 Conversation/Message Flow

```
Client → POST /api/conversations → getUser() → insert with user_id from session
Client → GET /api/conversations/[id]/messages → getUser() → select with user_id filter
```

**Verification Results:**

| Check | Status | Detail |
|-------|--------|--------|
| Conversation creation sets user_id from auth | PASS | `user_id: user.id` from `getUser()` |
| Message read checks ownership | PASS | `.eq('user_id', user.id)` — double protection (RLS + query filter) |
| IDOR prevention | PASS | Conversation ID validated as UUID + user_id filter prevents cross-user access |
| Input sanitization | PASS | `sanitizePostgrestSearch()` escapes `%`, `_`, `\`, `.`, `,`, `(`, `)` for LIKE queries |
| Pagination | PASS | Cursor-based with `limit` capped at 100 |
| Sentry integration | PASS | `Sentry.captureException` in catch blocks |
| Error safety | PASS | Uses NODE_ENV guard for error details |

### 3.4 File Upload Flow

```
Client → POST /api/upload → auth check → rate limit → validate → magic bytes → storage → DB record
```

**Verification Results:**

| Check | Status | Detail |
|-------|--------|--------|
| Auth required | PASS | `getUser()` check, returns 401 |
| Rate limited | PASS | 20 uploads/hour per user |
| File type validation | PASS | MIME type allowlist + extension-based inference |
| Magic bytes verification | PASS | Validates file header matches declared MIME type |
| SVG blocked | PASS | Explicit SVG rejection (XSS prevention) |
| Size limit | PASS | 25MB server-side enforcement |
| Empty file blocked | PASS | `file.size === 0` check |
| Path traversal prevention | PASS | UUID-based storage key: `YYYY/MM/uuid.ext` — no user input in path |
| Filename sanitization | PASS | `sanitizeFilename()` from `lib/sanitize.ts` |
| User-scoped storage | PASS | Uses anon client (RLS applies to storage) |
| Cleanup on DB failure | PASS | If DB insert fails, uploaded file is removed from storage |
| Checksum computed | PASS | SHA-256 hash stored for integrity |
| Sentry reporting | PASS | `captureException` on storage/DB errors |
| Signed URLs | PASS | 7-day expiry, `public: false` in response |

**Finding:** Upload accepts archives (ZIP, GZ) and broad document types (DOC, DOCX, XLS, XLSX, PDF, RTF, XML). For a trading platform, this is generous. Consider whether ZIP/archive uploads are actually needed — they can contain executables.

---

## 4. Admin Security

### Route-by-Route Verification

All 13 admin routes follow the identical pattern:

```typescript
import { requireAdmin, getServiceClient } from '@/lib/admin'
// ...
const auth = await requireAdmin()
if ('error' in auth) return auth.error
const admin = getServiceClient()
```

| Route | requireAdmin | getServiceClient | Verified |
|-------|-------------|-----------------|----------|
| `/api/admin/analytics` | YES | YES | PASS |
| `/api/admin/content` | YES | YES | PASS |
| `/api/admin/conversations` | YES | YES | PASS |
| `/api/admin/conversations/[id]/full` | YES | YES | PASS |
| `/api/admin/conversations/[id]/messages` | YES | YES | PASS |
| `/api/admin/features` | YES | YES | PASS |
| `/api/admin/health` | YES | YES | PASS |
| `/api/admin/revenue` | YES | YES | PASS |
| `/api/admin/stats` | YES | YES | PASS |
| `/api/admin/users` | YES | YES | PASS |
| `/api/admin/users/[id]/credits` | YES | YES | PASS |
| `/api/admin/users/[id]/detail` | YES | YES | PASS |
| `/api/admin/users/[id]/grant-credits` | YES | YES | PASS |

### Grant Credits Validation

```typescript
if (typeof amount !== 'number' || amount <= 0 || amount >= 10000) {
  return { error: 'amount must be a number between 1 and 9999' }
}
```

- Amount validated: 1–9999 range enforced server-side
- No self-grant protection — an admin CAN grant credits to themselves
- Uses read-then-write pattern (fetch balance, add amount, write) — **not atomic**

**Race condition risk:** If two grant-credits requests fire simultaneously for the same user, both read the same balance and the second write overwrites the first. Use an RPC function with `UPDATE ... SET credits_balance = credits_balance + amount` for atomicity.

---

## 5. Critical Findings

| # | Finding | Severity | Detail |
|---|---------|----------|--------|
| 1 | **Grant-credits is not atomic** | MEDIUM | Read-then-write pattern allows race condition. Two simultaneous grants could lose one. Fix: use `UPDATE SET credits_balance = credits_balance + $amount` or an RPC. |
| 2 | **Stripe subscription metadata dependency** | MEDIUM | `invoice.paid` handler relies on `subscription.metadata.user_id`. If any active subscription lacks this metadata, monthly credit resets silently fail. Verify in Stripe dashboard. |
| 3 | **No database-level constraints on trade data** | LOW | Client inserts trades directly via Supabase. No CHECK constraints prevent negative prices, zero quantities, or future entry dates. RLS protects ownership but not data quality. |
| 4 | **Archive uploads accepted** | LOW | ZIP/GZ files accepted. Consider restricting to images + CSV/spreadsheets + PDF for a trading platform. |
| 5 | **Admin can grant credits to themselves** | LOW | No self-grant prevention. Acceptable if admin trust is established, but worth logging. |

---

## 6. Dashboard Checks Needed (Manual Verification)

These items cannot be verified from code alone and require checking the Supabase dashboard:

| # | Check | Where | What to Verify |
|---|-------|-------|---------------|
| 1 | **RLS is ENABLED on all tables** | Database → Tables | Every table shows RLS shield icon (enabled) |
| 2 | **No `OR is_admin()` in user-facing policies** | Database → Policies | SELECT/INSERT/UPDATE/DELETE policies on `trades`, `conversations`, `messages`, `daily_journal`, `playbooks`, `watchlist` use ONLY `user_id = (SELECT auth.uid())` |
| 3 | **RPC functions use SECURITY DEFINER + search_path** | SQL Editor: `SELECT proname, prosecdef FROM pg_proc WHERE proname IN ('close_trade','get_trade_stats','get_equity_curve','setup_subscriber','reset_monthly_credits','cancel_subscription')` | All return `prosecdef = true` |
| 4 | **Storage bucket RLS** | Storage → pelican bucket → Policies | Users can only read/write their own files |
| 5 | **All Stripe subscriptions have user_id metadata** | Stripe Dashboard → Subscriptions | Filter for subscriptions missing `metadata.user_id` |
| 6 | **`user_credits` table has row for every auth user** | SQL: `SELECT COUNT(*) FROM auth.users u LEFT JOIN user_credits c ON u.id = c.user_id WHERE c.user_id IS NULL` | Should return 0 |
| 7 | **Realtime disabled on sensitive tables** | Database → Replication | `user_credits`, `messages` should not broadcast over realtime (exposes data) |
| 8 | **Database CHECK constraints** | SQL: `SELECT conname FROM pg_constraint WHERE conrelid = 'trades'::regclass` | Consider adding: `entry_price > 0`, `quantity > 0` |

---

## Summary

### What's Solid
- **Client isolation:** Service role key confined to single file (`lib/admin.ts`), never in client code
- **Admin auth:** All 13 routes use consistent `requireAdmin()` pattern — authenticate first, then check `is_admin` via service role
- **Upload security:** Magic bytes validation, SVG blocked, sanitized filenames, UUID paths, rate limited, cleanup on failure
- **Conversation IDOR protection:** UUID validation + `user_id` filter + RLS triple-layer
- **Stripe webhook:** Signature verified, raw body preserved, middleware bypassed, events handled atomically via RPCs
- **RLS-first architecture:** User-facing routes use anon key → RLS enforces ownership

### What Needs Fixing
1. **P1:** Make grant-credits atomic (RPC or `credits_balance = credits_balance + amount`)
2. **P1:** Verify all Stripe subscriptions have `user_id` in metadata
3. **P2:** Add database CHECK constraints on `trades` table
4. **P2:** Run all 8 dashboard verification checks before launch
