"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquaresFour,
  MagnifyingGlass,
  TrendUp,
  ArrowsClockwise,
  Bell,
  GearSix,
  CaretRight,
  CaretLeft,
  Pulse,
  Briefcase,
} from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { useAuth } from '@/lib/providers/auth-provider'

// =============================================================================
// TYPES
// =============================================================================

interface NavItem {
  label: string
  href: string
  icon: PhosphorIcon
  badge?: string
  accentTint?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

// =============================================================================
// NAV STRUCTURE
// =============================================================================

const NAV_SECTIONS: NavSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: SquaresFour },
      { label: 'Analysis Hub', href: '/forexanalytix', icon: Pulse },
      { label: 'Predictions', href: '/screener', icon: ArrowsClockwise },
      { label: 'Smart Alerts', href: '/alerts', icon: Bell, badge: '3' },
      { label: 'Positions', href: '/positions', icon: Briefcase },
      { label: 'Smart Money', href: '/smart-money', icon: TrendUp },
    ],
  },
]

// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative hidden md:flex flex-col flex-shrink-0 h-screen border-r border-[var(--border-default)]"
      style={{
        background: 'var(--bg-surface-1)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-[var(--border-subtle)] flex-shrink-0">
        <img src="/images/token-analytix-logo.png" alt="Token Analytix" width={44} height={44} style={{ objectFit: 'contain' }} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap overflow-hidden"
            >
              <div className="text-[13px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                Token Analytix
              </div>
              <div className="text-[8px] font-semibold font-mono tracking-[0.08em] text-[var(--text-quaternary)]">
                POWERED BY PELICAN AI
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search placeholder */}
      {!collapsed && (
        <div className="px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs">
            <MagnifyingGlass size={14} />
            <span>Search...</span>
          </div>
        </div>
      )}

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.title || idx}>
            {!collapsed && section.title && (
              <div className="px-4 mb-1.5 text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-[13px] font-medium transition-colors relative ${
                      active
                        ? 'text-[#4A90C4]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(90,130,180,0.04)]'
                    }`}
                    style={
                      active
                        ? { background: 'linear-gradient(90deg, rgba(74,144,196,0.08) 0%, transparent 80%)' }
                        : item.accentTint && !active
                          ? { background: 'rgba(74,144,196,0.04)' }
                          : undefined
                    }
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-[#4A90C4]" />
                    )}
                    <Icon
                      size={18}
                      weight={active ? 'fill' : 'regular'}
                      className="flex-shrink-0"
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className="ml-auto flex items-center justify-center rounded-full font-mono font-bold text-white"
                            style={{
                              width: 16,
                              height: 16,
                              fontSize: 9,
                              background: 'var(--data-negative)',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Command K shortcut */}
      {!collapsed && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>&#x2318;K</span>
        </div>
      )}

      {/* Connection status */}
      <div className="px-3 py-1.5 border-t border-[var(--border-subtle)] flex items-center gap-1.5">
        <span className="live-dot" style={{ width: 6, height: 6 }} />
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Market Open</span>
        {!collapsed && (
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)', marginLeft: 'auto' }}>Synced 2s ago</span>
        )}
      </div>

      {/* User section */}
      <div className="p-3 border-t border-[var(--border-subtle)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)] flex-shrink-0">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-primary)] truncate">
                  {user?.email || 'user@example.com'}
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">Pro</div>
              </div>
              <Link href="/settings">
                <GearSix
                  size={16}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] z-10 transition-colors"
      >
        {collapsed ? <CaretRight size={12} /> : <CaretLeft size={12} />}
      </button>
    </motion.aside>
  )
}
