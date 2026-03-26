"use client"

import React, { forwardRef, useState } from 'react'
import { Bird } from '@phosphor-icons/react'

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
    const [focused, setFocused] = useState(false)

    return (
      <div
        style={{
          position: 'relative',
          background: 'var(--v2-bg-surface-2)',
          border: '1px solid var(--v2-border-default)',
          borderRadius: '10px',
          padding: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Top accent gradient bar -- subtle */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, var(--v2-cyan-muted) 40%, var(--v2-violet-muted) 60%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Bird
            size={14}
            weight="fill"
            style={{
              color: 'var(--v2-cyan)',
              filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.25))',
            }}
          />
          <span
            className="v2-mono"
            style={{
              fontSize: '11px',
              color: 'var(--v2-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
            }}
          >
            PELICAN ALERT BUILDER
          </span>
        </div>

        {/* Description */}
        <div
          className="v2-sans"
          style={{
            fontSize: '12.5px',
            color: 'var(--v2-text-secondary)',
            marginBottom: '12px',
          }}
        >
          Describe your alert in plain language:
        </div>

        {/* Input + Create button */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            ref={ref}
            type="text"
            placeholder="Alert me when BTC breaks $85K and 2+ smart money wallets are buying"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="v2-sans"
            style={{
              flex: 1,
              height: '40px',
              background: 'var(--v2-bg-base)',
              border: `1px solid ${focused ? 'var(--v2-cyan-muted)' : 'var(--v2-border-default)'}`,
              borderRadius: '8px',
              padding: '0 12px',
              fontSize: '12.5px',
              color: 'var(--v2-text-primary)',
              outline: 'none',
              transition: 'border-color 150ms ease',
            }}
          />
          <button
            type="button"
            style={{
              height: '40px',
              padding: '0 20px',
              background: 'linear-gradient(135deg, var(--v2-cyan-muted), var(--v2-violet-muted))',
              color: '#fff',
              fontSize: '12.5px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Create
          </button>
        </div>

        {/* Template pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {QUICK_TEMPLATES.map((t) => (
            <button
              key={t}
              type="button"
              className="v2-sans"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '28px',
                padding: '0 10px',
                background: 'var(--v2-bg-surface-3)',
                border: '1px solid var(--v2-border)',
                borderRadius: '6px',
                color: 'var(--v2-text-secondary)',
                fontSize: '11.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'border-color 120ms ease, color 120ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--v2-border-strong)'
                el.style.color = 'var(--v2-text-primary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--v2-border)'
                el.style.color = 'var(--v2-text-secondary)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    )
  }
)
