'use client'

import Link from 'next/link'
import { Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import { PLAN_CONFIG } from '@/lib/plans'

const plans = [
  {
    name: PLAN_CONFIG.none.label,
    price: PLAN_CONFIG.none.price,
    planId: 'none',
    description: 'Explore crypto with TradFi training wheels',
    features: [
      'Daily market brief',
      '7 education modules',
      'Portfolio dashboard (demo mode)',
      '3 Pelican questions/day',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: PLAN_CONFIG.starter.label,
    price: PLAN_CONFIG.starter.price,
    planId: 'starter',
    description: 'For traders ready to go deeper into crypto',
    features: [
      'Everything in Free',
      'Unlimited Pelican questions',
      'Analyst signal feed',
      'Smart money alerts',
      'Watchlist with alerts',
      'Community access',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: PLAN_CONFIG.pro.label,
    price: PLAN_CONFIG.pro.price,
    planId: 'pro',
    description: 'Full crypto intelligence for serious traders',
    features: [
      `Everything in ${PLAN_CONFIG.starter.label}`,
      'Pelican Portal (full conversational AI)',
      'Conversation history',
      'Cross-asset translation feed',
      'CT signal translations',
      'Wallet tracking',
      'Intelligence alerts',
      'Priority support',
    ],
    cta: 'Start Free',
    highlighted: true,
  },
  {
    name: PLAN_CONFIG.power.label,
    price: PLAN_CONFIG.power.price,
    planId: 'power',
    description: 'Higher limits for professional research workflows',
    features: [
      `Everything in ${PLAN_CONFIG.pro.label}`,
      '10,000 monthly credits',
      'Heavy research workflows',
      'Professional usage limits',
      'Priority support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <Section id="pricing">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-lg">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <ScrollReveal key={plan.planId} delay={i * 0.1}>
            <div
              className={cn(
                'relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300',
                plan.highlighted
                  ? 'bg-[#4A90C4]/5 border-2 border-[#4A90C4] shadow-md'
                  : 'bg-white border border-slate-200 shadow-sm'
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#2C5F8A] to-[#5BA3D9] text-white text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 font-mono">
                  ${plan.price}
                </span>
                <span className="text-sm text-slate-400">/mo</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      weight="bold"
                      className="h-4 w-4 text-[#4A90C4] mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-slate-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className={cn(
                  'block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]',
                  plan.highlighted
                    ? 'bg-gradient-to-r from-[#2C5F8A] to-[#5BA3D9] hover:opacity-90 text-white shadow-lg'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                )}
              >
                {plan.cta}
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4}>
        <p className="text-center text-sm text-slate-400 mt-10">
          Free tier available. No credit card required. Upgrade anytime.
        </p>
      </ScrollReveal>
    </Section>
  )
}
