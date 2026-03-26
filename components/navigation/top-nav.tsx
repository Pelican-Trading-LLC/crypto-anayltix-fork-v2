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
  '/alerts': 'AI ALERTS',
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
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/brief"
            className="flex items-center gap-2 sm:gap-3 group transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2C5F8A, #5B4F8A)' }}>
              CA
            </div>
            <span className="hidden sm:inline text-base font-bold text-[var(--text-primary)] tracking-tight">
              Token Analytix
            </span>
          </Link>
        </div>

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
