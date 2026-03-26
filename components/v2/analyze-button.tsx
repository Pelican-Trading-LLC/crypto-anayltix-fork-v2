"use client"

import React from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface AnalyzeButtonProps {
  onClick: () => void
}

export function AnalyzeButton({ onClick }: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        padding: 0,
        color: 'var(--v2-cyan)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        lineHeight: 1,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
    >
      <MagnifyingGlass size={12} weight="bold" />
      <span>Analyze</span>
    </button>
  )
}
