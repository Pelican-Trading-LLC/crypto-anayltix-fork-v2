'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react'

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-slate-200/80'
        : 'bg-white/80 backdrop-blur-xl border-transparent'
    }`}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1DA1C4, #178BA8)' }}>TA</div>
          <span className="text-sm font-semibold text-slate-900">Token Analytix</span>
        </Link>

        {/* Center: Nav links (hidden on mobile) */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/#platform"
            className="text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900"
          >
            Platform
          </a>
          <Link
            href="/how-to-use"
            className="text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900"
          >
            How It Works
          </Link>
          <a
            href="/#pricing"
            className="text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900"
          >
            Pricing
          </a>
          <a
            href="/#faq"
            className="text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900"
          >
            FAQ
          </a>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden text-sm text-slate-500 transition-colors duration-150 hover:text-slate-900 sm:block"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="hidden rounded-lg bg-gradient-to-r from-[#1A6FB5] to-[#25BFDF] px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98] sm:block"
          >
            Start Free
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X weight="bold" className="h-6 w-6 text-slate-700" />
            ) : (
              <List weight="bold" className="h-6 w-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="/#platform"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Platform
            </a>
            <Link
              href="/how-to-use"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              How It Works
            </Link>
            <a
              href="/#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Pricing
            </a>
            <a
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              FAQ
            </a>
            <Link
              href="/auth/login"
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-gradient-to-r from-[#1A6FB5] to-[#25BFDF] px-4 py-2.5 text-center text-sm font-medium text-white transition-all hover:opacity-90"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
