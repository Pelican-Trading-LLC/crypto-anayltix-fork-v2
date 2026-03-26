"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GridFour, ChartLineUp, Clock, Bell, Wallet, Gear, List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// =============================================================================
// NAV ITEMS
// =============================================================================

interface NavItemConfig {
  label: string
  icon: typeof GridFour
  route: string
  badge?: number
}

const navItems: NavItemConfig[] = [
  { label: 'Dashboard', icon: GridFour, route: '/dashboard' },
  { label: 'Analysis Hub', icon: ChartLineUp, route: '/analysis-hub' },
  { label: 'Predictions', icon: Clock, route: '/predictions' },
  { label: 'Smart Alerts', icon: Bell, route: '/alerts', badge: 3 },
  { label: 'Smart Money', icon: Wallet, route: '/smart-money' },
]

// =============================================================================
// NAV ITEM COMPONENT
// =============================================================================

function NavItem({
  item,
  isActive,
}: {
  item: NavItemConfig
  isActive: boolean
}) {
  return (
    <Link
      href={item.route}
      className={cn(
        'relative flex items-center gap-[10px] h-9 px-3 rounded-md text-[13px] font-medium transition-colors',
        isActive
          ? 'bg-[rgba(6,182,212,0.08)] text-[var(--v2-text-primary)] border-l-2 border-[var(--v2-cyan)]'
          : 'text-[var(--v2-text-secondary)] hover:bg-[var(--v2-bg-hover)] border-l-2 border-transparent'
      )}
    >
      <item.icon
        size={20}
        weight={isActive ? 'fill' : 'regular'}
        className={cn(
          isActive ? 'text-[var(--v2-cyan)]' : 'text-[var(--v2-text-secondary)]'
        )}
      />
      <span>{item.label}</span>
      {item.badge != null && (
        <span className="absolute top-1 right-2 flex items-center justify-center w-4 h-4 rounded-full bg-[var(--v2-cyan)] text-white text-[10px] font-semibold leading-none">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

// =============================================================================
// SIDEBAR CONTENT (shared between desktop and mobile)
// =============================================================================

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="v2-sans flex flex-col h-full w-[200px] bg-[var(--v2-bg-surface)] border-r border-[var(--v2-border)]">
      {/* Logo area */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            TA
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-[var(--v2-text-secondary)] hover:text-[var(--v2-text-primary)] transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <p className="text-sm font-bold text-[var(--v2-text-primary)] mt-1">
          Token Analytix
        </p>
        <p className="text-[9px] uppercase tracking-[1px] text-[var(--v2-text-tertiary)] mt-0.5">
          Powered by Pelican AI
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.route}
            item={item}
            isActive={pathname.startsWith(item.route)}
          />
        ))}
      </nav>

      {/* User area */}
      <div className="p-4 border-t border-[var(--v2-border)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--v2-bg-elevated)] text-[var(--v2-text-secondary)] text-sm font-medium shrink-0">
            N
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--v2-text-secondary)] truncate">
              nick@pelicantrading.ai
            </p>
            <span className="inline-block text-[10px] text-[var(--v2-cyan)] bg-[var(--v2-cyan-dim)] px-1.5 py-0.5 rounded-full mt-0.5">
              Pro
            </span>
          </div>
          <Link
            href="/settings"
            className="text-[var(--v2-text-tertiary)] hover:text-[var(--v2-text-secondary)] transition-colors shrink-0"
            aria-label="Settings"
          >
            <Gear size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// V2 SIDEBAR (Desktop + Mobile)
// =============================================================================

export default function V2Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--v2-bg-surface)] border border-[var(--v2-border)] text-[var(--v2-text-secondary)] hover:text-[var(--v2-text-primary)] transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <List size={20} />
      </button>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative z-10">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
