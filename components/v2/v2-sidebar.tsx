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
        'v2-sans relative flex items-center gap-[8px] mx-[6px] my-[1px] rounded-[6px] transition-colors',
        isActive
          ? 'border-l-2 border-[var(--v2-cyan)]'
          : 'border-l-2 border-transparent hover:bg-[var(--v2-bg-surface-3)]'
      )}
      style={{
        height: '36px',
        padding: '0 12px',
        fontSize: '12.5px',
        fontWeight: isActive ? 500 : 400,
        color: isActive ? 'var(--v2-text-primary)' : 'var(--v2-text-secondary)',
        background: isActive ? 'var(--v2-cyan-dim)' : undefined,
      }}
    >
      <item.icon
        size={16}
        weight={isActive ? 'fill' : 'regular'}
        style={{
          color: isActive ? 'var(--v2-cyan)' : 'var(--v2-text-tertiary)',
          flexShrink: 0,
        }}
      />
      <span>{item.label}</span>
      {item.badge != null && (
        <span
          className="v2-mono"
          style={{
            position: 'absolute',
            top: '4px',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'var(--v2-red)',
            color: 'white',
            fontSize: '9px',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
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
    <div
      className="v2-sans flex flex-col h-full"
      style={{
        width: '180px',
        background: 'var(--v2-bg-surface-1)',
        borderRight: '1px solid var(--v2-border)',
      }}
    >
      {/* Logo area */}
      <div style={{ padding: '16px 14px 12px' }}>
        <div className="flex items-center justify-between">
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--v2-text-primary)',
            }}
          >
            Token Analytix
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden"
              style={{
                color: 'var(--v2-text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p
          className="v2-mono"
          style={{
            fontSize: '8px',
            fontWeight: 500,
            color: 'var(--v2-text-quaternary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: '2px',
          }}
        >
          POWERED BY PELICAN AI
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1" style={{ paddingTop: '4px' }}>
        {navItems.map((item) => (
          <NavItem
            key={item.route}
            item={item}
            isActive={pathname.startsWith(item.route)}
          />
        ))}
      </nav>

      {/* User area */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--v2-border)' }}>
        <div className="flex items-center gap-2">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--v2-bg-surface-3)',
              color: 'var(--v2-text-secondary)',
              fontSize: '11px',
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            N
          </div>
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontSize: '11px',
                color: 'var(--v2-text-tertiary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              nick@pelicantrading.ai
            </p>
            <span
              className="v2-mono"
              style={{
                fontSize: '9px',
                fontWeight: 600,
                color: 'var(--v2-cyan)',
              }}
            >
              Pro
            </span>
          </div>
          <Link
            href="/settings"
            style={{
              color: 'var(--v2-text-tertiary)',
              flexShrink: 0,
              transition: 'color 120ms ease',
            }}
            aria-label="Settings"
          >
            <Gear size={14} />
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
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg"
        style={{
          background: 'var(--v2-bg-surface-1)',
          border: '1px solid var(--v2-border)',
          color: 'var(--v2-text-secondary)',
          cursor: 'pointer',
        }}
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
