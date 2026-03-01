# Pelican Trading AI - V2 UI Style Guide
## MANDATORY Visual Design Reference for All New Components

**⚠️ CRITICAL RULE:**
The prototype files (`pelican-v2-prototype.jsx`, `pelican-v2-full.jsx`) are **LAYOUT WIREFRAMES ONLY**.
**DO NOT COPY:** Colors, fonts, spacing, borders, shadows, or any visual styling from prototypes.
**ONLY SOURCE OF TRUTH:** This document + `globals.css` + existing production components.

---

## 1. Color System (Dark Mode Primary)

### Background Layers
```tsx
// Main background
className="bg-background"  // #0a0a0f

// Surface layers (cards, panels)
className="bg-card"  // var(--surface-1)
className="bg-[var(--surface-1)]/40 backdrop-blur"  // Semi-transparent card
className="bg-[var(--surface-2)]"  // Elevated surface
className="bg-[var(--surface-3)]"  // Highest elevation

// Sidebar
className="bg-sidebar"  // var(--sidebar)
```

### Text Colors
```tsx
// Primary text
className="text-foreground"  // oklch(0.95 0.002 280)

// Muted text
className="text-muted-foreground"  // oklch(0.75 0 0)
className="text-muted-foreground/60"  // 60% opacity
className="text-muted-foreground/40"  // 40% opacity (very subtle)

// Sidebar text
className="text-sidebar-foreground"  // Sidebar-specific text color
```

### Brand Colors (Purple Accent)
```tsx
// Primary purple (buttons, links, highlights)
className="bg-primary text-primary-foreground"  // oklch(0.60 0.25 280)
className="text-primary"  // Purple text
className="border-primary"  // Purple border
className="bg-primary/10"  // 10% purple background (subtle highlight)
className="bg-primary/20"  // 20% purple background (active state)

// Purple gradients (for CTA buttons)
className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600"
className="hover:from-purple-700 hover:via-violet-700 hover:to-purple-700"

// Hover states
className="hover:bg-purple-500/10"  // Subtle purple hover
className="hover:text-purple-400"  // Purple text on hover
```

### Semantic Colors
```tsx
// Green (positive, gains)
className="text-green-500"  // Light green text
className="bg-green-500/10"  // Green background tint

// Red (negative, losses)
className="text-red-500"  // Red text
className="bg-red-500/10"  // Red background tint
className="hover:bg-red-500/20"  // Red hover (delete buttons)

// Orange (learning mode, streaks)
className="text-orange-500"  // #f97316
className="border-orange-500"  // Orange border

// Teal (secondary accent, calendar tab)
className="text-teal-500"  // Teal text
className="border-teal-500"  // Teal border

// Destructive (errors, warnings)
className="text-destructive"  // oklch(0.55 0.25 25)
className="bg-destructive"  // Red error background
```

### Borders
```tsx
// Default border
className="border border-border"  // oklch(0.35 0.08 280)
className="border-sidebar-border"  // Sidebar-specific border

// Transparent borders (subtle)
className="border border-white/5"  // Very subtle white border (dark mode)
className="border-sidebar-border/30"  // 30% opacity sidebar border

// Accent borders
className="border-l-2 border-l-primary"  // Left accent border (active state)
className="border-b-2 border-purple-500"  // Bottom border (active tab)
```

---

## 2. Typography

### Fonts
```tsx
// Body text - Inter (via font-sans)
className="font-sans"  // Inter, sans-serif

// Monospace - Geist Mono (via font-mono)
className="font-mono"  // Geist Mono (for tickers, code, numbers)

// Font weights
className="font-normal"  // 400
className="font-medium"  // 500 (most common)
className="font-semibold"  // 600 (headings)
className="font-bold"  // 700 (brand name, emphasis)
```

### Text Sizes
```tsx
// Extra small (timestamps, metadata)
className="text-[10px]"  // 10px

// Small (labels, captions)
className="text-xs"  // 12px

// Body text
className="text-sm"  // 14px (default for most UI)
className="text-base"  // 16px (chat messages, readable content)

// Headings
className="text-lg"  // 18px (dialog titles)
className="text-xl"  // 20px
className="text-2xl"  // 24px
```

### Text Styles
```tsx
// Line height
className="leading-none"  // Tight (for labels)
className="leading-relaxed"  // 1.625 (chat messages, long-form)

// Truncation
className="truncate"  // Single line ellipsis
className="line-clamp-2"  // 2 lines with ellipsis

// Word breaking (chat messages)
className="break-words"  // Break long words
className="overflow-wrap-anywhere"  // Force wrap anywhere

// Uppercase (section headers)
className="uppercase tracking-wider"  // All caps with letter spacing

// Numeric data (CRITICAL for prices, percentages)
className="tabular-nums"  // Monospace numbers for alignment
```

---

## 3. Spacing & Layout

### Padding
```tsx
// Common padding patterns
className="p-2"   // 8px (small cards)
className="p-3"   // 12px (medium cards)
className="p-4"   // 16px (standard padding)
className="p-6"   // 24px (dialog content, card content)

// Directional
className="px-3 py-2"  // Horizontal 12px, Vertical 8px (buttons, inputs)
className="px-4 py-3"  // Horizontal 16px, Vertical 12px
className="px-6"  // Horizontal 24px (card content with gap-6)
```

### Gaps (Flexbox/Grid)
```tsx
// Common gaps
className="gap-1"   // 4px (very tight)
className="gap-2"   // 8px (tight)
className="gap-3"   // 12px (comfortable)
className="gap-4"   // 16px (standard)
className="gap-6"   // 24px (card internal spacing)

// Space-y (vertical stack)
className="space-y-1"   // 4px vertical
className="space-y-2"   // 8px vertical
className="space-y-4"   // 16px vertical
```

### Margins
```tsx
// Common margins
className="mb-6"  // 24px bottom (section spacing)
className="mt-3"  // 12px top (button groups after content)
className="mx-2"  // 8px horizontal (sidebar items)
```

---

## 4. Border Radius

### Sizes
```tsx
className="rounded"     // 0.25rem (default)
className="rounded-md"  // 0.375rem (inputs, small buttons)
className="rounded-lg"  // 0.5rem (cards, conversation items)
className="rounded-xl"  // 0.75rem (large cards, panels)
className="rounded-2xl" // 1rem (message bubbles, user messages)
className="rounded-full" // 9999px (avatars, badges)

// Directional
className="rounded-l-none"  // No left radius (panel attached to edge)
className="rounded-t-xl"  // Top corners only
```

---

## 5. Shadows

### Shadow Utilities
```tsx
className="shadow-xs"   // Subtle shadow (buttons, inputs)
className="shadow-sm"   // Small shadow (0 1px 2px)
className="shadow-lg"   // Large shadow (dialogs)
className="shadow-xl"   // Extra large shadow (modals)

// No shadow
className="shadow-none"
```

---

## 6. Component Patterns

### Buttons

#### Primary Button (Purple gradient)
```tsx
<Button className="w-full h-10 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 text-white">
  <Plus className="w-4 h-4 mr-2" />
  New Chat
</Button>
```

#### Ghost Button (Transparent, hover accent)
```tsx
<Button
  variant="ghost"
  size="sm"
  className="h-11 sm:h-7 px-3 sm:px-2 min-h-[44px] sm:min-h-0 text-xs text-muted-foreground hover:text-foreground"
>
  <Copy className="h-4 w-4 sm:h-3 sm:w-3 mr-1" />
  Copy
</Button>
```

#### Icon Button
```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-10 w-10 hover:bg-sidebar-accent/50"
>
  <Settings className="h-4 w-4" />
</Button>
```

#### Destructive Button
```tsx
<Button
  variant="destructive"
  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
>
  Delete
</Button>
```

### Cards

#### Standard Card
```tsx
<Card className="border-border dark:border-white/5 rounded-xl p-6 shadow-sm bg-card">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Surface Card (Semi-transparent with backdrop blur)
```tsx
<Card className="bg-[var(--surface-1)]/40 backdrop-blur border-white/5 rounded-xl overflow-hidden">
  {/* Content */}
</Card>
```

### Inputs

#### Text Input
```tsx
<Input
  placeholder="Search..."
  className="h-10 pl-10 pr-3 bg-sidebar/50 border-sidebar-border/50"
/>
```

#### Textarea (Edit message pattern)
```tsx
<textarea
  className="w-full bg-white/[0.06] border border-border rounded-2xl px-4 py-3 text-[15px] sm:text-base leading-relaxed text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
  rows={4}
  autoFocus
/>
```

### Message Bubbles

#### User Message
```tsx
<div className="rounded-2xl bg-white/[0.06] px-4 py-3">
  <div className="text-[15px] sm:text-base leading-relaxed break-words text-foreground">
    {message.content}
  </div>
</div>
```

#### Assistant Message (No bubble, just text)
```tsx
<div className="text-[16px] sm:text-base leading-relaxed text-foreground">
  {/* MessageContent component handles formatting */}
</div>
```

### List Items (Conversation sidebar pattern)

#### Conversation Item
```tsx
<div
  className={cn(
    "conversation-item group relative cursor-pointer rounded-lg mx-2",
    "min-h-[48px] px-3 py-2 flex items-center gap-2",
    "transition-[background-color,border-color] duration-150 ease-in-out",
    isActive && "bg-primary/10 border border-primary/20 border-l-2 border-l-primary",
    !isActive && "hover:bg-sidebar-accent/50 border border-transparent"
  )}
>
  <div className="flex-1 min-w-0">
    <h3 className="font-medium text-sm truncate text-sidebar-foreground">
      {title}
    </h3>
    <span className="text-[10px] text-muted-foreground/60 leading-none">
      {timestamp}
    </span>
  </div>
</div>
```

### Section Headers
```tsx
<h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
  Section Title
</h4>
```

### Tab Navigation (Trading Context Panel pattern)
```tsx
<div className="flex items-center border-b border-white/5">
  <div className="flex flex-1">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        className={cn(
          "flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 relative",
          isActive
            ? "text-purple-500 border-purple-500"  // Active purple
            : "text-muted-foreground border-transparent hover:text-foreground hover:border-white/10"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
</div>
```

---

## 7. Animations & Transitions

### Framer Motion (Message bubbles)
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### Transition Classes
```tsx
// Standard transition
className="transition-colors duration-150"  // Color transitions (hover)
className="transition-[background-color,border-color] duration-150"  // Multiple properties
className="transition-opacity duration-150"  // Opacity (hover effects)
className="transition-all duration-200"  // All properties (use sparingly)

// Ease functions
className="ease-in-out"  // Smooth ease (default for most)
```

### Shimmer Loading (Skeleton)
```tsx
<div className="h-3.5 rounded shimmer" style={{ width: '65%' }} />
<div className="h-2.5 rounded shimmer" style={{ width: '40%', animationDelay: '150ms' }} />
```

---

## 8. Hover & Interactive States

### Hover Patterns
```tsx
// Subtle hover (list items, cards)
className="hover:bg-muted/30"  // Muted background tint
className="hover:bg-sidebar-accent/50"  // Sidebar item hover

// Button hovers
className="hover:text-foreground"  // Text color change
className="hover:opacity-100"  // Opacity increase (for initially dim elements)

// Destructive hover
className="hover:bg-red-500/20"  // Red tint on hover
```

### Focus States
```tsx
// All interactive elements should have:
className="focus-outline"  // Global focus style from globals.css

// Focus visible (keyboard navigation)
className="focus-visible:ring-purple-500 focus-visible:ring-1"
className="focus:outline-none focus:ring-1 focus:ring-purple-500"
```

### Active States
```tsx
// Active item (selected)
className="bg-primary/10 border border-primary/20 border-l-2 border-l-primary"

// Active tab
className="text-purple-500 border-purple-500"  // Purple underline

// Pressed state
className="active:bg-purple-500/20"  // Darker on click
```

---

## 9. Responsive Patterns

### Mobile-First Breakpoints
```tsx
// Tailwind breakpoints
sm:   // 640px
md:   // 768px
lg:   // 1024px
xl:   // 1280px (where sidebar shows)

// Common responsive patterns
className="hidden xl:block"  // Desktop only
className="xl:hidden"  // Mobile/tablet only
className="text-sm sm:text-base"  // Larger text on desktop

// Touch targets (mobile)
className="h-11 sm:h-7 min-h-[44px] sm:min-h-0"  // 44px mobile, 28px desktop
```

### Layout Shifts
```tsx
// Sidebar pattern
className="hidden xl:block w-[280px]"  // Hidden on mobile, fixed width desktop

// Panel width
className="w-full xl:w-[320px]"  // Full width mobile, fixed width desktop

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

---

## 10. Icons (Lucide React)

### Icon Sizing
```tsx
// Standard sizes
className="h-3 w-3"   // 12px (tiny, badges)
className="h-4 w-4"   // 16px (most common, buttons, labels)
className="h-5 w-5"   // 20px (headers)
className="h-6 w-6"   // 24px (large icons)
className="h-8 w-8"   // 32px (avatars, empty states)

// Icons in buttons
<Copy className="h-4 w-4 sm:h-3 sm:w-3 mr-1" />  // Responsive sizing
```

### Common Icons
```tsx
import {
  Plus,           // New chat, add
  Search,         // Search input
  MessageSquare,  // Empty conversation state
  Trash2,         // Delete
  Edit3,          // Edit/rename
  Settings,       // Settings
  User,           // Profile/avatar
  LogOut,         // Sign out
  Copy,           // Copy message
  Check,          // Copied state
  RefreshCw,      // Regenerate
  Loader2,        // Loading spinner (with animate-spin)
  TrendingUp,     // Positive change
  TrendingDown,   // Negative change
  Star,           // Watchlist
  GraduationCap,  // Learning mode
  Menu,           // Mobile menu
  XIcon,          // Close
} from "lucide-react"
```

---

## 11. Modal/Dialog Patterns

### Standard Dialog
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[425px] border-border/50 shadow-xl bg-background/95 backdrop-blur-md">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Alert Dialog (Confirmation)
```tsx
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent className="sm:max-w-[425px]">
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>
        Confirm
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 12. Loading States

### Spinner
```tsx
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />

// Loader2 icon (preferred for buttons)
<Loader2 className="h-4 w-4 animate-spin" />
```

### Skeleton Shimmer (Conversation sidebar pattern)
```tsx
<div className="space-y-1 px-2 py-3">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg">
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 rounded shimmer" style={{ width: `${65 + (i * 7) % 30}%` }} />
        <div className="h-2.5 rounded shimmer" style={{ width: `${40 + (i * 11) % 35}%`, animationDelay: `${i * 150}ms` }} />
      </div>
    </div>
  ))}
</div>
```

---

## 13. Critical "DO NOT" List

### ❌ DO NOT:
1. Use hex colors from prototypes - use oklch/CSS variables from globals.css
2. Invent new spacing values - use Tailwind scale (1, 2, 3, 4, 6, 8, etc.)
3. Create custom shadows - use shadow-xs, shadow-sm, shadow-lg, shadow-xl
4. Use custom fonts - only Inter (body) and Geist Mono (code/numbers)
5. Add new color variants - stick to primary (purple), destructive (red), green, orange
6. Use `any` type - always use proper TypeScript types
7. Use React.lazy - use `next/dynamic` instead (App Router pattern)
8. Modify read-only files (use-chat.ts, use-streaming-chat.ts, use-conversations.ts)
9. Call OpenAI directly - always use existing SSE streaming system
10. Skip `tabular-nums` on prices/percentages - critical for alignment

### ✅ DO:
1. Copy exact className strings from existing components
2. Use `cn()` utility for conditional classes
3. Match responsive patterns (hidden xl:block, etc.)
4. Use Framer Motion for page/component animations (already installed)
5. Follow existing button variant patterns (default, ghost, destructive, outline)
6. Use existing hooks pattern with SWR for data fetching
7. Test on mobile breakpoints (<768px) - mobile-first design
8. Include proper ARIA labels for accessibility
9. Use existing translation system for user-facing strings
10. Run `npm run build` before any commit

---

## 14. Reference Component Files

**Study these files for visual patterns:**
- `components/chat/message-bubble.tsx` - Message styling
- `components/chat/conversation-sidebar.tsx` - List items, sidebar layout
- `components/chat/trading-context-panel.tsx` - Panel layout, tabs, cards
- `components/ui/button.tsx` - Button variants
- `components/ui/card.tsx` - Card structure
- `components/ui/dialog.tsx` - Modal patterns
- `components/ui/input.tsx` - Input styling
- `app/globals.css` - Custom classes, animations, color variables

---

## 15. Quick Reference Checklist

Before writing any new component, verify:
- [ ] Reviewed existing component with similar purpose
- [ ] Using oklch colors from globals.css (not hex from prototypes)
- [ ] Using Tailwind spacing scale (not custom pixel values)
- [ ] Following existing button/card/input patterns
- [ ] Using `tabular-nums` for numeric data
- [ ] Including responsive classes (sm:, md:, xl:)
- [ ] Adding proper hover/focus states
- [ ] Using Framer Motion for animations (if needed)
- [ ] Proper TypeScript types (no `any`)
- [ ] Testing on mobile (<768px)

---

**Last Updated:** 2026-02-12
**Status:** ✅ Style guide complete - Ready for Phase 2 implementation
