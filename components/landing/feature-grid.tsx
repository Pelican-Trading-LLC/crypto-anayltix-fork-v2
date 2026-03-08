'use client'

import {
  ChatCircle,
  ArrowsLeftRight,
  ChartLineUp,
  Lightning,
  CalendarBlank,
  GraduationCap,
} from '@phosphor-icons/react'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import { Section } from '@/components/landing/section'

const features = [
  {
    icon: ChatCircle,
    title: 'Pelican AI Chat',
    description:
      'Ask anything about crypto. Pelican responds in the language of a futures trader, not a crypto bro. Funding rates? Think repo rates. Liquidation cascades? Think short squeezes on ES.',
  },
  {
    icon: ArrowsLeftRight,
    title: 'Cross-Asset Translation',
    description:
      'ForexAnalytix analysts publish DXY, yield curve, and risk sentiment analysis. Pelican auto-translates every macro call into crypto implications for your portfolio.',
  },
  {
    icon: ChartLineUp,
    title: 'Portfolio Dashboard',
    description:
      'Connect your exchange via SnapTrade. See positions, P&L, funding costs, correlation to BTC, and Pelican\u2019s AI analysis on every holding \u2014 all in one view.',
  },
  {
    icon: Lightning,
    title: 'Signal Intelligence',
    description:
      'Analyst calls, Crypto Twitter translations, whale wallet movements, and macro translations \u2014 all filtered through Pelican\u2019s AI to highlight what matters for YOUR positions.',
  },
  {
    icon: CalendarBlank,
    title: 'Crypto Calendar',
    description:
      'Token unlocks, governance votes, options expiries, FOMC meetings \u2014 each event mapped to potential crypto impact with Pelican\u2019s pre-analysis.',
  },
  {
    icon: GraduationCap,
    title: 'TradFi Bridge Education',
    description:
      '7 modules that explain every crypto concept using the TradFi analogs you already know. Perpetual swaps = auto-rolling futures. Custody = being your own DTCC.',
  },
]

export function FeatureGrid() {
  return (
    <Section id="features">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            The Full Platform
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Everything a TradFi trader needs to cross over into crypto with confidence.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Icon
                  className="h-5 w-5 text-[#1DA1C4] mb-3"
                  weight="duotone"
                />
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </Section>
  )
}
