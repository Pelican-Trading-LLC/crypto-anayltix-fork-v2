"use client"

import React from 'react'
import { V2_ALERTS } from '@/lib/crypto-mock-data'

export function AlertHistory() {
  const triggeredAlerts = V2_ALERTS.filter(
    (a) => a.status === 'Triggered' && a.postTriggerAnalysis
  )

  if (triggeredAlerts.length === 0) return null

  return (
    <div>
      <div
        className="v2-sans"
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--v2-text-primary)',
          marginBottom: '12px',
        }}
      >
        Recently Triggered
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {triggeredAlerts.map((alert, i) => (
          <div
            key={i}
            style={{
              background: 'var(--v2-bg-surface-2)',
              border: '1px solid var(--v2-border-default)',
              borderLeft: '3px solid var(--v2-green)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
            }}
          >
            {/* Header: condition + badge + timestamp */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span
                className="v2-sans"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--v2-text-primary)',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {alert.condition}
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '20px',
                  padding: '0 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--v2-green)',
                  background: 'rgba(34, 197, 94, 0.12)',
                  flexShrink: 0,
                }}
              >
                Triggered
              </span>

              <span
                className="v2-mono"
                style={{
                  fontSize: '11px',
                  color: 'var(--v2-text-tertiary)',
                  flexShrink: 0,
                }}
              >
                {alert.created}
              </span>
            </div>

            {/* Pelican synthesis */}
            {alert.postTriggerAnalysis && (
              <div
                style={{
                  marginTop: '10px',
                  background: 'var(--v2-bg-surface-1)',
                  border: '1px solid var(--v2-border)',
                  borderRadius: '6px',
                  padding: '12px',
                }}
              >
                <div
                  className="v2-sans"
                  style={{
                    fontSize: '12.5px',
                    lineHeight: 1.65,
                    color: 'var(--v2-text-secondary)',
                  }}
                >
                  {alert.postTriggerAnalysis}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
