"use client"

import React, { useState } from 'react'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { ProbabilityChart } from './probability-chart'
import type { V2PredictionCard } from '@/lib/crypto-mock-data'

interface PredictionCardProps {
  card: V2PredictionCard
}

function probColor(p: number): string {
  if (p > 65) return 'var(--v2-green, #22c55e)'
  if (p < 35) return 'var(--v2-red, #ef4444)'
  return 'var(--v2-text-primary, #e8e8ed)'
}

export function PredictionCard({ card }: PredictionCardProps) {
  const analyze = useAnalyze()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--v2-bg-surface-2, #141825)',
        border: `1px solid ${hovered ? 'var(--v2-border-strong, rgba(255,255,255,0.15))' : 'var(--v2-border-default, rgba(255,255,255,0.08))'}`,
        borderRadius: '10px',
        padding: '18px',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      {/* Top: icon + question */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--v2-bg-surface-3, #1a1f2e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--v2-text-secondary, #9898a6)',
            flexShrink: 0,
          }}
        >
          {card.tokenLogo}
        </div>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--v2-text-primary, #e8e8ed)',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {card.question}
        </p>
      </div>

      {/* Price level rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
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
                color: 'var(--v2-text-primary, #e8e8ed)',
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
                  height: '22px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: '1px solid var(--v2-green, #22c55e)',
                  background: 'transparent',
                  color: 'var(--v2-green, #22c55e)',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                Yes
              </button>
              <button
                type="button"
                style={{
                  height: '22px',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: '1px solid var(--v2-red, #ef4444)',
                  background: 'transparent',
                  color: 'var(--v2-red, #ef4444)',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Probability chart */}
      <div style={{ margin: '12px 0' }}>
        <ProbabilityChart data={card.probabilityHistory} id={card.id} />
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--v2-text-quaternary, rgba(255,255,255,0.25))',
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
