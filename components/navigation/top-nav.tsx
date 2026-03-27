"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

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
  '/token-intel': 'TOKEN INTEL',
  '/sector-rotation': 'SECTOR ROTATION',
  '/wallet-dna': 'WALLET DNA',
  '/knowledge-base': 'KNOWLEDGE BASE',
  '/community': 'COMMUNITY',
  '/screener': 'TOKEN SCREENER',
  '/alerts': 'SMART ALERTS',
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

  const pageTitle = getPageTitle(pathname)

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xl",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: spacer for symmetry */}
        <div className="flex items-center gap-3 flex-shrink-0" />

        {/* Center: Page Title */}
        {pageTitle && (
          <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest text-[var(--text-muted)]">
            {pageTitle}
          </div>
        )}

        {/* Right: placeholder for future items */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0" />
      </div>
    </nav>
  )
}
