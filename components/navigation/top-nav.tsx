"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { useCreditsContext } from '@/providers/credits-provider'
import { IconTooltip } from '@/components/ui/icon-tooltip'

// =============================================================================
// TYPES
// =============================================================================

interface TopNavProps {
  className?: string
}

// =============================================================================
// ROUTE TITLES
// =============================================================================

const routeTitles: Record<string, string> = {
  '/dashboard': 'DASHBOARD',
  '/signals': 'SIGNALS',
  '/calendar': 'CALENDAR',
  '/learn': 'LEARN',
  '/settings': 'SETTINGS',
  '/chat': 'ASK PELICAN',
  '/brief': 'DAILY BRIEF',
  '/morning': 'DAILY BRIEF',
  '/smart-money': 'SMART MONEY',
  '/community': 'COMMUNITY',
  '/screener': 'TOKEN SCREENER',
  '/alerts': 'AI ALERTS',
  '/positions': 'POSITIONS',
  '/journal': 'JOURNAL',
  '/playbooks': 'PLAYBOOKS',
  '/heatmap': 'HEATMAP',
  '/correlations': 'CORRELATIONS',
  '/earnings': 'EARNINGS',
  '/strategies': 'STRATEGIES',
}

function getPageTitle(pathname: string): string {
  // Exact match
  if (routeTitles[pathname]) return routeTitles[pathname]
  // Prefix match (e.g. /strategies/some-slug)
  const base = '/' + pathname.split('/')[1]
  return routeTitles[base] || ''
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TopNav({ className }: TopNavProps) {
  const pathname = usePathname()
  const { credits } = useCreditsContext()

  const pageTitle = getPageTitle(pathname)

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xl",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 sm:gap-3 group transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1DA1C4, #178BA8)' }}>
              CA
            </div>
            <span className="hidden sm:inline text-base font-bold text-[var(--text-primary)] tracking-tight">
              Crypto Analytix
            </span>
          </Link>
        </div>

        {/* Center: Page Title */}
        {pageTitle && (
          <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest text-[var(--text-muted)]">
            {pageTitle}
          </div>
        )}

        {/* Right: Credits */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
          <IconTooltip label="Credit balance" side="bottom">
            <Link
              href="/pricing"
              className="px-2 sm:px-3 py-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs sm:text-sm font-mono text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] active:scale-95 transition-all tabular-nums"
            >
              <span className="hidden sm:inline">{(credits?.balance ?? 0).toLocaleString()} credits</span>
              <span className="sm:hidden">{(credits?.balance ?? 0).toLocaleString()}</span>
            </Link>
          </IconTooltip>
        </div>
      </div>
    </nav>
  )
}
