"use client"

import React from 'react'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'
import { getPelicanAnalysis } from '@/lib/crypto-mock-data'
import type { PelicanPanelContext } from '@/hooks/use-pelican-panel'

// =============================================================================
// useAnalyze hook
// =============================================================================

type AnalyzeType = 'token' | 'wallet' | 'setup' | 'prediction' | 'alert' | 'research'

const contextMap: Record<AnalyzeType, PelicanPanelContext> = {
  token: 'v2-token',
  wallet: 'v2-wallet',
  setup: 'v2-setup',
  prediction: 'v2-prediction',
  alert: 'v2-alert',
  research: 'v2-research',
}

export function useAnalyze() {
  const panel = usePelicanPanelContext()

  return (type: AnalyzeType, item: Record<string, unknown>) => {
    const ticker = (item.ticker || item.token || null) as string | null
    // getPelicanAnalysis does not support 'research' — provide fallback
    const analysisType = type === 'research' ? 'token' : type
    const analysis = getPelicanAnalysis(analysisType, item)
    panel.openWithPrompt(ticker, analysis, contextMap[type])
  }
}

// =============================================================================
// PelicanSynthesisBox
// =============================================================================

interface PelicanSynthesisBoxProps {
  children: React.ReactNode
}

export function PelicanSynthesisBox({ children }: PelicanSynthesisBoxProps) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--v2-cyan-glow)',
        border: '1px solid var(--v2-cyan-dim)',
        borderRadius: '6px',
        padding: '16px',
        paddingTop: '18px',
        overflow: 'hidden',
      }}
    >
      {/* Top accent gradient bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--v2-cyan), var(--v2-violet))',
        }}
      />
      <div
        style={{
          fontSize: '12px',
          lineHeight: 1.7,
          color: 'var(--v2-text-secondary)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// =============================================================================
// QuickStatsGrid
// =============================================================================

interface QuickStat {
  label: string
  value: string
  color?: string
}

interface QuickStatsGridProps {
  stats: QuickStat[]
}

export function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            background: 'var(--v2-bg-elevated)',
            border: '1px solid var(--v2-border)',
            borderRadius: '6px',
            padding: '10px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: 'var(--v2-text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            {stat.label}
          </div>
          <div
            className="v2-mono"
            style={{
              fontSize: '14px',
              color: stat.color || 'var(--v2-text-primary)',
            }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}
