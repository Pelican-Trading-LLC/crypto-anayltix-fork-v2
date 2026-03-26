"use client"

import React, { useRef } from 'react'
import { AlertBuilder } from '@/components/v2/alerts/alert-builder'
import { AlertsTable } from '@/components/v2/alerts/alerts-table'
import { AlertHistory } from '@/components/v2/alerts/alert-history'

export default function AlertsPage() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNewAlert = () => {
    inputRef.current?.focus()
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div
      style={{
        background: 'var(--v2-bg-base)',
        padding: '24px',
        minHeight: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--v2-text-primary)' }}>
          Smart Alerts
        </span>
        <button
          type="button"
          onClick={handleNewAlert}
          style={{
            height: '36px',
            padding: '0 14px',
            background: 'var(--v2-cyan)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + New Alert
        </button>
      </div>

      {/* Alert Builder */}
      <AlertBuilder ref={inputRef} />

      {/* Gap */}
      <div style={{ height: '20px' }} />

      {/* Alerts Table */}
      <AlertsTable />

      {/* Gap */}
      <div style={{ height: '20px' }} />

      {/* Alert History */}
      <AlertHistory />
    </div>
  )
}
