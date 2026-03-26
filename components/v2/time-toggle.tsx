"use client"

import React from 'react'

interface TimeToggleProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function TimeToggle({ options, value, onChange }: TimeToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--v2-border-active)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          className="v2-mono"
          onClick={() => onChange(option)}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            background: value === option ? 'var(--v2-cyan-dim)' : 'transparent',
            color: value === option ? 'var(--v2-cyan)' : 'var(--v2-text-secondary)',
            border: 'none',
            borderRight: i < options.length - 1 ? '1px solid var(--v2-border-active)' : 'none',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
