# CLAUDE.md — Pelican Trading AI V3 Frontend

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

---

## Core Principles

- **Simplicity First**: Minimal changes, minimal code touched.
- **No Laziness**: Root causes only. No temporary fixes.
- **Security First**: Every feature needs RLS, input validation, auth checks. Never client-only enforcement.
- **Don't Touch Streaming**: `hooks/use-chat.ts` and `hooks/use-streaming-chat.ts` work. Don't modify unless explicitly asked.
- **Chat is the Hub**: Every feature connects back to chat. Trade journal → Pelican scan. Heatmap → click to analyze. Earnings → click to ask. This creates the data flywheel.
- **The Moat is Accumulated Intelligence**: After 6 months, leaving Pelican means losing hundreds of analyzed trades and an AI that knows your patterns.

---

## Project Context: Pelican Trading AI

### What This Is
AI-powered trading platform. Users ask questions about markets in plain English, get institutional-grade analysis. The platform includes chat, trade journaling, market heatmap, morning briefings, earnings calendar, and AI coaching. Think Bloomberg Terminal meets modern fintech for retail traders.

### Team
- **Nick** — Founder. Product vision, architecture decisions, built V2/V3 features in Claude Code.
- **Ray Campbell** — Technical co-founder. 20+ years software architecture experience (NYSE ARCA, crypto exchange infrastructure). Owns backend, database, and Python API on Fly.io.

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Auth/DB | Supabase (project: `ewcqmsfaostcwmgybbub`, us-east-2) |
| Payments | Stripe (Starter $29, Pro $99, Elite $249) |
| Styling | Tailwind CSS + CSS custom properties in globals.css |
| Icons | **Phosphor Icons** (`@phosphor-icons/react`) — use weight system for hierarchy |
| Fonts | **Geist Sans** (UI) + **Geist Mono** (numbers/data) via `next/font` |
| Animations | **Framer Motion** (`framer-motion`) for transitions, hovers, entrances |
| State | SWR + React Context |
| Charts | recharts + TradingView widgets |
| Backend API | Python on Fly.io (SSE streaming) |
| Market Data | Polygon.io |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`) |
| Hosting | Vercel |
| Email | Resend |
| i18n | Custom useTranslation hook (30 languages) |
| Domain | pelicantrading.ai (prod), pelicantrading.org (staging) |

---

## Design System

### Philosophy
Cinematic, minimal, premium dark mode. Inspired by Infracorp Global and Lightweight (Awwwards references). Depth through light and negative space, not decoration. Two-color discipline for UI chrome, with data colors (green/red) reserved strictly for financial data.

### NOT Allowed
- Flat, outlined boxes everywhere. Cards should feel elevated, not caged.
- Color noise — purple, cyan, orange, white all competing. UI chrome is quiet; data colors speak.
- Dense, cramped layouts. Premium means breathing room.
- Generic icon usage. Phosphor weight system creates hierarchy (thin = decorative, regular = UI, bold = actions).
- Static, lifeless interactions. Every clickable element needs a micro-interaction.

### Color Palette
```
/* Backgrounds — layered depth, NOT flat */
--bg-base: #0a0a0f;           /* Deepest layer */
--bg-surface: #111118;         /* Cards, panels */
--bg-elevated: #16161f;        /* Modals, popovers, hover states */
--bg-overlay: rgba(0,0,0,0.6); /* Backdrops */

/* Borders — subtle, NOT prominent */
--border-subtle: rgba(255,255,255,0.06);
--border-default: rgba(255,255,255,0.1);
--border-hover: rgba(255,255,255,0.15);

/* Text — clear hierarchy */
--text-primary: #e8e8ed;       /* Headings, important content */
--text-secondary: #9898a6;     /* Body text, descriptions */
--text-muted: #5a5a6e;         /* Labels, captions, timestamps */
--text-disabled: #3a3a4a;

/* Purple accent — used sparingly for interactive elements */
--accent-primary: #8b5cf6;
--accent-hover: #9d74f7;
--accent-muted: rgba(139,92,246,0.15);
--accent-glow: rgba(139,92,246,0.08);

/* Data colors — ONLY for financial data, never for UI decoration */
--data-positive: #22c55e;      /* Profit, gains, bullish */
--data-negative: #ef4444;      /* Loss, drops, bearish */
--data-neutral: #6b7280;       /* Unchanged, flat */
--data-warning: #f59e0b;       /* Alerts, caution */

/* Status */
--status-open: #22c55e;
--status-closed: #6b7280;
--status-cancelled: #ef4444;
```

### Typography
```
/* Font stacks — loaded via next/font */
--font-sans: 'Geist Sans', system-ui, sans-serif;  /* All UI text */
--font-mono: 'Geist Mono', monospace;               /* ALL numbers: prices, P&L, percentages, quantities */

/* Scale */
--text-xs: 0.75rem;     /* 12px — timestamps, captions */
--text-sm: 0.875rem;    /* 14px — body, table cells */
--text-base: 1rem;      /* 16px — primary content */
--text-lg: 1.125rem;    /* 18px — section headers */
--text-xl: 1.25rem;     /* 20px — page subtitles */
--text-2xl: 1.5rem;     /* 24px — page titles */
--text-3xl: 1.875rem;   /* 30px — hero text */

/* RULE: Every number on every page uses font-mono + tabular-nums */
/* Prices, P&L, quantities, dates, credits — ALL mono */
```

### Spacing & Layout
```
/* Generous spacing — premium = breathing room */
--space-page-x: 2rem;         /* Page horizontal padding */
--space-page-y: 1.5rem;       /* Page vertical padding */
--space-section: 2rem;         /* Between major sections */
--space-card: 1.25rem;         /* Card internal padding */
--space-card-gap: 1rem;        /* Between cards in a grid */

/* Cards — elevated, not boxed */
Cards use: bg-surface + subtle border + shadow, NOT thick visible borders
Hover: slight translateY(-1px) + shadow increase + border brightens
Active/selected: accent-muted bg tint
```

### Animation Standards (Framer Motion)
```
/* Page transitions */
Entrance: opacity 0→1, y 8→0, duration 0.3s, ease [0.25, 0.1, 0.25, 1]
Exit: opacity 1→0, duration 0.15s

/* Card/element hover */
Scale: 1 → 1.01 (subtle, NOT 1.05)
TranslateY: 0 → -1px
Shadow: increase spread by 2px
Duration: 0.15s
Ease: ease-out

/* Tab switching / content swap */
Cross-fade: opacity 0.2s
Slide: x ±12px → 0, duration 0.25s

/* Skeleton loaders */
Pulse animation on bg-surface → bg-elevated, duration 1.5s, infinite

/* Reduced motion: respect prefers-reduced-motion — already implemented */
```

### Phosphor Icons Usage
```
/* Weight system for visual hierarchy */
Thin (weight 16): Decorative, watermarks, large display icons
Light (weight 24): Secondary actions, nav items in inactive state
Regular (weight 32): Default UI icons, form icons, status indicators
Bold (weight 48): Primary actions, CTAs, important states
Fill: Active/selected states (e.g., active tab icon)

/* Trading-specific icons */
ChartLineUp, ChartBar, TrendUp, TrendDown — charts/performance
CurrencyDollar, Wallet, Bank, Coins — financial
ArrowUpRight, ArrowDownRight — P&L direction
Lightning — AI/Pelican actions
MagnifyingGlass — search
Gear — settings
Plus, X, Check — CRUD actions
```

### Component Patterns
```
/* Cards */
- Subtle bg gradient (bg-surface with slight radial gradient at top for "light")
- Border: 1px solid var(--border-subtle)
- Border-radius: 12px (rounded-xl)
- Shadow: 0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.1)
- Hover: shadow increases, border brightens, slight lift
- NO thick borders. NO colored borders unless accent/status.

/* Tables */
- No visible row borders. Use alternating bg or hover highlight.
- Header row: text-muted, font-medium, uppercase text-xs tracking-wider
- All numeric cells: font-mono tabular-nums text-right
- Hover row: bg-elevated transition 0.15s

/* Buttons */
- Primary: bg-accent, text-white, hover:bg-accent-hover, shadow
- Secondary: bg-transparent, border border-subtle, hover:bg-elevated
- Ghost: no border, hover:bg-elevated
- All: rounded-lg, transition-all 0.15s, active:scale-[0.98]

/* Modals */
- Backdrop: bg-overlay with backdrop-blur-sm
- Content: bg-elevated, rounded-2xl, shadow-2xl
- Entrance: scale 0.96→1, opacity 0→1, duration 0.2s
- Exit: scale 1→0.96, opacity 1→0, duration 0.15s

/* Sidebar */
- Slide in from right with framer-motion
- Content cross-fades on tab switch
- Tabs use Fill variant of Phosphor icon when active
```

---

## Database Schema

### Core Tables (Actively Used)
```
user_credits: user_id (PK), credits_balance, credits_used_this_month, plan_type,
  plan_credits_monthly, stripe_customer_id, stripe_subscription_id,
  free_questions_remaining (default 10), is_admin, terms_accepted

conversations: id, user_id, title, created_at, updated_at, is_active,
  metadata, last_message_preview, message_count

messages: id, conversation_id, user_id, role (user/assistant/system),
  content, timestamp, metadata (JSONB — may contain images array),
  intent, tickers[], emotional_state

trades: id, user_id, ticker, asset_type (stock/option/future/forex/crypto/etf/other),
  direction (long/short), quantity, entry_price, exit_price,
  stop_loss, take_profit, status (open/closed/cancelled),
  pnl_amount, pnl_percent, r_multiple, entry_date, exit_date,
  thesis, notes, setup_tags[], conviction (1-10), ai_grade (jsonb)

daily_journal: id, user_id, journal_date, pre_market_notes, market_bias,
  daily_goal, post_market_notes, lessons_learned, daily_pnl

playbooks: id, user_id, name, setup_type, entry_rules, exit_rules,
  risk_rules, checklist[], win_rate

watchlist: id, user_id, ticker, notes, alert_price_above, alert_price_below
```

**IMPORTANT:** An old `trade_journal` table exists with a different schema. IGNORE IT. Use `trades` exclusively.

### RPC Functions
```
close_trade() → { success, pnl_amount, pnl_percent, r_multiple }
get_trade_stats() → aggregate stats (win rate, profit factor, etc.)
get_stats_by_setup() → performance by setup type
get_pnl_by_day_of_week() → P&L by weekday
get_equity_curve() → cumulative P&L over time
get_popular_tickers() → trending tickers from message content
```

### RLS Rules
- Every user-facing SELECT: `user_id = (SELECT auth.uid())` — no exceptions
- NO `OR is_admin()` on user-facing policies. Service role handles admin access.
- All RPC functions: `SECURITY DEFINER` + `SET search_path = public`

---

## Architecture

### Feature Pages
```
app/(features)/morning/    — Morning Brief (Pelican Brief)
app/(features)/earnings/   — Earnings Calendar
app/(features)/journal/    — Positions / Trade Journal
app/(features)/heatmap/    — Market Heatmap
```

### Chat ↔ Feature Integration
Look for `prefillChatMessage` — shared utility, NOT reimplemented per feature.
- Trade journal → "Pelican scan" pre-fills chat with trade context
- Heatmap → click stock pre-fills analysis prompt
- Earnings → click row pre-fills earnings question
- IPO Watch → click IPO pre-fills research question
- Morning Brief → "Discuss with Pelican" button

### Pelican Brief Architecture
Streams SSE directly into a card on the page — report, NOT chat. Cached in localStorage by date. "Regenerate" button costs credits. Auto-expires at midnight.

### Polygon Ticker Formats
```
Stocks:  AAPL     → /v2/snapshot/locale/us/markets/stocks/tickers/AAPL
Crypto:  X:BTCUSD → /v2/snapshot/locale/global/markets/crypto/tickers/X:BTCUSD
Forex:   C:EURUSD → /v2/snapshot/locale/global/markets/forex/tickers/C:EURUSD
```
Forex uses bid/ask midpoint. Shared utility in `lib/polygon.ts`.

### Right Sidebar Tabs
- **Market** — Live indices, VIX, sectors, watchlist with prices
- **Calendar** — TradingView economic calendar
- **Learn** — Education chat (GPT-4o-mini, Learning Mode)

### Learning Mode
Toggle in chat header. 120+ terms in `lib/glossary/trading-terms.json`. Purple dotted underlines, hover tooltips, click opens Learn tab. Sidebar auto-expands when collapsed.

---

## Security

- **Rate limiting**: Upstash Redis on all cost-incurring routes. Fails CLOSED when Redis unavailable.
- **Middleware auth**: Redirects to login for protected routes. Fails CLOSED on Supabase errors.
- **Stripe**: Server-side plan derivation from priceId. Webhook signature verification.
- **Auth on API routes**: Every user-data route checks `supabase.auth.getUser()`. Exception: help-chat (public, IP rate limited).
- **Input validation**: Chat history arrays validated (max length, sanitized). Body size limits.
- **RLS**: Every table. Users only see own data. Service role for admin.
- **No in-memory rate limiting** — Vercel serverless resets Maps on cold starts.

---

## File Ownership

### Read-Only
- `hooks/use-chat.ts` — SSE streaming. Works. Don't touch.
- `hooks/use-streaming-chat.ts` — SSE parsing. Works.
- `hooks/use-conversations.ts` — Conversation state. Works.
- `messages/*.json` — Translation files.

### Shared (Coordinate First)
- `app/layout.tsx` — Root layout
- `lib/supabase/*` — Shared client setup
- `providers/` — Context providers
- `tailwind.config.ts` — Global styles
- `package.json` — Dependencies
- `globals.css` — Design tokens

---

## Coding Standards

- TypeScript strict. No `any` where proper types exist.
- Functional components + hooks. React.memo for expensive renders.
- Tailwind utilities + custom properties in globals.css for tokens.
- PascalCase components, camelCase functions, kebab-case files.
- All mutations in try/catch with user-facing errors.
- `IF NOT EXISTS` in migrations. Never break production.
- No console.log in production except intentional error logging.
- All user-facing strings through translation system.
- `tabular-nums` + `font-mono` on ALL numeric data.
- `next/dynamic` instead of React.lazy (App Router).
- Framer Motion for all animations. No raw CSS transitions for interactive elements.
- Phosphor Icons only. No mixing icon libraries. Use weight system.

---

## What NOT to Do

- Do NOT reference the old `trade_journal` table. Use `trades` exclusively.
- Do NOT add `OR is_admin()` to user-facing RLS policies.
- Do NOT use in-memory Maps for rate limiting.
- Do NOT trust client-supplied plan names or credit amounts.
- Do NOT leave console.log in production code.
- Do NOT use lucide-react for new code. Migrate to Phosphor.
- Do NOT use raw `<img>` tags. Use `next/image`.
- Do NOT add flat outlined boxes. Cards need depth.
- Do NOT use more than 2 accent colors on any single view.
- Do NOT skip hover/transition states on clickable elements.

---

## Payments

- **Stripe** — Starter ($29/mo), Pro ($99/mo), Elite ($249/mo)
- Credit-based system: each plan gets monthly credits, queries deduct credits
- 10 free questions (no signup required)
- Free account: additional free questions

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
OPENAI_API_KEY
POLYGON_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
FINNHUB_API_KEY
```
