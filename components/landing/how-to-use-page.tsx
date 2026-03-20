'use client'

import Link from 'next/link'
import {
  ChatCircle,
  Wallet,
  ChartLineUp,
  Lightning,
  GraduationCap,
} from '@phosphor-icons/react'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'

const sections = [
  {
    id: 'connect',
    icon: Wallet,
    shortTitle: 'Connect',
    title: 'Sign up and connect your exchange',
    description:
      'Link Kraken, Coinbase, or Binance via SnapTrade. Read-only API keys, encrypted, no withdrawal permissions.',
    content: [
      'Create your free account in seconds',
      'Connect your exchange with read-only API keys via SnapTrade',
      'Your credentials are encrypted and never stored directly',
      'Supports Kraken, Coinbase, Binance, and other major exchanges',
    ],
    keyPoint:
      'SnapTrade is an established fintech provider used by major financial apps. Your funds remain fully under your control at all times.',
    cta: { label: 'Create your account \u2192', href: '/auth/signup' },
  },
  {
    id: 'dashboard',
    icon: ChartLineUp,
    shortTitle: 'Dashboard',
    title: 'Explore your dashboard',
    description:
      'See portfolio, market pulse, top movers, and smart money activity \u2014 all translated into TradFi language.',
    content: [
      'Portfolio overview with positions, P&L, and exposure breakdown',
      'Market pulse: funding rates, open interest, and derivatives activity',
      'Top movers across spot and derivatives markets',
      'Smart money activity: whale wallet movements and exchange flows',
    ],
    keyPoint:
      'Every metric on the dashboard is contextualized for TradFi traders. Funding rates are explained as carry costs, perpetuals as futures, and on-chain flows as institutional positioning.',
    cta: { label: 'See the dashboard \u2192', href: '/auth/signup' },
  },
  {
    id: 'pelican',
    icon: ChatCircle,
    shortTitle: 'Pelican',
    title: 'Ask Pelican anything',
    description:
      'Conversational AI that knows your portfolio, understands market data, and speaks your language.',
    content: [
      '"What are funding rates?" \u2014 get a TradFi-native explanation',
      '"Analyze my ETH position" \u2014 portfolio-aware analysis',
      '"What does the DXY move mean for crypto?" \u2014 cross-asset translation',
      '"Translate this CT thread" \u2014 decode crypto-native signals',
    ],
    keyPoint:
      'Pelican combines real-time market data with ForexAnalytix analyst content. It knows your positions and translates everything into the language of a traditional trader.',
    cta: { label: 'Ask Pelican \u2192', href: '/auth/signup' },
  },
  {
    id: 'signals',
    icon: Lightning,
    shortTitle: 'Signals',
    title: 'Follow the signals',
    description:
      'Analyst calls, CT translations, whale movements, and macro translations \u2014 all in one feed.',
    content: [
      'ForexAnalytix analyst calls with Elliott Wave and harmonic patterns applied to crypto',
      'CT signal translations: crypto Twitter alpha decoded for TradFi traders',
      'Whale wallet tracking: see what smart money is accumulating or distributing',
      'Macro translations: how DXY, yields, and equity flows impact crypto',
    ],
    keyPoint:
      'ForexAnalytix is the largest independent TradFi analyst community with 25,000+ members. Their analysts bring decades of experience in technical analysis applied to digital assets.',
    cta: { label: 'See the signals \u2192', href: '/auth/signup' },
  },
  {
    id: 'education',
    icon: GraduationCap,
    shortTitle: 'Education',
    title: 'Complete the education',
    description:
      '7 modules that bridge TradFi to crypto. Built for traders, not beginners.',
    content: [
      'Module 1: Crypto market structure \u2014 exchanges, order types, and settlement',
      'Module 2: Perpetual futures and funding rates (the TradFi carry trade equivalent)',
      'Module 3: On-chain data \u2014 what it means and how to read it',
      'Module 4: DeFi fundamentals \u2014 lending, liquidity, and yield',
      'Module 5: Crypto derivatives \u2014 options, basis trading, and vol',
    ],
    keyPoint:
      'Each module translates something you already know from TradFi into the crypto equivalent. No "what is Bitcoin" basics \u2014 this is designed for experienced traders crossing over.',
    cta: { label: 'Start learning \u2192', href: '/auth/signup' },
  },
]

export function HowToUsePage() {
  return (
    <main className="pt-24 pb-16 overflow-x-hidden">
      <Section>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Getting Started with Token Analytix
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From signup to crypto fluency &mdash; five steps to navigate crypto markets with confidence.
            </p>
          </div>
        </ScrollReveal>

        {/* Quick nav */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto mb-16">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <Icon weight="duotone" className="h-4 w-4 text-[#1DA1C4] shrink-0" />
                  {section.shortTitle}
                </a>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Sections */}
        <div className="max-w-3xl mx-auto space-y-16">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <ScrollReveal key={section.id} delay={0.1}>
                <div id={section.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1DA1C4]/10">
                      <Icon weight="duotone" className="h-5 w-5 text-[#1DA1C4]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        <span className="text-[#1DA1C4] font-mono mr-2">{index + 1}.</span>
                        {section.title}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-[52px]">
                    {section.content.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1DA1C4] mt-2 shrink-0" />
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {section.keyPoint && (
                    <div className="ml-[52px] mt-4 rounded-lg border border-[#1DA1C4]/20 bg-[#1DA1C4]/5 px-4 py-3">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {section.keyPoint}
                      </p>
                    </div>
                  )}

                  {section.cta && (
                    <div className="ml-[52px] mt-4">
                      <Link
                        href={section.cta.href}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1A6FB5] to-[#25BFDF] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-colors"
                      >
                        {section.cta.label}
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </Section>
    </main>
  )
}
