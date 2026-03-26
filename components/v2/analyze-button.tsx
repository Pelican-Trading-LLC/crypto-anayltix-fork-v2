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
      className="v2-analyze-btn v2-sans"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        padding: 0,
        color: 'var(--v2-cyan)',
        fontSize: '11.5px',
        fontWeight: 500,
        cursor: 'pointer',
        lineHeight: 1,
        opacity: 0.7,
        transition: 'opacity 120ms ease',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7' }}
    >
      <MagnifyingGlass size={12} weight="bold" />
      <span>Analyze</span>
    </button>
  )
}
