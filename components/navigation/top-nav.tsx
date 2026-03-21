"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { TICKER_DATA } from '@/lib/crypto-mock-data'

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
  '/dashboard': 'SITUATION ROOM',
  '/market-pulse': 'MARKET PULSE',
  '/predictions': 'PREDICTIONS',
  '/tokenization': 'TOKENIZATION',
  '/analyst-desk': 'ANALYST DESK',
  '/signals': 'SIGNALS & ALERTS',
  '/pelican-portal': 'ASK PELICAN',
  '/learn': 'KNOWLEDGE BASE',
  '/calendar': 'CALENDAR',
  '/settings': 'SETTINGS',
  '/chat': 'ASK PELICAN',
  '/brief': 'DAILY BRIEF',
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
    <div className={cn("sticky top-0 z-40 w-full", className)}>
      {/* Main nav bar */}
      <nav className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 sm:gap-3 group transition-opacity hover:opacity-80"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
                TA
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

      {/* Ticker strip */}
      <div className="h-8 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center h-full px-2 gap-0">
          {TICKER_DATA.map((ticker, idx) => (
            <React.Fragment key={ticker.symbol}>
              {idx > 0 && (
                <div className="w-px h-3.5 bg-[var(--border-subtle)] flex-shrink-0" />
              )}
              <div className="flex items-center gap-1.5 px-3 flex-shrink-0">
                <span className="text-xs text-[var(--text-muted)]">
                  {ticker.symbol}
                </span>
                <span className="text-xs font-mono tabular-nums text-white">
                  {ticker.price}
                </span>
                {'badge' in ticker && ticker.badge ? (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 leading-none">
                    {ticker.badge}
                  </span>
                ) : ticker.change ? (
                  <span className={cn(
                    "text-xs font-mono tabular-nums",
                    ticker.up ? "text-[var(--data-positive)]" : "text-[var(--data-negative)]"
                  )}>
                    {ticker.change}
                  </span>
                ) : null}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
