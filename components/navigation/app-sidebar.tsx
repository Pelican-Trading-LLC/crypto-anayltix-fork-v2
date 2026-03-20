"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquaresFour,
  MagnifyingGlass,
  Lightning,
  CalendarBlank,
  TrendUp,
  ArrowsClockwise,
  Fingerprint,
  ChatCircle,
  Bell,
  GraduationCap,
  Users,
  GearSix,
  CaretRight,
  CaretLeft,
  BookOpenText,
  Bird,
  Pulse,
  Scales,
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
    title: '', // No label for top section
    items: [
      { label: 'Daily Brief', href: '/brief', icon: Bird },
    ],
  },
  {
    title: 'FOREXANALYTIX',
    items: [
      { label: 'ForexAnalytix', href: '/forexanalytix', icon: Pulse, badge: '5 PiPs', accentTint: true },
    ],
  },
  {
    title: 'MARKETS',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: SquaresFour },
      { label: 'Token Intel', href: '/token-intel', icon: MagnifyingGlass },
      { label: 'Markets Intel', href: '/screener', icon: Scales },
      { label: 'Sector Rotation', href: '/sector-rotation', icon: ArrowsClockwise },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Wallet DNA', href: '/wallet-dna', icon: Fingerprint },
      { label: 'Smart Money', href: '/smart-money', icon: TrendUp },
      { label: 'Signals', href: '/signals', icon: Lightning },
      { label: 'AI Alerts', href: '/alerts', icon: Bell, badge: '3' },
    ],
  },
  {
    title: 'PELICAN AI',
    items: [
      { label: 'Ask Pelican', href: '/chat', icon: ChatCircle, accentTint: true },
    ],
  },
  {
    title: 'LEARN & REFERENCE',
    items: [
      { label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpenText },
      { label: 'Calendar', href: '/calendar', icon: CalendarBlank },
      { label: 'Learn', href: '/learn', icon: GraduationCap },
      { label: 'Community', href: '/community', icon: Users },
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
              <div className="text-[14px] font-bold text-white leading-tight">Token Analytix</div>
              <div className="text-[9px] font-mono text-[var(--text-muted)] tracking-[0.5px] leading-tight">POWERED BY PELICAN AI</div>
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
                        ? 'text-[#1DA1C4]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                    style={
                      active
                        ? { background: 'linear-gradient(90deg, rgba(29,161,196,0.08) 0%, transparent 80%)' }
                        : item.accentTint && !active
                          ? { background: 'rgba(29,161,196,0.04)' }
                          : undefined
                    }
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-[#1DA1C4]" />
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
                          <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1DA1C4]/15 text-[#1DA1C4]">
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

      {/* Spacer is handled by flex-1 on nav */}

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
