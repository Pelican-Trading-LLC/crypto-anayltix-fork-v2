"use client"

import React from 'react'
import { Bird } from '@phosphor-icons/react'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { V2_RESEARCH_FEED } from '@/lib/crypto-mock-data'

export function ResearchFeed() {
  const analyze = useAnalyze()

  return (
    <div>
      {V2_RESEARCH_FEED.map((article, i) => (
        <div
          key={i}
          style={{
            padding: '14px 0',
            borderBottom: '1px solid var(--v2-border)',
          }}
        >
          {/* Source and time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span
              className="v2-sans"
              style={{ fontSize: '11px', fontWeight: 600, color: 'var(--v2-amber)' }}
            >
              {article.source}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--v2-text-quaternary)' }}>&middot;</span>
            <span
              className="v2-mono"
              style={{ fontSize: '11px', color: 'var(--v2-text-quaternary)' }}
            >
              {article.timeAgo}
            </span>
          </div>

          {/* Title and summarize button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              className="v2-sans"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--v2-text-primary)',
                lineHeight: 1.45,
              }}
            >
              {article.title}
            </div>
            <button
              type="button"
              onClick={() =>
                analyze('research', {
                  title: article.title,
                  source: article.source,
                  tokens: article.tokens,
                })
              }
              className="v2-sans"
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
                flexShrink: 0,
                whiteSpace: 'nowrap',
                opacity: 0.7,
                transition: 'opacity 120ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.7'
              }}
            >
              <Bird size={13} weight="bold" />
              <span>Summarize</span>
            </button>
          </div>

          {/* Token tags */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {article.tokens.map((token) => (
              <span
                key={token}
                className="v2-mono"
                style={{
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--v2-text-tertiary)',
                  fontSize: '10px',
                }}
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
