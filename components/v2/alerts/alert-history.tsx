"use client"

import React from 'react'
import { V2_ALERTS } from '@/lib/crypto-mock-data'
import { PelicanSynthesisBox } from '@/components/v2/pelican-analyze-panel'

export function AlertHistory() {
  const triggeredAlerts = V2_ALERTS.filter((a) => a.status === 'Triggered' && a.postTriggerAnalysis)

  return (
    <div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--v2-text-primary)', marginBottom: '12px' }}>
        Recently Triggered
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {triggeredAlerts.map((alert, i) => (
          <div
            key={i}
            style={{
              paddingBottom: '16px',
              marginBottom: '16px',
              borderBottom:
                i < triggeredAlerts.length - 1
                  ? '1px solid var(--v2-border)'
                  : 'none',
            }}
          >
            {/* Condition text */}
            <div style={{ fontSize: '13px', color: 'var(--v2-text-primary)', marginBottom: '6px' }}>
              {alert.condition}
            </div>

            {/* Badge + time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--v2-green)',
                  background: 'rgba(34, 197, 94, 0.12)',
                }}
              >
                Triggered
              </span>
              <span className="v2-mono" style={{ fontSize: '11px', color: 'var(--v2-text-tertiary)' }}>
                {alert.created}
              </span>
            </div>

            {/* Post-trigger analysis */}
            {alert.postTriggerAnalysis && (
              <PelicanSynthesisBox>
                {alert.postTriggerAnalysis}
              </PelicanSynthesisBox>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
