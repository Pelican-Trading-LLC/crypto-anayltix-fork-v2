"use client"

import React, { forwardRef } from 'react'
import { Bird } from '@phosphor-icons/react'
import { FilterPill } from '@/components/v2/filter-pill'

const QUICK_TEMPLATES = [
  'Price breaks level',
  'Whale accumulation',
  'Prediction market shift',
  'EMA crossover',
  'Analyst posts setup',
]

interface AlertBuilderProps {
  inputRef?: React.Ref<HTMLInputElement>
}

export const AlertBuilder = forwardRef<HTMLInputElement, AlertBuilderProps>(
  function AlertBuilder(_props, ref) {
    return (
      <div
        style={{
          position: 'relative',
          background: 'var(--v2-cyan-glow)',
          border: '1px solid var(--v2-cyan-dim)',
          borderRadius: '8px',
          padding: '20px',
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
            background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Bird size={20} weight="fill" style={{ color: 'var(--v2-cyan)' }} />
          <span
            className="v2-mono"
            style={{
              fontSize: '12px',
              color: 'var(--v2-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600,
            }}
          >
            PELICAN ALERT BUILDER
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '12px', color: 'var(--v2-text-secondary)', marginBottom: '12px' }}>
          Describe your alert in plain language:
        </div>

        {/* Input + Create button */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            ref={ref}
            type="text"
            placeholder="Alert me when BTC breaks $85K and 2+ smart money wallets are buying"
            style={{
              flex: 1,
              height: '40px',
              background: 'var(--v2-bg-elevated)',
              border: '1px solid var(--v2-border)',
              borderRadius: '6px',
              padding: '0 12px',
              fontSize: '13px',
              color: 'var(--v2-text-primary)',
              outline: 'none',
            }}
          />
          <button
            type="button"
            style={{
              height: '36px',
              alignSelf: 'center',
              padding: '0 16px',
              background: 'var(--v2-cyan)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Create
          </button>
        </div>

        {/* Quick template pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {QUICK_TEMPLATES.map((t) => (
            <FilterPill key={t} label={t} />
          ))}
        </div>
      </div>
    )
  }
)
