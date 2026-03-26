"use client"

import React from 'react'

interface SortHeaderProps {
  label: string
  sortKey: string
  currentSort?: { key: string; direction: 'asc' | 'desc' }
  onSort?: (key: string, direction: 'asc' | 'desc') => void
}

export function SortHeader({ label, sortKey, currentSort, onSort }: SortHeaderProps) {
  const isActive = currentSort?.key === sortKey
  const direction = isActive ? currentSort.direction : null

  function handleClick() {
    if (!onSort) return
    if (isActive) {
      onSort(sortKey, direction === 'asc' ? 'desc' : 'asc')
    } else {
      onSort(sortKey, 'desc')
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: onSort ? 'pointer' : 'default',
        color: 'inherit',
        font: 'inherit',
      }}
    >
      <span>{label}</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', height: '8px', justifyContent: 'center' }}>
        <svg width="6" height="3" viewBox="0 0 6 3" fill="none">
          <path
            d="M3 0L6 3H0L3 0Z"
            fill={direction === 'asc' ? 'var(--v2-cyan)' : 'var(--v2-text-quaternary)'}
          />
        </svg>
        <svg width="6" height="3" viewBox="0 0 6 3" fill="none">
          <path
            d="M3 3L0 0H6L3 3Z"
            fill={direction === 'desc' ? 'var(--v2-cyan)' : 'var(--v2-text-quaternary)'}
          />
        </svg>
      </span>
    </button>
  )
}
