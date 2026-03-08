'use client'

import {
  Link as LinkIcon,
  GraduationCap,
  ChartLineUp,
  TrendUp,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import { Section } from '@/components/landing/section'

const steps = [
  {
    number: '01',
    icon: LinkIcon,
    title: 'Connect',
    description:
      'Link your exchange. Pelican sees your positions.',
  },
  {
    number: '02',
    icon: GraduationCap,
    title: 'Learn',
    description:
      'Complete education modules. Pelican calibrates to your experience level.',
  },
  {
    number: '03',
    icon: ChartLineUp,
    title: 'Analyze',
    description:
      'Get personalized signals, funding rate alerts, and macro translations relevant to YOUR portfolio.',
  },
  {
    number: '04',
    icon: TrendUp,
    title: 'Improve',
    description:
      'Track your performance. Pelican identifies patterns in your trading behavior.',
  },
  {
    number: '05',
    icon: ArrowsClockwise,
    title: 'Repeat',
    description:
      'Every interaction makes Pelican\u2019s analysis more relevant to how you trade.',
  },
]

export function FlywheelSection() {
  return (
    <Section className="bg-slate-50">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            The more you use it, the smarter it gets
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Day 1, Pelican gives great analysis. Day 100, it gives{' '}
            <span className="text-slate-900 font-medium">YOU-specific</span>{' '}
            insights based on your actual portfolio, trading style, and experience level.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="relative p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                {/* Faded number */}
                <span className="absolute top-4 right-4 text-4xl font-bold text-[#1DA1C4]/10 select-none">
                  {step.number}
                </span>

                <Icon
                  className="h-8 w-8 text-[#1DA1C4] mb-4"
                  weight="duotone"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>

      <ScrollReveal delay={0.5}>
        <div className="text-center max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-slate-500 text-base leading-relaxed">
            After 6 months, Pelican has analyzed hundreds of your trades,
            learned your macro preferences, calibrated to your risk tolerance, and built an
            intelligence profile unique to you.{' '}
            <span className="text-slate-900 font-medium">
              That&apos;s not something you can replicate with a spreadsheet.
            </span>
          </p>
        </div>
      </ScrollReveal>
    </Section>
  )
}
