'use client'

import { motion } from 'framer-motion'
import {
  ChartLineUp,
  ShieldCheck,
  Brain,
  Bell,
  Lightning,
  Check,
  Plus,
  ChatCircleDots,
} from '@phosphor-icons/react'
import { PelicanButton, staggerContainer, staggerItem } from '@/components/ui/pelican'

interface PositionsEmptyStateProps {
  onLogTrade: () => void
  onAskPelican: () => void
}

const features = [
  { icon: ChartLineUp, text: 'Position cards with risk/reward visualization' },
  { icon: ShieldCheck, text: 'Portfolio-level risk budget tracking' },
  { icon: Brain, text: 'AI health scores per position' },
  { icon: Bell, text: 'Smart alerts for tight stops, oversizing, and more' },
  { icon: Lightning, text: 'One-click Pelican analysis on any position' },
]

export function PositionsEmptyState({
  onLogTrade,
  onAskPelican,
}: PositionsEmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <ChartLineUp
          size={48}
          weight="thin"
          className="text-[var(--text-muted)] mb-5"
        />
      </motion.div>

      <motion.h2
        variants={staggerItem}
        className="text-lg font-semibold text-[var(--text-primary)] mb-2"
      >
        Your Portfolio Command Center
      </motion.h2>

      <motion.p
        variants={staggerItem}
        className="text-sm text-[var(--text-muted)] mb-8 max-w-sm"
      >
        Log your first position to unlock portfolio intelligence
      </motion.p>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3 mb-8 text-left max-w-xs w-full"
      >
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.li
              key={feature.text}
              variants={staggerItem}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 flex-shrink-0 rounded-full p-1 bg-[var(--accent-muted)]">
                <Check
                  size={12}
                  weight="bold"
                  className="text-[var(--accent-primary)]"
                />
              </div>
              <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {feature.text}
              </span>
            </motion.li>
          )
        })}
      </motion.ul>

      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <PelicanButton onClick={onLogTrade}>
          <Plus size={16} weight="bold" />
          Log Your First Trade
        </PelicanButton>
        <PelicanButton variant="secondary" onClick={onAskPelican}>
          <ChatCircleDots size={16} weight="regular" />
          Get a Trade Idea
        </PelicanButton>
      </motion.div>
    </motion.div>
  )
}
