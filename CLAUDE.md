## Workflow Orchestration
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Write detailed specs upfront to reduce ambiguity
### 2. Agent Strategy
- **Agent Teams**: Use freely for parallel workstreams. No limits on agent count.
- **Subagents**: Spawn as many as needed. Nest freely.
- Maximize parallelism. Speed over conservation.
### 3. Self-Improvement Loop
- After ANY correction: update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake
- Review lessons at session start
### 4. Verification Before Done
- Never mark complete without proving it works
- `npm run build` must pass before any commit
- Ask: "Would a staff engineer approve this?"
### 5. Autonomous Bug Fixing
- When given a bug: just fix it. Don't ask for hand-holding.
- Point at logs/errors, then resolve them.

## Core Principles
- **Simplicity First**: Minimal changes, minimal code touched.
- **No Laziness**: Root causes only. No temporary fixes.
- **Security First**: Every feature needs RLS, input validation, auth checks. Never client-only enforcement.
- **Don't Touch Streaming**: `hooks/use-chat.ts` and `hooks/use-streaming-chat.ts` work. Don't modify unless explicitly asked.

---

## Project Context: Pelican Trading AI

### What This Is
AI-powered trading assistant. Users ask questions about markets in plain English, get institutional-grade analysis. Think Bloomberg Terminal for retail traders.

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Auth/DB | Supabase (project: `ewcqmsfaostcwmgybbub`, us-east-2) |
| Payments | Stripe (Starter $29, Pro $99, Elite $249) |
| UI | Radix UI + shadcn/ui + Tailwind CSS |
| State | SWR + React Context |
| Charts | TradingView widgets |
| Backend API | Python on Fly.io (SSE streaming) |
| LLM | GPT-5 (primary), GPT-4o-mini (education, classification) |
| Market Data | Polygon.io |
| Hosting | Vercel |
| Email | Resend |
| i18n | Custom useTranslation hook (30 languages) |
| Domain | pelicantrading.ai (prod), pelicantrading.org (staging) |

### Database — Core Tables (actively used)
```
user_credits: user_id (PK), credits_balance, credits_used_this_month, plan_type,
  plan_credits_monthly, stripe_customer_id, stripe_subscription_id,
  free_questions_remaining (default 10), is_admin, terms_accepted

conversations: id, user_id, title, created_at, updated_at, is_active,
  metadata, last_message_preview, message_count

messages: id, conversation_id, user_id, role (user/assistant/syem),
  content, timestamp, metadata (JSONB — may contain images array),
  intent, tickers[], emotional_state

files: id, user_id, storage_path, mime_type, name, size
```

### Database — Future Feature Tables (exist in Supabase, no frontend yet)
```
trades: id, user_id, ticker, asset_type, direction, quantity, entry_price,
  exit_price, stop_loss, take_profit, status (open/closed/cancelled),
  pnl_amount, pnl_percent, r_multiple, entry_date, exit_date,
  thesis, notes, setup_tags[], conviction (1-10), ai_grade (jsonb)

daily_journal: id, user_id, journal_date, pre_market_notes, market_bias,
  daily_goal, post_market_notes, lessons_learned, daily_pnl

playbooks: id, user_id, name, setup_type, entry_rules, exit_rules,
  risk_rules, checklist[], win_rate

watchlist: id, user_id, ticker, notes, alert_price_above, alert_price_below
```

### RPC Functions (exist in Supabase, for future trade journal)
```
close_trade, get_trade_stats, get_stats_by_setup, get_pnl_by_day_of_week, get_equity_curve
```

### RPC Function for Admin (actively used)
```
get_popular_tickers(p_days INTEGER, p_limit INTEGER) → [{ ticker TEXT, mention_count BIGINT }]
  -- Extracts tickers from user message content via regex against known ticker whitelist
```

---

## What's Built (V2 Features — Complete)

### Chat Interface
- SSE streaming with GPT-5 via Fly.io backend
- Ticker highlighting (purple, clickable → pre-fills chat)
- Learning Mode toggle (GraduationCap icon, 120+ terms, hover tooltips, education sidebar chat)
- Regenerate response button
- Message actions (copy, etc.)
- 30-language support

### Right Sidebar Tabs
- **Market**: Live indices (SPX, IXIC, DJI), VIX, sector performance, watchlist with prices
- **Calendar**: TradingView economic calendar widget
- **Learn**: Education chat (GPT-4o-mini) for Learning Mode

### Admin Dashboard (`/admin`)
- User list with search/filter
- Recent signups table
- Recent conversations with expandable previews
- Credit management
- Analytics: messages/day, conversations/day, signups/day, credit consumption, conversion funnel, plan distribution, MRR

### Security (Hardened)
- Stripe checkout: authenticated endpoints, validated price IDs, server-controlled credits
- Terms of Service: server-side enforcement for Google OAuth
- RLS on all tables
- Secure RPC with SECURITY DEFINER

---

## Architecture Patterns

### Chat ↔ Feature Integration
Features use a "chat pre-fill" pattern: clicking elements composes messages in chat input.
Look for `prefillChatMessage` or similar — should be a shared utility.

### Data Fetching
Check what pattern the codebase uses (SWR hooks, React Query, or raw useEffect). Match existing patterns.

### Supabase Client
- Client-side: `createClient` or `createBrowserClient` (search lib/supabase/)
- Server-side API routes: different client. Search for `createServerClient`.

---

## Planned Features (NOT in repo yet — do not reference these files)

### Trade Journal (`/journal`)
- 5 tabs: Dashboard, Trades, Analytics, Daily Journal, Playbooks
- 6 recharts visualizations: equity curve, daily P&L, setup performance, day-of-week, R-multiple, conviction
- Log/Close/Edit trade modals with zod validation
- Pelican Scan: click icon on trade → pre-fills chat with trade context
- "Log Trade" button on chat messages with ticker detection
- Sidebar "Trades" tab: open position cards, today's closed trades, quick actions

### Market Heatmap (`/heatmap`)
- Custom squarified treemap (no d3 dependency)
- S&P 500 static constituent mapping (200+ stocks)
- Sidebar "Heatmap" tab with same data views
- Click stock → pre-fills chat with analysis prompt
- Auto-refresh: 60s market hours, 5m after hours

### Database tables exist in Supabase but frontend not built yet:
trades, daily_journal, playbooks, watchlist, trade_screenshots, trade_imports

---

## File Ownership (Agent Teams)

### Read-Only
- `hooks/use-chat.ts` — SSE streaming. Works. Don't touch.
- `hooks/use-streaming-chat.ts` — SSE parsing. Works.
- `hooks/use-conversations.ts` — Conversation state. Works.
- `messages/*.json` — Translation files. Only modify via i18n workflow.

### Shared (Coordinate First)
- `app/layout.tsx` — Root layout affects everything
- `lib/supabase/*` — Shared client setup
- `providers/` — Context providers
- `tailwind.config.ts` — Global styles
- `package.json` — Dependency changes need approval
- `globals.css` — Design tokens and CSS variables

---

## Coding Standards
- TypeScript strict. No `any` where proper types exist.
- Functional components + hooks. React.memo for expensive renders.
- Tailwind utilities + custom classes in globals.css for animations.
- PascalCase components, camelCase functions, kebab-case files.
- All mutations in try/catch with user-facing errors.
- `IF NOT EXISTS` in migrations. Never break production.
- No console.log in production except intentional error logging.
- All user-facing strings through translation system.
- `tabular-nums` on all numeric data (prices, percentages).
- `next/dynamic` instead of React.lazy (App Router).

---

## Current TODO
- [ ] A(full Q&A, copy, search)
- [ ] Image persistence (Supabase Storage → signed URLs)
- [ ] TradingView attribution tags
- [ ] Nick headshot + Twitter on team page
- [ ] UI polish pass (chat formatting, spacing, visual hierarchy)
- [ ] Open Graph meta tags for social sharing
- [ ] Landing page CRO improvements (audit score: 51/100)

## Future TODO (not started)
- [ ] Trade Journal frontend (tables exist in Supabase)
- [ ] Market Heatmap frontend (Polygon.io API routes needed)
- [ ] Morning Briefing feature
- [ ] Position Dashboard with health scores
- [ ] Sidebar Trades + Heatmap tabs
