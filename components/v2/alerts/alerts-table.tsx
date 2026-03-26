"use client"

import React, { useState, useMemo } from 'react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FilterPill } from '@/components/v2/filter-pill'
import { V2_ALERTS, V2Alert } from '@/lib/crypto-mock-data'

const FILTERS = ['All', 'Armed', 'Triggered', 'Price', 'On-Chain', 'Technical', 'Prediction', 'Convergence'] as const

const TYPE_COLORS: Record<V2Alert['type'], string> = {
  Price: 'var(--v2-amber)',
  'On-Chain': 'var(--v2-cyan)',
  Technical: '#60A5FA',
  Prediction: 'var(--v2-violet)',
  Convergence: 'var(--v2-green)',
}

const SEVERITY_COLORS: Record<V2Alert['severity'], string> = {
  High: 'var(--v2-red, #ef4444)',
  Medium: 'var(--v2-amber)',
  Low: 'var(--v2-text-tertiary)',
}

const columns: Column<V2Alert>[] = [
  {
    key: 'token',
    header: 'Token',
    width: '68px',
    render: (item) => (
      <span className="v2-mono" style={{ fontWeight: 600, color: 'var(--v2-text-primary)' }}>
        {item.token}
      </span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    width: '100px',
    render: (item) => {
      const color = TYPE_COLORS[item.type]
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '20px',
            padding: '0 6px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          {item.type}
        </span>
      )
    },
  },
  {
    key: 'condition',
    header: 'Condition',
    render: (item) => (
      <span
        className="v2-sans"
        style={{
          fontSize: '12px',
          color: 'var(--v2-text-secondary)',
          whiteSpace: 'normal',
          lineHeight: 1.4,
        }}
      >
        {item.condition}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: '88px',
    render: (item) => {
      if (item.status === 'Triggered') {
        return (
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--v2-green)' }}>
            Triggered &#10003;
          </span>
        )
      }
      return (
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--v2-amber)' }}>
          Armed
        </span>
      )
    },
  },
  {
    key: 'severity',
    header: 'Severity',
    width: '72px',
    render: (item) => (
      <span style={{ fontSize: '12px', fontWeight: 600, color: SEVERITY_COLORS[item.severity] }}>
        {item.severity}
      </span>
    ),
  },
  {
    key: 'created',
    header: 'Created',
    width: '80px',
    render: (item) => (
      <span className="v2-mono" style={{ fontSize: '12px', color: 'var(--v2-text-tertiary)' }}>
        {item.created}
      </span>
    ),
  },
]

export function AlertsTable() {
  const [activeFilter, setActiveFilter] = useState<string>('All')

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return V2_ALERTS
    if (activeFilter === 'Armed' || activeFilter === 'Triggered') {
      return V2_ALERTS.filter((a) => a.status === activeFilter)
    }
    return V2_ALERTS.filter((a) => a.type === activeFilter)
  }, [activeFilter])

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {FILTERS.map((f) => (
          <FilterPill
            key={f}
            label={f}
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          />
        ))}
      </div>

      <DataTable<V2Alert>
        columns={columns}
        data={filtered}
        rowClassName={(item) =>
          item.status === 'Triggered' ? 'v2-row-triggered' : ''
        }
      />
    </div>
  )
}
