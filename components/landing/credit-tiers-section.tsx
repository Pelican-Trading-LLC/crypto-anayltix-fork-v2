'use client'

import {
  Infinity as InfinityIcon,
  ChartLineUp,
  Users,
} from '@phosphor-icons/react'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'

const benefits = [
  {
    icon: InfinityIcon,
    title: 'No credit limits',
    description:
      'Ask Pelican as many questions as you want. No per-query fees. No token counting.',
  },
  {
    icon: ChartLineUp,
    title: 'Real data, not simulations',
    description:
      'Connect your actual exchange. See your real positions. Get analysis on your real portfolio.',
  },
  {
    icon: Users,
    title: 'Built by traders, for traders',
    description:
      'Jack built Pelican after years of trading. Blake runs the largest independent analyst community in TradFi. This isn\u2019t a crypto startup \u2014 it\u2019s a trading platform.',
  },
]

export function CreditTiersSection() {
  return (
    <Section>
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            A complete crypto intelligence platform without the nickel-and-diming.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon
          return (
            <ScrollReveal key={benefit.title} delay={i * 0.08}>
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <Icon
                  className="h-8 w-8 text-[#1DA1C4] mx-auto mb-4"
                  weight="duotone"
                />
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </Section>
  )
}
