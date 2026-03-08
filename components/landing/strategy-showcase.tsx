'use client'

import { Lightning, UserCircle, UsersThree } from '@phosphor-icons/react'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import { Section } from '@/components/landing/section'

interface AnalystProfile {
  name: string
  description: string
  icon: typeof UserCircle
  badgeLabel: string
  badgeColor: string
}

const ANALYSTS: AnalystProfile[] = [
  {
    name: 'Blake Morrow',
    description:
      'Harmonic patterns and macro analysis applied to BTC, ETH, and major alts. 15+ years of TradFi experience.',
    icon: UserCircle,
    badgeLabel: 'Lead Analyst',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Grega Horvat',
    description:
      'Elliott Wave specialist. Precise wave counts on crypto with clear targets and invalidation levels.',
    icon: UserCircle,
    badgeLabel: 'Wave Analyst',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Multi-Analyst Synthesis',
    description:
      'Pelican combines all analyst calls with derivatives data and on-chain intelligence. When Grega\u2019s wave count aligns with Blake\u2019s harmonic pattern and smart money is accumulating \u2014 that\u2019s a signal.',
    icon: UsersThree,
    badgeLabel: 'AI-Powered',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
]

export function StrategyShowcase() {
  return (
    <Section id="strategies">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1DA1C4]/10 border border-[#1DA1C4]/20 text-[#1DA1C4] text-xs font-semibold tracking-wide uppercase mb-6">
            <Lightning weight="fill" className="w-3.5 h-3.5" />
            Analyst Network
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Powered by ForexAnalytix Analysts
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Professional TradFi analysts bringing institutional-grade technical and macro analysis to crypto markets.
            Pelican synthesizes their calls with on-chain data and derivatives intelligence.
          </p>
        </div>
      </ScrollReveal>

      {/* Analyst Cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ANALYSTS.map((analyst, i) => {
            const Icon = analyst.icon
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6 flex flex-col h-full">
                    <Icon
                      className="h-10 w-10 text-[#1DA1C4] mb-4"
                      weight="duotone"
                    />
                    <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                      {analyst.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${analyst.badgeColor}`}
                      >
                        {analyst.badgeLabel}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {analyst.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </ScrollReveal>

      {/* Summary */}
      <ScrollReveal delay={0.3}>
        <div className="text-center mt-12 md:mt-16">
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Every analyst call is automatically ingested by Pelican and cross-referenced with
            derivatives flow, funding rates, and on-chain wallet movements.
          </p>
        </div>
      </ScrollReveal>
    </Section>
  )
}
