"use client"

import React from 'react'
import { SealCheck } from '@phosphor-icons/react'
import { V2_X_FEED } from '@/lib/crypto-mock-data'

export function XFeed() {
  return (
    <div>
      {V2_X_FEED.map((post, i) => (
        <div
          key={i}
          style={{
            padding: '14px 0',
            borderBottom: '1px solid var(--v2-border)',
          }}
        >
          {/* Handle, verified badge, time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
            <span
              className="v2-sans"
              style={{ fontSize: '12px', fontWeight: 700, color: 'var(--v2-cyan)' }}
            >
              {post.handle}
            </span>
            {post.verified && (
              <SealCheck size={14} weight="fill" color="#60A5FA" />
            )}
            <span style={{ fontSize: '11px', color: 'var(--v2-text-quaternary)' }}>&middot;</span>
            <span
              className="v2-mono"
              style={{ fontSize: '11px', color: 'var(--v2-text-quaternary)' }}
            >
              {post.timeAgo}
            </span>
          </div>

          {/* Tweet text */}
          <div
            className="v2-sans"
            style={{
              fontSize: '12.5px',
              color: 'var(--v2-text-secondary)',
              lineHeight: 1.55,
            }}
          >
            {post.text}
          </div>
        </div>
      ))}
    </div>
  )
}
