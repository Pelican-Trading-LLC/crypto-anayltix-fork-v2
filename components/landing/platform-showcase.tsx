'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'
import {
  UserCircle,
  Translate,
  ChartBar,
  Binoculars,
} from '@phosphor-icons/react'
import { ChatMock } from '@/components/landing/mocks/chat-mock'
import { BriefMock } from '@/components/landing/mocks/brief-mock'
import { HeatmapMock } from '@/components/landing/mocks/heatmap-mock'
import { PositionsMock } from '@/components/landing/mocks/positions-mock'

const features = [
  {
    id: 'portfolio',
    label: 'Portfolio AI',
    icon: UserCircle,
    title: 'AI That Knows Your Portfolio',
    description:
      'Ask Pelican about any position. It knows your entry price, your P&L, your funding costs, and your risk exposure. Every answer is personalized to YOUR portfolio.',
    highlights: [
      'Knows every position, entry price, and cost basis',
      'Real-time P&L and funding cost tracking',
      'Risk exposure analysis across your entire portfolio',
    ],
    mock: ChatMock,
  },
  {
    id: 'translation',
    label: 'Macro Translation',
    icon: Translate,
    title: 'Cross-Asset Translation',
    description:
      'Blake Morrow\u2019s team at ForexAnalytix publishes daily macro analysis. Pelican automatically translates it: \u201CDXY breaking below 104 support \u2014 historically, this correlates with a 15-20% BTC rally over 8 weeks.\u201D',
    highlights: [
      'ForexAnalytix macro analysis translated to crypto impact',
      'DXY, yields, and macro events mapped to BTC/ETH/SOL',
      'Historical correlation data backing every translation',
    ],
    mock: BriefMock,
  },
  {
    id: 'derivatives',
    label: 'Derivatives',
    icon: ChartBar,
    title: 'Derivatives Intelligence',
    description:
      'Funding rates, open interest, liquidation levels \u2014 explained in the language of overnight repo rates, futures basis, and carry costs. Not crypto jargon.',
    highlights: [
      'Funding rates explained as carry cost / repo rate equivalents',
      'Open interest and liquidation heatmaps',
      'Basis trade opportunities across exchanges',
    ],
    mock: HeatmapMock,
  },
  {
    id: 'smartmoney',
    label: 'Smart Money',
    icon: Binoculars,
    title: 'Smart Money Tracking',
    description:
      'Whale wallets, market maker flows, and institutional accumulation \u2014 with Pelican\u2019s AI interpretation of what each movement signals.',
    highlights: [
      'Whale wallet monitoring with AI-powered intent analysis',
      'Market maker flow detection across DEXs and CEXs',
      'Institutional accumulation patterns and alerts',
    ],
    mock: PositionsMock,
  },
] as const

export function PlatformShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const feature = features[activeFeature]!
  const MockComponent = feature.mock

  return (
    <Section id="platform">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            One platform. Every tool you need.
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
            Portfolio intelligence, macro translation, derivatives data, and smart money tracking
            &mdash; all connected, all personalized to your trading style.
          </p>
        </div>
      </ScrollReveal>

      {/* Tab bar */}
      <ScrollReveal delay={0.1}>
        <div className="flex justify-start md:justify-center gap-1.5 mb-10 md:mb-14 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {features.map((f, i) => {
            const Icon = f.icon
            const isActive = i === activeFeature
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeature(i)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                  isActive
                    ? 'bg-[#4A90C4]/15 text-[#4A90C4]'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon
                  weight={isActive ? 'fill' : 'regular'}
                  className="w-4 h-4"
                />
                {f.label}
              </button>
            )
          })}
        </div>
      </ScrollReveal>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: text content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <ul className="space-y-3">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4A90C4] mt-2 flex-shrink-0" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: mock component */}
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/50 bg-white">
              <MockComponent />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  )
}
