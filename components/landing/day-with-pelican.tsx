'use client'

import { Sun, Translate, Binoculars, ChatCircle, Warning, BookOpen } from '@phosphor-icons/react'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import { Section } from '@/components/landing/section'
import { cn } from '@/lib/utils'

const timelineItems = [
  {
    time: '6:00 AM',
    title: 'Daily Brief arrives',
    description:
      'BTC pushed above $84K overnight. Your portfolio is up 4.1%. SOL funding rates are elevated \u2014 Pelican flags the carry cost.',
    color: 'cyan' as DotColor,
    icon: Sun,
  },
  {
    time: '8:30 AM',
    title: 'Macro Translation',
    description:
      'Blake\u2019s team flags DXY breaking below 104 support. Pelican translates: historically bullish for crypto \u2014 correlates with 15-20% BTC rally over 8 weeks.',
    color: 'cyan' as DotColor,
    icon: Translate,
  },
  {
    time: '11:00 AM',
    title: 'Smart Money Alert',
    description:
      'Wintermute accumulated 250k UNI ($1.2M). Pelican: likely positioning ahead of v4 launch. On-chain confidence score: high.',
    color: 'cyan' as DotColor,
    icon: Binoculars,
  },
  {
    time: '2:00 PM',
    title: 'Ask Pelican anything',
    description:
      'You ask: "Should I reduce my SOL position?" Pelican responds with your funding costs, the upcoming token unlock, and a full risk assessment.',
    color: 'cyan' as DotColor,
    icon: ChatCircle,
  },
  {
    time: '4:30 PM',
    title: 'Calendar Alert',
    description:
      'BTC options expiry Friday, $4.2B notional. Max pain at $82K. Pelican suggests tightening stops on leveraged positions.',
    color: 'cyan' as DotColor,
    icon: Warning,
  },
  {
    time: 'Evening',
    title: 'Portfolio review & learn',
    description:
      'Review your day\u2019s performance. Learn module: "Funding Rates Explained" \u2014 completing your daily crypto education.',
    color: 'slate' as DotColor,
    icon: BookOpen,
    isOngoing: true,
  },
]

type DotColor = 'cyan' | 'slate'

const dotColors: Record<DotColor, { border: string; bg: string }> = {
  cyan: { border: 'border-[#1DA1C4]', bg: 'bg-[#1DA1C4]/20' },
  slate: { border: 'border-slate-400', bg: 'bg-slate-400/20' },
}

export function DayWithPelican() {
  return (
    <Section>
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            A Day with Token Analytix
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From morning brief to evening review, every step is connected.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative max-w-2xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#1DA1C4]/50 via-[#1DA1C4]/20 to-transparent" />

        <div className="space-y-10">
          {timelineItems.map((item, i) => {
            const Icon = item.icon
            const colors = dotColors[item.color]
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="relative pl-16">
                  {/* Dot */}
                  <div
                    className={cn(
                      'absolute left-4 top-1 w-4 h-4 rounded-full border-2',
                      colors.border,
                      colors.bg
                    )}
                  />

                  {/* Content */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <Icon
                        className="h-5 w-5 text-slate-400"
                        weight="duotone"
                      />
                      {'isOngoing' in item && item.isOngoing ? (
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {item.time}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {item.time}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
