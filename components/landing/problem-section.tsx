'use client'

import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import {
  Translate,
  LinkBreak,
  UserCircleGear,
} from '@phosphor-icons/react'

const problems = [
  {
    icon: Translate,
    title: 'You know how to trade. Crypto is just... different.',
    description:
      'Perpetual swaps, funding rates, token unlocks, on-chain whale movements \u2014 it\u2019s a different vocabulary for the same market principles you already understand. You just need a translator.',
  },
  {
    icon: LinkBreak,
    title: 'The data exists. Nobody connects it.',
    description:
      'Nansen shows on-chain flows. TradingRiot shows derivatives data. Your ForexAnalytix analyst is calling DXY levels. But nobody tells you what a DXY breakdown means for your BTC position.',
  },
  {
    icon: UserCircleGear,
    title: 'Generic tools weren\u2019t built for traders like you.',
    description:
      'CoinGecko gives you price charts. Crypto Twitter gives you opinions. Neither knows your portfolio, your risk tolerance, or that you spent 10 years trading ES futures.',
  },
]

export function ProblemSection() {
  return (
    <Section id="problem">
      <ScrollReveal>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Crypto is confusing. It doesn&apos;t have to be.
          </h2>
        </div>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {problems.map((problem, i) => (
          <ScrollReveal key={problem.title} delay={0.1 + i * 0.1}>
            <div className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50">
              <problem.icon
                weight="regular"
                className="mb-4 h-8 w-8 text-[#1DA1C4]"
              />
              <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                {problem.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {problem.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  )
}
