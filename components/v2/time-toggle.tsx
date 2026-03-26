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
        border: '1px solid var(--v2-border-default)',
        borderRadius: '6px',
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
            height: '28px',
            padding: '0 10px',
            fontSize: '11px',
            fontWeight: value === option ? 600 : 500,
            background: value === option ? 'var(--v2-cyan-dim)' : 'transparent',
            color: value === option ? 'var(--v2-cyan)' : 'var(--v2-text-tertiary)',
            border: 'none',
            borderRight: i < options.length - 1 ? '1px solid var(--v2-border)' : 'none',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
