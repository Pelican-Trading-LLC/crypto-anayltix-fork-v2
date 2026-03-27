"use client"

import React from 'react'

const SOURCE_STYLES: Record<string, { bg: string; color: string; text: string }> = {
  'The Block': { bg: '#1A1A2E', color: '#E94560', text: 'TB' },
  'Blockworks': { bg: '#0D1B2A', color: '#48CAE4', text: 'BW' },
  'Messari': { bg: '#1B2838', color: '#66BB6A', text: 'M' },
  'Delphi Digital': { bg: '#1A1625', color: '#BB86FC', text: 'DD' },
  'Arkham Intel': { bg: '#1C1917', color: '#F59E0B', text: 'AK' },
  'CoinDesk': { bg: '#0F172A', color: '#3B82F6', text: 'CD' },
}

interface SourceLogoProps {
  source: string
}

export function SourceLogo({ source }: SourceLogoProps) {
  const style = SOURCE_STYLES[source] || { bg: '#1A1A2E', color: '#8896A8', text: source.slice(0, 2).toUpperCase() }

  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 5,
        background: style.bg,
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: style.color,
          fontFamily: 'var(--font-sans)',
          lineHeight: 1,
        }}
      >
        {style.text}
      </span>
    </div>
  )
}
