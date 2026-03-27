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
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            height: 28,
            padding: '0 10px',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            fontWeight: value === opt ? 600 : 500,
            cursor: 'pointer',
            border: 'none',
            borderRight: i < options.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            background: value === opt ? 'var(--accent-primary-bg)' : 'transparent',
            color: value === opt ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            transition: 'all 120ms',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
