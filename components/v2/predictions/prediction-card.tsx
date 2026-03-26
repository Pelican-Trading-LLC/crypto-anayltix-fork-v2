"use client"

import React from 'react'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { ProbabilityChart } from './probability-chart'
import type { V2PredictionCard } from '@/lib/crypto-mock-data'

interface PredictionCardProps {
  card: V2PredictionCard
}

function probColor(p: number): string {
  if (p > 70) return 'var(--v2-green, #22c55e)'
  if (p < 30) return 'var(--v2-red, #ef4444)'
  return 'var(--v2-amber, #f59e0b)'
}

export function PredictionCard({ card }: PredictionCardProps) {
  const analyze = useAnalyze()

  return (
    <div
      style={{
        background: 'var(--v2-bg-elevated)',
        border: '1px solid var(--v2-border)',
        borderRadius: '10px',
        padding: '16px',
      }}
    >
      {/* Top: logo + question */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--v2-bg-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0,
          }}
        >
          {card.tokenLogo}
        </div>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--v2-text-primary)',
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          {card.question}
        </p>
      </div>

      {/* Price level rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {card.priceLevels.map((level, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span
              className="v2-mono"
              style={{
                fontSize: '13px',
                color: 'var(--v2-text-secondary)',
                minWidth: '70px',
              }}
            >
              {level.price}
            </span>
            <span
              className="v2-mono"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: probColor(level.probability),
                minWidth: '40px',
                textAlign: 'right',
              }}
            >
              {level.probability}%
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  border: '1px solid var(--v2-green-dim, rgba(34,197,94,0.3))',
                  background: 'var(--v2-green-dim, rgba(34,197,94,0.1))',
                  color: 'var(--v2-green, #22c55e)',
                  cursor: 'pointer',
                  lineHeight: '18px',
                }}
              >
                Yes
              </button>
              <button
                type="button"
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  border: '1px solid var(--v2-red-dim, rgba(239,68,68,0.3))',
                  background: 'var(--v2-red-dim, rgba(239,68,68,0.1))',
                  color: 'var(--v2-red, #ef4444)',
                  cursor: 'pointer',
                  lineHeight: '18px',
                }}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Probability chart */}
      <div style={{ marginBottom: '12px' }}>
        <ProbabilityChart data={card.probabilityHistory} />
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--v2-text-tertiary)',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="v2-mono">{card.volumeStr} vol</span>
          <span className="v2-mono">{card.resolution}</span>
        </div>
        <AnalyzeButton
          onClick={() =>
            analyze('prediction', {
              ticker: card.tickers[0] || 'MARKET',
              question: card.question,
              priceLevels: card.priceLevels,
              volume: card.volumeStr,
            })
          }
        />
      </div>
    </div>
  )
}
