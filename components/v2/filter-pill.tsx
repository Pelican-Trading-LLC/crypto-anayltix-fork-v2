"use client"

import React from 'react'
import { X } from '@phosphor-icons/react'

interface FilterPillProps {
  label: string
  active?: boolean
  onClick?: () => void
  color?: string
  dismissible?: boolean
  onDismiss?: () => void
}

export function FilterPill({
  label,
  active = false,
  onClick,
  color = '#06B6D4',
  dismissible = false,
  onDismiss,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '4px',
        border: `1px solid ${active ? `${color}40` : 'var(--v2-border-active)'}`,
        background: active ? `${color}14` : 'transparent',
        color: active ? color : 'var(--v2-text-secondary)',
        fontSize: '11px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        lineHeight: 1,
      }}
    >
      <span>{label}</span>
      {dismissible && (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onDismiss?.()
          }}
          style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <X size={10} weight="bold" />
        </span>
      )}
    </button>
  )
}
