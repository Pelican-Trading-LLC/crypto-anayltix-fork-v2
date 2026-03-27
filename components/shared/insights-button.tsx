"use client"

import React from 'react'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'
import { formatPrice, formatPercent, formatCompact } from '@/lib/format'

interface InsightsButtonProps {
  onClick?: () => void
  className?: string
  /** Icon-only mode — just shows pelican logo, no text */
  iconOnly?: boolean
  /** Token/entity context for the Pelican panel */
  context?: {
    symbol?: string
    name?: string
    price?: number
    change24h?: number
    volume?: number
    netFlows?: number
    /** Free-form extra context */
    extra?: string
  }
}

export function InsightsButton({ onClick, className, context, iconOnly }: InsightsButtonProps) {
  const panel = usePelicanPanelContext()

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }
    if (context) {
      const sym = context.symbol || 'this asset'
      const parts: string[] = [`Analyze ${context.name || sym}.`]
      if (context.price != null) parts.push(`Price: ${formatPrice(context.price)}.`)
      if (context.change24h != null) parts.push(`24h: ${formatPercent(context.change24h)}.`)
      if (context.volume != null) parts.push(`Vol: ${formatCompact(context.volume)}.`)
      if (context.netFlows != null) parts.push(`Net flows: ${formatCompact(context.netFlows)}. ${context.netFlows > 0 ? 'Positive flows suggest accumulation.' : 'Negative flows suggest distribution.'}`)
      if (context.extra) parts.push(context.extra)
      const prompt = parts.join(' ')
      panel.openWithPrompt(context.symbol || null, prompt, null)
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        handleClick()
      }}
      className={`insights-btn ${className || ''}`}
      title="Analyze with Pelican"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: iconOnly ? 0 : 6,
        background: 'none',
        border: 'none',
        padding: iconOnly ? 4 : 0,
        cursor: 'pointer',
        opacity: iconOnly ? 0.65 : 0.45,
        transition: 'opacity 150ms, transform 150ms',
        color: 'var(--accent-primary)',
        filter: iconOnly ? 'brightness(1.3)' : 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.filter = 'brightness(1.5)' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = iconOnly ? '0.65' : '0.45'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = iconOnly ? 'brightness(1.3)' : 'none' }}
    >
      <img
        src="/images/pelican-logo.png"
        alt=""
        width={iconOnly ? 28 : 20}
        height={iconOnly ? 28 : 20}
        style={{ flexShrink: 0, objectFit: 'contain' }}
      />
      {!iconOnly && (
        <span
          style={{
            fontSize: 11.5,
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
          }}
        >
          Insights
        </span>
      )}
    </button>
  )
}
