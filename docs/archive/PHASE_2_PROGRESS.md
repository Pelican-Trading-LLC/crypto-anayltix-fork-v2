# Phase 2: Shared Infrastructure - IN PROGRESS

## ✅ Completed

### 1. UI Style Guide
**File:** `V2_UI_STYLE_GUIDE.md`
- Extracted exact visual patterns from production components
- Color system (oklch values from globals.css)
- Typography, spacing, borders, shadows
- Component patterns (buttons, cards, inputs, message bubbles)
- Animations, transitions, responsive patterns
- Critical "DO NOT" list to prevent prototype style copying
- **Status:** ✅ Complete reference guide for all new components

### 2. Pelican Panel Hook
**File:** `hooks/use-pelican-panel.ts`
- Reuses existing SSE streaming system (use-streaming-chat.ts)
- Manages panel state (open/close, messages, context)
- `openWithPrompt()` - Opens panel with contextual prompts
- `sendMessage()` - User-initiated messages
- `regenerateLastMessage()` - Regenerates last response
- `close()` - Closes panel
- `clearMessages()` - Clears state (page switches)
- Conversation persistence to Supabase
- Appends to same conversation on multiple clicks (same page session)
- **Status:** ✅ Complete - Ready for PelicanChatPanel component

## 🚧 In Progress

### 3. Pelican Chat Panel Component
**Next:** `components/pelican-panel/pelican-chat-panel.tsx`
- Visual design must match V2_UI_STYLE_GUIDE.md
- Width: 30% (min 330px, max 420px) on desktop
- Full-screen overlay on mobile (<768px)
- Header: Pelican icon + "Pelican AI" + ticker + close button
- Messages area: scrollable, auto-scroll, "Auto-prompt" badge for contextual prompts
- Input: text field + send button at bottom
- Typing indicator while streaming
- Uses usePelicanPanel hook

### 4. Top Navigation Bar
**Next:** `components/navigation/top-nav.tsx`
- Global nav with tabs: Brief | Chat | Heatmap | Journal | Earnings
- Streak display: flame icon + number (from useStreaks hook)
- Credits display: clickable dropdown
- Active tab indicator: subtle border or background
- **CRITICAL:** Chat page sidebar is preserved - becomes page-specific element UNDER top nav
- Mobile: responsive, possibly collapse to icons or hamburger

### 5. Feature Layout Wrapper
**Next:** `app/(features)/layout.tsx`
- Wraps all V2 feature pages (Brief, Heatmap, Journal, Earnings)
- Renders top nav
- Provides PelicanPanel context to child pages
- Handles 70/30 split when panel is open (CSS flexbox)
- Passes `openWithPrompt` to children via context
- Chat page is NOT wrapped in this layout (keeps existing sidebar-based layout)

### 6. Streak Hook
**Next:** `hooks/use-streaks.ts`
- Fetches current streak from `user_streaks` table
- Calls `update_streak` RPC on page visits (Brief, Journal)
- Returns: { journalStreak, planStreak, isLoading, updateStreak }
- SWR pattern (match use-market-data.ts)

## 📋 Remaining Tasks

- [ ] Build PelicanChatPanel component
- [ ] Build TopNav component
- [ ] Build useStreaks hook
- [ ] Create (features) layout wrapper
- [ ] Create PelicanPanelProvider context
- [ ] Test panel open/close/message flow
- [ ] Test navigation between pages
- [ ] Test mobile responsive behavior
- [ ] Verify Chat page sidebar still works
- [ ] Run `npm run build` - must pass with zero errors

## 🎯 Key Design Constraints (From Jack's Review)

1. **Left Sidebar Preservation**
   - Sidebar is NOT removed from Chat page
   - It becomes a Chat-page-specific element UNDER the new top nav
   - Other pages (Brief, Heatmap, Journal, Earnings) do NOT have sidebar

2. **Visual Design Source of Truth**
   - `V2_UI_STYLE_GUIDE.md` + `globals.css` + existing production components
   - Prototype files are LAYOUT WIREFRAMES ONLY (no visual styling)
   - Use exact oklch color values (not hex equivalents)
   - Match existing spacing, borders, shadows, animations

3. **SSE Streaming Reuse**
   - ALL Pelican panel messages go through existing use-streaming-chat.ts
   - NEVER call OpenAI directly
   - Conversations are saved to DB (appear in Chat history)

## 📁 File Structure (Phase 2)

```
hooks/
├── use-pelican-panel.ts          ✅ Complete
└── use-streaks.ts                 ⏳ Next

components/
├── pelican-panel/
│   ├── pelican-chat-panel.tsx     ⏳ Next
│   └── pelican-panel-message.tsx  ⏳ Optional (if needed)
├── navigation/
│   └── top-nav.tsx                ⏳ Next
└── providers/
    └── pelican-panel-provider.tsx ⏳ Next

app/
└── (features)/
    └── layout.tsx                 ⏳ Next

V2_UI_STYLE_GUIDE.md               ✅ Complete
```

## 🔄 Next Actions

1. Build `PelicanChatPanel` component (match message-bubble.tsx styling)
2. Build `TopNav` component (match conversation-sidebar.tsx header styling)
3. Build `useStreaks` hook (SWR pattern like use-market-data.ts)
4. Create `PelicanPanelProvider` context (provides panel state to features)
5. Create `(features)/layout.tsx` wrapper
6. Test full flow: navigate → click element → panel opens → send message
7. Verify build passes

## ⏱️ Estimated Completion

Phase 2 is the architectural foundation - most complex phase.
**ETA:** 4-6 more components + testing
**Status:** ~35% complete (2/6 core pieces done)
