"use client"

import React from 'react'

interface FilterPillProps {
  label: string
  active?: boolean
  variant?: 'default' | 'spot'
  onClick?: () => void
}

export function FilterPill({ label, active = false, variant = 'default', onClick }: FilterPillProps) {
  const isSpot = variant === 'spot' && active

  return (
    <button
      onClick={onClick}
      style={{
        height: 28,
        padding: '0 10px',
        borderRadius: 6,
        fontSize: 11.5,
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 120ms',
        border: `1px solid ${
          active
            ? isSpot ? 'var(--data-positive)' : 'var(--accent-primary-muted)'
            : 'var(--border-default)'
        }`,
        background: active
          ? isSpot ? 'rgba(62, 189, 140, 0.08)' : 'var(--accent-primary-bg)'
          : 'transparent',
        color: active
          ? isSpot ? 'var(--data-positive)' : 'var(--accent-primary)'
          : 'var(--text-tertiary)',
      }}
    >
      {label}
    </button>
  )
}
