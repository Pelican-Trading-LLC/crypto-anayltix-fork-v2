'use client'

import {
  TrendUp,
  CurrencyCircleDollar,
  ChartBar,
  ChartLineUp,
} from '@phosphor-icons/react'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import { Section } from '@/components/landing/section'

const archetypes = [
  {
    icon: TrendUp,
    title: 'Futures Traders',
    description:
      'You know ES, NQ, CL. Crypto perpetual swaps work the same way, with funding rates instead of roll costs. Pelican explains every difference.',
  },
  {
    icon: CurrencyCircleDollar,
    title: 'Forex Traders',
    description:
      'You read DXY, monitor yield differentials, trade macro themes. Pelican translates your macro toolkit directly into crypto positioning.',
  },
  {
    icon: ChartBar,
    title: 'Options Traders',
    description:
      'You understand Greeks, IV, and skew management. Crypto options are the same math. Pelican maps BTC vol surface to what you already know.',
  },
  {
    icon: ChartLineUp,
    title: 'Equity Traders',
    description:
      'You evaluate companies by revenue and growth. Crypto protocols work the same way \u2014 Pelican shows you FDV/revenue multiples and competitive moats.',
  },
]

export function MultiAssetSection() {
  return (
    <Section>
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Built for traders crossing over from TradFi
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Whatever you trade today, Pelican speaks your language.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {archetypes.map((archetype, i) => {
          const Icon = archetype.icon
          return (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-[#1DA1C4]/20 transition-colors">
                <Icon
                  className="h-7 w-7 text-[#1DA1C4] mb-3"
                  weight="duotone"
                />
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  {archetype.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {archetype.description}
                </p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </Section>
  )
}
