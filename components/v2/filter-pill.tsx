"use client"

import React from 'react'
import { X } from '@phosphor-icons/react'

interface FilterPillProps {
  label: string
  active?: boolean
  onClick?: () => void
  color?: 'cyan' | 'green'
  dismissible?: boolean
  onDismiss?: () => void
}

export function FilterPill({
  label,
  active = false,
  onClick,
  color = 'cyan',
  dismissible = false,
  onDismiss,
}: FilterPillProps) {
  const isGreen = color === 'green'

  const activeBg = isGreen ? 'var(--v2-green-dim)' : 'var(--v2-cyan-dim)'
  const activeBorder = isGreen ? 'rgba(52, 211, 153, 0.20)' : 'var(--v2-cyan-muted)'
  const activeColor = isGreen ? 'var(--v2-green)' : 'var(--v2-cyan)'

  return (
    <button
      type="button"
      onClick={onClick}
      className="v2-sans"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '28px',
        padding: '0 10px',
        borderRadius: '6px',
        border: `1px solid ${active ? activeBorder : 'var(--v2-border-default)'}`,
        background: active ? activeBg : 'transparent',
        color: active ? activeColor : 'var(--v2-text-tertiary)',
        fontSize: '11.5px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget
          el.style.background = 'var(--v2-bg-surface-3)'
          el.style.borderColor = 'var(--v2-border-strong)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget
          el.style.background = 'transparent'
          el.style.borderColor = 'var(--v2-border-default)'
        }
      }}
    >
      <span>{label}</span>
      {dismissible && (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onDismiss?.()
          }}
          style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', marginLeft: '2px' }}
        >
          <X size={10} weight="bold" />
        </span>
      )}
    </button>
  )
}
