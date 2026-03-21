"use client"

import { Bird, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { PELICAN_SUGGESTED_PROMPTS } from '@/lib/crypto-mock-data'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

// Category color map for pill badges
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Macro:      { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa' },
  Scenario:   { bg: 'rgba(139,92,246,0.15)',  text: '#a78bfa' },
  Bridge:     { bg: 'rgba(34,197,94,0.15)',   text: '#4ade80' },
  Contrarian: { bg: 'rgba(139,92,246,0.15)',  text: '#c4b5fd' },
  Portfolio:  { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24' },
  Education:  { bg: 'rgba(6,182,212,0.15)',   text: '#22d3ee' },
  'On-Chain': { bg: 'rgba(20,184,166,0.15)',  text: '#2dd4bf' },
  Analyst:    { bg: 'rgba(239,68,68,0.15)',   text: '#f87171' },
}

export default function PelicanPortalPage() {
  const panel = usePelicanPanelContext()

  const handlePromptClick = async (prompt: string) => {
    await panel.openWithPrompt(null, prompt, 'ask-pelican')
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Ask <span className="text-[var(--accent-primary)]">Pelican</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AI-powered cross-asset intelligence
        </p>
      </div>

      {panel.isOpen ? (
        /* Panel-open state: simple redirect message */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <Bird size={48} weight="duotone" className="text-cyan-400 mb-4" />
          <p className="text-lg font-medium text-[var(--text-primary)] flex items-center gap-2">
            Pelican is ready — ask anything in the panel
            <ArrowRight size={20} weight="bold" className="text-[var(--accent-primary)]" />
          </p>
        </motion.div>
      ) : (
        /* Panel-closed state: welcome + suggested prompts */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Welcome Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <Bird size={48} weight="duotone" className="text-cyan-400 mb-4" />
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              What would you like to analyze?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-lg">
              Pelican combines macro data, prediction markets, analyst views, on-chain flows, and tokenization trends
            </p>
          </div>

          {/* Suggested Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PELICAN_SUGGESTED_PROMPTS.map((item, index) => {
              const colors = CATEGORY_COLORS[item.category] ?? {
                bg: 'rgba(255,255,255,0.08)',
                text: 'var(--text-secondary)',
              }

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.04,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onClick={() => handlePromptClick(item.prompt)}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors text-left group"
                >
                  {/* Category Pill */}
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {item.category}
                  </span>

                  {/* Prompt Text */}
                  <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-relaxed">
                    {item.prompt}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
