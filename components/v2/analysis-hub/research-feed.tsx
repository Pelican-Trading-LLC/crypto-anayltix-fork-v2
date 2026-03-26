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
            <span style={{ fontSize: '11px', fontWeight: 700, color: article.sourceColor }}>
              {article.source}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--v2-text-tertiary)' }}>&middot;</span>
            <span className="v2-mono" style={{ fontSize: '11px', color: 'var(--v2-text-tertiary)' }}>
              {article.timeAgo}
            </span>
          </div>

          {/* Title and summarize button */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--v2-text-primary)', lineHeight: 1.45 }}>
              {article.title}
            </div>
            <button
              type="button"
              onClick={() => analyze('research', { title: article.title, source: article.source, tokens: article.tokens })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#06B6D4',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
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
                style={{
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: 'rgba(6,182,212,0.1)',
                  color: 'rgba(6,182,212,0.8)',
                  fontSize: '10px',
                  fontWeight: 500,
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
