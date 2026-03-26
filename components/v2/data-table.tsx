"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { SortHeader } from './sort-header'

export interface Column<T> {
  key: string
  header: string
  width?: string
  minWidth?: string
  align?: 'left' | 'right' | 'center'
  render?: (item: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  currentSort?: { key: string; direction: 'asc' | 'desc' }
  rowClassName?: (item: T) => string
}

export function DataTable<T>({
  columns,
  data,
  onSort,
  currentSort,
  rowClassName,
}: DataTableProps<T>) {
  // Calculate total min-width from column widths
  const totalMinWidth = columns.reduce((sum, col) => {
    const w = col.minWidth || col.width
    if (w) {
      const num = parseInt(w, 10)
      if (!isNaN(num)) return sum + num
    }
    return sum + 100 // default column width
  }, 0)

  return (
    <div className="v2-table-container v2-sans">
      <div style={{ minWidth: `${totalMinWidth}px` }}>
        {/* Header row */}
        <div className="v2-header-row">
          {columns.map((col) => (
            <div
              key={col.key}
              style={{
                width: col.width,
                minWidth: col.minWidth,
                flex: col.width ? undefined : 1,
                textAlign: col.align || 'left',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--v2-text-tertiary)',
                padding: '0 12px',
                whiteSpace: 'nowrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    col.align === 'right'
                      ? 'flex-end'
                      : col.align === 'center'
                        ? 'center'
                        : 'flex-start',
                }}
              >
                <SortHeader
                  label={col.header}
                  sortKey={col.key}
                  currentSort={currentSort}
                  onSort={onSort}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {data.map((item, index) => (
          <div
            key={index}
            className={cn('v2-row', rowClassName?.(item))}
          >
            {columns.map((col) => (
              <div
                key={col.key}
                style={{
                  width: col.width,
                  minWidth: col.minWidth,
                  flex: col.width ? undefined : 1,
                  textAlign: col.align || 'left',
                  padding: '0 12px',
                  whiteSpace: 'nowrap',
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {col.render
                  ? col.render(item, index)
                  : (item as Record<string, unknown>)[col.key] as React.ReactNode}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
