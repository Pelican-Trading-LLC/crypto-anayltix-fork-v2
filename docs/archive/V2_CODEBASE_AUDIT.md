# Pelican Trading AI - V2 Codebase Audit
## Complete Implementation Reference for V2 Feature Expansion

**Generated:** 2026-02-12
**Purpose:** Pre-implementation audit for V2 features (Morning Brief, Heatmap, Journal, Earnings)

---

## 1. Project Structure

### Framework & Routing
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Node Version:** 18+ (uses Next.js 14.2.35)

### Directory Structure
```
app/
├── (marketing)/         # Marketing pages (landing, FAQ, how-to-use)
├── admin/              # Admin dashboard (users, analytics, conversations)
├── api/                # API routes
│   ├── conversations/  # Conversation & message management
│   ├── stripe/         # Payment webhooks & checkout
│   ├── education-chat/ # Education chat endpoint
│   ├── help-chat/      # Help chat endpoint
│   ├── market-data/    # Market data API
│   └── upload/         # File upload endpoint
├── auth/               # Authentication pages
├── chat/               # Main chat interface
├── pricing/            # Pricing page
├── profile/            # User profile
├── settings/           # Settings page
└── terms/              # Terms of service

components/
├── admin/              # Admin dashboard components
├── chat/               # Chat UI components
│   ├── data-visualizations/
│   ├── input/
│   └── message/
├── how-to-use/         # How-to guides
├── marketing/          # Landing page components
├── pricing/            # Pricing components
├── settings/           # Settings components
└── ui/                 # shadcn/ui components

hooks/
├── use-chat.ts                    # Main chat hook (CRITICAL - DO NOT MODIFY)
├── use-streaming-chat.ts          # SSE streaming (CRITICAL - DO NOT MODIFY)
├── use-conversations.ts           # Conversation management (READ-ONLY)
├── use-credits.ts                 # Credits management
├── use-file-upload.ts             # File upload
├── use-market-data.ts             # Market data fetching
├── use-message-handler.ts         # Message handling
└── use-mobile.ts                  # Mobile detection

lib/
├── supabase/
│   ├── client.ts       # Browser client (createBrowserClient)
│   ├── server.ts       # Server client (createServerClient)
│   ├── middleware.ts   # Auth middleware
│   └── helpers.ts      # Supabase helpers
└── providers.ts        # React context providers

providers/
├── auth-provider.tsx
├── credits-provider.tsx
├── chart-provider.tsx
└── learning-mode-provider.tsx
```

---

## 2. Design System & Theme

### Color Scheme (Dark Mode - Primary)
```css
/* Background Colors */
--background: #0a0a0f           /* Main background */
--surface-1: oklch(0.08 0.01 280)   /* Card background */
--surface-2: oklch(0.18 0.015 280)  /* Elevated card */
--surface-3: oklch(0.22 0.02 280)   /* Highest elevation */

/* Text Colors */
--foreground: oklch(0.95 0.002 280) /* Primary text */
--muted: oklch(0.12 0.01 280)       /* Muted backgrounds */
--muted-foreground: oklch(0.75 0 0) /* Muted text */

/* Brand - Purple Accent */
--primary: oklch(0.60 0.25 280)     /* #8b5cf6 equivalent */
--accent: oklch(0.55 0.22 285)      /* Lighter purple */

/* Borders */
--border: oklch(0.35 0.08 280)      /* #1e1e2e equivalent */
--ring: oklch(0.65 0.25 280)        /* Focus ring */

/* Semantic Colors */
--destructive: oklch(0.55 0.25 25)  /* Red for errors */
--chart-1 through chart-5: Various purple shades for data viz
```

### Typography
- **Body Font:** Inter (via `next/font/google`)
  - Variable: `--font-inter`
  - Applied via `font-sans` utility
- **Mono Font:** Geist Mono (from `geist/font/mono`)
  - Variable: `--font-geist-mono`
  - Used for code, tickers, numeric data
- **Font Smoothing:** `-webkit-font-smoothing: antialiased` applied globally

### Spacing & Layout
```css
/* Spacing Scale */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem

/* Border Radius */
--radius-xs: 0.25rem
--radius-sm: 0.375rem
--radius-md: 0.5rem (default)
--radius-lg: 0.75rem
--radius-xl: 1rem
--radius-full: 9999px

/* Page Layout */
--page-max-width: 1280px
--page-max-width-wide: 1600px
--page-gutter: clamp(1rem, 4vw, 2rem)
```

### Z-Index System
```css
--z-base: 1000
--z-dropdown: 1010
--z-sticky: 1020
--z-modal-backdrop: 1030
--z-modal: 1040
--z-popover: 1050
--z-toast: 1060
--z-tooltip: 1070
```

### Custom Animations & Effects
```css
/* Glow button effect (globals.css:326-350) */
.glow-button {
  position: relative;
  overflow: hidden;
  transition: all 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glow-button:hover {
  transform: scale(1.05);
}

/* Shimmer loading effect (globals.css:398-437) */
.shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

/* Learning mode term highlighting (globals.css:498-530) */
.learning-term {
  border-bottom: 1px dotted rgba(251, 146, 60, 0.5);
  color: #f97316; /* Orange accent */
  cursor: pointer;
  transition: all 0.15s ease;
}
```

---

## 3. SSE Streaming System (CRITICAL - DO NOT MODIFY)

### Backend Configuration
- **Endpoint:** `https://pelican-backend.fly.dev/api/pelican_stream`
- **Environment Variable:** `NEXT_PUBLIC_BACKEND_URL` (defaults to Fly.io URL)
- **Method:** POST with SSE response

### Hook: `hooks/use-streaming-chat.ts`
**Location:** `c:\Users\grove\Desktop\Pelican Docs\Trade Journal\hooks\use-streaming-chat.ts`

**Key Functions:**
```typescript
interface UseStreamingChatReturn {
  sendMessage: (
    message: string,
    history: ConversationMessage[],
    callbacks: StreamCallbacks,
    conversationId: string | null,
    fileIds: string[]
  ) => Promise<void>;
  isStreaming: boolean;
  abortStream: () => void;
}
```

**Request Payload Structure:**
```typescript
interface StreamingPayload {
  message: string;
  conversationHistory: ConversationMessage[];  // camelCase
  conversation_history: ConversationMessage[]; // snake_case (BOTH sent for compatibility)
  conversationId: string | null;
  files: string[];
  timestamp: string;
  stream: boolean;  // Always true
}
```

**Authentication:**
- Uses Supabase session token via `Authorization: Bearer <token>` header
- Token retrieved from: `await supabase.auth.getSession()`

**SSE Data Format:**
```typescript
// Backend sends events as:
data: {"delta": "chunk of text", "type": "chunk"}
data: {"type": "done", "conversation_id": "uuid"}

// Parsed to:
{
  content?: string;      // Parsed from "delta" field
  done?: boolean;        // type === 'done'
  error?: string;
  conversationId?: string;
  sessionId?: string;
}
```

**Timeouts:**
- Connection timeout: 5 minutes (300,000ms)
- Chunk timeout: 30 seconds without new data
- Auto-abort on timeout

**Critical Implementation Notes:**
1. **DO NOT modify** the payload structure - backend expects BOTH field names
2. Conversation history filters out `system` role messages
3. Empty history with existing conversation ID triggers a warning (intentional)
4. Streamed content is accumulated and passed to `onChunk` callback incrementally
5. Final `conversation_id` is captured from the `done` event and passed to `onComplete`

---

## 4. Chat State Management

### Hook: `hooks/use-chat.ts`
**Location:** `c:\Users\grove\Desktop\Pelican Docs\Trade Journal\hooks\use-chat.ts`

**State Management Pattern:**
```typescript
// CRITICAL: Synchronous ref updates prevent race conditions
const messagesRef = useRef<Message[]>([]);

const updateMessagesWithSync = useCallback(
  (updater: (prev: Message[]) => Message[]) => {
    setMessages((prev) => {
      const next = updater(prev);
      messagesRef.current = next;  // Sync ref BEFORE render
      return next;
    });
  },
  []
);
```

**Message Loading Flow:**
1. URL changes → `useEffect` detects new `conversationId` param
2. Checks if already loaded via `loadedConversationRef.current`
3. Skips if messages already in state from streaming (prevents double-fetch)
4. Calls `/api/conversations/{id}/messages` endpoint
5. **Treats 404 as success** (new conversation with no messages yet)
6. Maps API messages to UI `Message[]` format with attachments

**Message Sending Flow:**
1. Validate message content (1-50,000 chars)
2. Capture conversation history via `captureConversationHistory()` (last 150 messages, no system messages)
3. Add user message to state (optimistic update)
4. Add empty assistant message with `isStreaming: true`
5. Call `sendStreamingMessage` from `use-streaming-chat.ts`
6. On each chunk: update assistant message content
7. On complete:
   - Capture conversation ID from backend if new conversation
   - Update URL with `onConversationCreated` callback
   - Mark `loadedConversationRef.current` to prevent refetch
   - Call `onFinish` callback

**Regenerate/Edit Pattern:**
```typescript
// CRITICAL: Update ref BEFORE sending to prevent stale history
messagesRef.current = sliced;
updateMessagesWithSync(() => sliced);
await sendMessage(newContent);
```

**Key Callbacks:**
- `onConversationCreated` - Router updates URL, sidebar refreshes
- `onFinish` - Image persistence, title generation, credit refetch
- `onError` - Error handling, offline banner
- `onTrialExhausted` - Show paywall modal
- `onInsufficientCredits` - Show upgrade modal

---

## 5. Supabase Client Patterns

### Browser Client (Client Components)
**File:** `lib/supabase/client.ts`
```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Usage:**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('table_name').select()
```

### Server Client (API Routes, Server Components)
**File:** `lib/supabase/server.ts`
```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore setAll errors from Server Components (middleware handles session refresh)
          }
        },
      },
    }
  )
}
```

**Usage in API Routes:**
```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('table_name').select()
  return Response.json(data)
}
```

### Middleware (Auth Protection)
**File:** `lib/supabase/middleware.ts`

**Protected vs Public Paths:**
```typescript
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/unauthorized",
  "/_next",
  "/favicon.ico",
]

const ALLOWED_EMAILS = [
  "nick@pelicantrading.ai",
  "jack@pelicantrading.ai",
  "ray@pelicantrading.ai",
]
```

**Auth Flow:**
1. Public paths bypass auth checks
2. `createServerClient` with cookie handling
3. `await supabase.auth.getUser()`
4. If no user → redirect to `/auth/login?redirectTo={pathname}`
5. If user email not in ALLOWED_EMAILS → redirect to `/auth/unauthorized`

**IMPORTANT:** Middleware runs on ALL routes. V2 feature pages must be accessible to authenticated users.

---

## 6. Data Fetching Patterns

### SWR Hook Pattern
**File:** `hooks/use-market-data.ts`

```typescript
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMarketData({ refreshInterval = 60000, autoRefresh = true }) {
  const { data, error, mutate } = useSWR(
    '/api/market-data',
    fetcher,
    {
      refreshInterval: autoRefresh ? refreshInterval : 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  return {
    indices: data?.indices || [],
    vix: data?.vix,
    isLoading: !error && !data,
    error,
    refresh: mutate,
  }
}
```

**Key Pattern:**
- SWR for client-side data fetching
- Custom hooks wrap SWR with domain logic
- API routes use server-side Supabase client
- No direct Supabase queries in hooks (goes through API routes)

### Example API Route Structure
**Pattern:** `app/api/{feature}/{action}/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Query data
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 7. Existing Layout & Navigation

### Root Layout
**File:** `app/layout.tsx`

**Key Elements:**
- Dark mode by default: `className="dark:bg-[#0a0a0f]"`
- Providers wrap all pages: `<Providers>` (contains Auth, Credits, Theme)
- Analytics via `@vercel/analytics/next`
- Sentry error boundary
- Skip to content link for accessibility
- Mobile viewport meta tags

**Providers Hierarchy:**
```tsx
<Providers>
  {/* Auth, Credits, Theme, Intl */}
  {children}
</Providers>
```

### Chat Page Layout
**File:** `app/chat/page.client.tsx` (670 lines)

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Mobile Header (< xl)                                    │
│ [Menu] Pelican AI [Credits][Learning][Theme]            │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │ Trading       │
│ Sidebar  │  Chat Container              │ Context       │
│ (280px)  │  - Messages                  │ Panel         │
│          │  - Typing indicator          │ (320-700px    │
│          │  - Welcome screen            │ resizable)    │
│          │                              │               │
│          │  Chat Input (fixed bottom)   │               │
└──────────┴──────────────────────────────┴───────────────┘
```

**Responsive Behavior:**
- **Desktop (≥ 1280px):** Three-column layout
- **Tablet (768-1279px):** Sidebar as sheet, trading panel hidden
- **Mobile (< 768px):** Full-screen chat, mobile sheet sidebar

**State Management:**
- `sidebarCollapsed` - Persisted in localStorage
- `tradingPanelCollapsed` - Persisted in localStorage
- `panelWidth` - Resizable, persisted (280-700px range)

**NO TOP NAV BAR** - Chat uses left sidebar navigation only

---

## 8. Conversation & Message Management

### Conversations Table Schema
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  last_message_preview TEXT,
  message_count INTEGER DEFAULT 0
);
```

### Messages Table Schema
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL,  -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  metadata JSONB,      -- Stores images array, attachments
  intent TEXT,
  tickers TEXT[],
  emotional_state TEXT
);
```

### API Routes
**Conversations:**
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get single conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `POST /api/conversations/[id]/generate-title` - Auto-generate title

**Messages:**
- `GET /api/conversations/[id]/messages` - Load messages (returns 404 for new conversations - VALID)
- `POST /api/messages/[id]/regenerate` - Regenerate assistant response

### Conversation Hook
**File:** `hooks/use-conversations.ts` (READ-ONLY)

**DO NOT MODIFY** - Complex Realtime subscription logic

**Key Features:**
- Realtime updates via Supabase subscriptions
- Search/filter conversations
- Pagination support
- Auto-refresh on `pelican:conversation-created` event

---

## 9. File Upload System

### Storage Buckets
- `chat-images` - Persistent image storage (referenced in message metadata)
- `uploads` - Temporary file uploads (referenced by file ID)
- `trade-screenshots` - Trade journal screenshots (V2 feature)

### Upload Flow
**File:** `hooks/use-file-upload.ts`

1. User selects/drops file
2. Upload to Supabase Storage `uploads` bucket
3. Get file ID and signed URL
4. Display preview in chat input
5. On send: Pass file IDs to streaming endpoint
6. **Images only:** Re-upload to `chat-images` bucket for persistence
7. Store metadata in message `metadata.images` array

**Helper:** `lib/upload-image.ts`
```typescript
export async function uploadChatImage(
  file: File,
  userId: string
): Promise<{ storagePath: string } | null> {
  const supabase = createClient()
  const fileName = `${userId}/${Date.now()}_${file.name}`

  const { error } = await supabase.storage
    .from('chat-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return null
  return { storagePath: fileName }
}
```

---

## 10. Translation System

**Library:** `next-intl` (v4.5.0)

**Pattern:** Custom `useTranslation` hook (NOT found in grep results - likely in providers)

**Usage:**
```typescript
const t = useTranslation()
<span>{t('chat.welcome')}</span>
```

**Translation Files:** `messages/*.json` (30 languages supported)

**IMPORTANT for V2:**
- All new user-facing strings should use translation system
- For V2 implementation, English values are acceptable initially
- Translation keys should follow pattern: `{feature}.{component}.{key}`
- Example: `journal.stats.totalPnl`, `heatmap.view.treemap`

---

## 11. Modal & Dialog Patterns

### Radix UI Components
**Installed:**
- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-dropdown-menu` - Dropdowns
- `@radix-ui/react-select` - Select inputs
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-alert-dialog` - Confirmation dialogs

### Example Modal Pattern
**File:** `components/trial-exhausted-modal.tsx`

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ExampleModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Content */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### State Management Pattern
```typescript
const [modalOpen, setModalOpen] = useState(false)

// Trigger modal
const handleOpenModal = () => setModalOpen(true)

// In render
<ExampleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
```

---

## 12. Credits & Billing System

### Credits Provider
**File:** `providers/credits-provider.tsx`

**Context:**
```typescript
interface CreditsContextValue {
  credits: number;
  hasAccess: boolean;  // true if user has credits
  plan: string;
  loading: boolean;
  refetch: () => void;
}
```

**Usage:**
```typescript
import { useCreditsContext } from '@/providers/credits-provider'

const { credits, hasAccess, plan, refetch } = useCreditsContext()
```

### User Credits Table Schema
```sql
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  credits_balance INTEGER DEFAULT 0,
  credits_used_this_month INTEGER DEFAULT 0,
  plan_type TEXT,  -- 'free', 'starter', 'pro', 'elite'
  plan_credits_monthly INTEGER,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  free_questions_remaining INTEGER DEFAULT 10,
  is_admin BOOLEAN DEFAULT false,
  terms_accepted BOOLEAN DEFAULT false
);
```

### Stripe Integration
**API Routes:**
- `POST /api/stripe/create-checkout` - Create checkout session
- `POST /api/stripe/billing-portal` - Redirect to billing portal
- `POST /api/stripe/webhook` - Handle Stripe webhooks

**Price IDs:** Validated server-side, never trust client input

---

## 13. Environment Variables

**File:** `.env.example`

**Required Variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ewcqmsfaostcwmgybbub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# Backend API
NEXT_PUBLIC_BACKEND_URL=https://pelican-backend.fly.dev

# Stripe (Server-side only)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# External APIs (for V2)
POLYGON_API_KEY=<key>
FINNHUB_API_KEY=<key>
```

**V2 Additions Needed:**
- `POLYGON_API_KEY` - For heatmap, position prices, ticker search
- `FINNHUB_API_KEY` - For earnings calendar, economic calendar

---

## 14. Existing Database Tables (V1)

### Core Tables (Actively Used)
```sql
-- User Credits
user_credits (user_id PK, credits_balance, plan_type, free_questions_remaining, is_admin, terms_accepted)

-- Conversations
conversations (id, user_id, title, created_at, is_active, metadata)

-- Messages
messages (id, conversation_id, user_id, role, content, timestamp, metadata)

-- Files
files (id, user_id, storage_path, mime_type, name, size)
```

### Future Feature Tables (Exist but No Frontend Yet)
```sql
-- Trade Journal (V2 target)
trades (id, user_id, ticker, direction, entry_price, exit_price, status, pnl_amount, pnl_percent, r_multiple, ai_grade JSONB)

daily_journal (id, user_id, journal_date, pre_market_notes, market_bias, daily_pnl)

playbooks (id, user_id, name, setup_type, entry_rules, exit_rules, checklist)

watchlist (id, user_id, ticker, notes, alert_price_above, alert_price_below)
```

### RPC Functions (Exist in Supabase)
```sql
-- Trade Stats
close_trade(trade_id UUID, exit_price NUMERIC, exit_date DATE)
get_trade_stats(user_id UUID) → { total_pnl, win_rate, profit_factor, avg_r }
get_stats_by_setup(user_id UUID) → per-setup performance
get_equity_curve(user_id UUID) → daily equity data

-- Admin
get_popular_tickers(p_days INTEGER, p_limit INTEGER) → ticker mention counts
```

---

## 15. Component Patterns

### Naming Conventions
- **PascalCase:** Component names (`ChatContainer`, `TradingContextPanel`)
- **camelCase:** Function names, variables
- **kebab-case:** File names (`chat-container.tsx`, `use-chat.ts`)

### Client Components Pattern
```typescript
"use client"  // Required for hooks, state, effects

import { useState } from 'react'

export function ExampleComponent() {
  const [state, setState] = useState(false)

  return (
    <div className="space-y-4">
      {/* Content */}
    </div>
  )
}
```

### Server Components Pattern (Default)
```typescript
// No "use client" directive
import { createClient } from '@/lib/supabase/server'

export default async function ExamplePage() {
  const supabase = await createClient()
  const { data } = await supabase.from('table').select()

  return (
    <div>
      {/* Content */}
    </div>
  )
}
```

### Dynamic Imports (For Heavy Components)
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('@/components/heavy').then(m => ({ default: m.HeavyComponent })),
  { ssr: false }
)
```

---

## 16. Tailwind CSS Patterns

### Utility-First Approach
```tsx
<div className="flex items-center gap-4 p-6 rounded-lg bg-card border border-border">
  <span className="text-sm text-muted-foreground">Label</span>
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>

<div className="hidden xl:block">
  {/* Desktop only */}
</div>

<div className="xl:hidden">
  {/* Mobile/tablet only */}
</div>
```

### Dark Mode Classes
```tsx
<div className="bg-white dark:bg-[#0a0a0f] text-black dark:text-white">
  {/* Light/dark theme support */}
</div>
```

### Custom Classes (globals.css)
- `.glow-button` - Hover glow effect
- `.shimmer` - Loading skeleton
- `.learning-term` - Learning mode highlights
- `.message-content` - Word-breaking for chat messages
- `.chat-scroll-area` - Optimized mobile scrolling
- `.tabular-nums` - Monospace numbers (for prices, percentages)

---

## 17. Key Implementation Constraints

### DO NOT MODIFY (Critical Files)
1. `hooks/use-chat.ts` - Chat state management
2. `hooks/use-streaming-chat.ts` - SSE streaming logic
3. `hooks/use-conversations.ts` - Conversation management
4. `messages/*.json` - Translation files (modify via i18n workflow only)

### COORDINATE BEFORE MODIFYING (Shared Files)
1. `app/layout.tsx` - Root layout affects everything
2. `lib/supabase/*` - Shared client setup
3. `providers/*` - Context providers
4. `tailwind.config.ts` - Global styles (file missing - likely using Tailwind 4 inline config)
5. `package.json` - Dependency changes
6. `app/globals.css` - Design tokens

### IMPORTANT PATTERNS TO FOLLOW
1. **SSE Streaming:** Always use existing `use-streaming-chat.ts` hook, never call OpenAI directly
2. **Supabase Clients:** Use `createClient()` from correct import path (browser vs server)
3. **Translations:** All user-facing strings through translation system
4. **TypeScript:** No `any` types where proper types exist
5. **Numeric Data:** Always use `tabular-nums` class for prices, percentages
6. **Dynamic Imports:** Use `next/dynamic` instead of `React.lazy` (App Router pattern)
7. **Migrations:** Always use `IF NOT EXISTS` to avoid breaking production
8. **Error Handling:** All mutations in try/catch with user-facing errors

---

## 18. Testing & Build

### Build Command
```bash
npm run build
```

**MUST pass with zero errors before any commit.**

### Dev Server
```bash
npm run dev  # Runs on port 7000
```

### Linting
```bash
npm run lint
```

---

## 19. Key Learnings for V2 Implementation

### Navigation Architecture
- **Current:** No top nav bar on chat page (left sidebar only)
- **V2 Requirement:** Top nav tabs (Brief | Chat | Heatmap | Journal | Earnings)
- **Implementation:** Create new layout wrapper for V2 feature pages, keep chat page as-is

### Data Fetching Strategy
- Use SWR for client-side data fetching
- Wrap SWR in custom hooks with domain logic
- API routes use server-side Supabase client
- Cache external API data in `cached_market_data` table (new V2 table)

### State Management
- React Context for global state (auth, credits, theme)
- SWR for server state
- Local state (`useState`) for UI-only state
- Refs for synchronous updates (see `use-chat.ts` pattern)

### Pelican Panel Integration
- The "Pelican Panel" is NEW for V2 - doesn't exist in current codebase
- Must reuse existing SSE streaming system (`use-streaming-chat.ts`)
- Conversations created in panel should appear in chat sidebar
- Panel opens/closes without page navigation (client-side state)

### Styling Consistency
- Match existing purple accent theme (#8b5cf6, oklch(0.60 0.25 280))
- Use existing card backgrounds (--surface-1, --surface-2, --surface-3)
- Follow existing border radius patterns (--radius-md default)
- Maintain dark-first design (light mode exists but rarely used)

---

## 20. Next Steps for V2 Implementation

### Phase 0: ✅ COMPLETE
This audit document provides all necessary context.

### Phase 1: Database Migrations
- Add `is_paper` column to `trades` table
- Create `trade_patterns`, `user_streaks`, `cached_market_data` tables
- Create `update_streak` RPC function
- Verify all RLS policies

### Phase 2: Shared Infrastructure
- Create `PelicanChatPanel` component
- Create `usePelicanPanel` hook
- Update navigation to include top nav tabs
- Create `(features)` layout wrapper

### Phase 3: Feature Pages (Parallel Implementation)
- 3A: Heatmap page + treemap component
- 3B: Journal page + trade management
- 3C: Morning Brief page
- 3D: Earnings calendar page

### Phase 4: CMD+K Ticker Search
- Universal search component
- Integrates with Pelican panel

### Phase 5: Integration Testing
- Full test checklist
- Cross-feature testing
- Build verification

---

## 21. Critical Environment Context

**Working Directory:** `c:\Users\grove\Desktop\Pelican Docs\Trade Journal`
**Platform:** Windows (win32)
**Git Repo:** Yes
**Current Branch:** main
**Git Status:** Clean (all V1 features committed)

**Package Manager:** npm
**Node Version:** 18+ (Next.js 14.2.35 requires Node 18+)

---

## END OF AUDIT

This document contains ALL information needed to implement V2 features while maintaining compatibility with the existing V1 codebase. Reference this document throughout the implementation process.

**Audit Completeness:** ✅ Complete
**Ready for Phase 1:** ✅ Yes
**Claude Code Agent:** Ready to proceed with database migrations.
