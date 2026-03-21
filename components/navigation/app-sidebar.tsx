"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor,
  Pulse,
  Clock,
  GridFour,
  Users,
  Eye,
  ChatCircle,
  BookOpenText,
  CalendarBlank,
  GearSix,
  CaretRight,
  CaretLeft,
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
  badge?: {
    text: string
    color: 'green' | 'cyan' | 'red'
  }
  notificationCount?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

// =============================================================================
// NAV STRUCTURE — 9 tabs, grouped by section
// =============================================================================

const NAV_SECTIONS: NavSection[] = [
  {
    title: '',
    items: [
      { label: 'Situation Room', href: '/dashboard', icon: Monitor },
    ],
  },
  {
    title: 'MARKETS',
    items: [
      { label: 'Market Pulse', href: '/market-pulse', icon: Pulse },
      {
        label: 'Predictions',
        href: '/predictions',
        icon: Clock,
        badge: { text: 'LIVE', color: 'green' },
      },
      { label: 'Tokenization', href: '/tokenization', icon: GridFour },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      {
        label: 'Analyst Desk',
        href: '/analyst-desk',
        icon: Users,
        badge: { text: 'FA', color: 'cyan' },
      },
      {
        label: 'Signals & Alerts',
        href: '/signals',
        icon: Eye,
        notificationCount: 3,
      },
    ],
  },
  {
    title: 'PELICAN AI',
    items: [
      { label: 'Ask Pelican', href: '/pelican-portal', icon: ChatCircle },
    ],
  },
  {
    title: 'LEARN',
    items: [
      { label: 'Knowledge Base', href: '/learn', icon: BookOpenText },
      { label: 'Calendar', href: '/calendar', icon: CalendarBlank },
    ],
  },
]

// =============================================================================
// BADGE COLORS
// =============================================================================

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  green: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  cyan: { bg: 'rgba(6,182,212,0.15)', text: '#06B6D4' },
  red: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
}

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
        background: 'rgba(var(--bg-surface-rgb, 17 17 24) / 0.95)',
        backdropFilter: 'blur(20px) saturate(1.2)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-[var(--border-subtle)] flex-shrink-0">
        <div
          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}
        >
          TA
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap overflow-hidden"
            >
              <div className="text-[14px] font-bold text-white leading-tight" style={{ fontWeight: 700 }}>
                Token Analytix
              </div>
              <div className="text-[9px] font-mono text-[var(--text-muted)] leading-tight" style={{ letterSpacing: '0.5px' }}>
                POWERED BY PELICAN AI
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.title || idx}>
            {/* Section header */}
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
                        ? 'text-[#06B6D4]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                    style={
                      active
                        ? { background: 'rgba(6,182,212,0.12)' }
                        : undefined
                    }
                  >
                    {/* Active left border */}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r"
                        style={{ background: '#06B6D4' }}
                      />
                    )}

                    <Icon
                      size={18}
                      weight={active ? 'fill' : 'regular'}
                      className="flex-shrink-0"
                      style={active ? { color: '#06B6D4' } : undefined}
                    />

                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>

                        {/* Badge (LIVE, FA, etc.) */}
                        {item.badge && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
                            style={{
                              background: BADGE_STYLES[item.badge.color].bg,
                              color: BADGE_STYLES[item.badge.color].text,
                            }}
                          >
                            {item.badge.text}
                          </span>
                        )}

                        {/* Notification count dot */}
                        {item.notificationCount != null && item.notificationCount > 0 && (
                          <span
                            className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold leading-none text-white"
                            style={{ background: '#ef4444' }}
                          >
                            {item.notificationCount}
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
