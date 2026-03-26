"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { SortHeader } from './sort-header'

export interface Column<T> {
  key: string
  header: string
  width?: string
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
  return (
    <div className="v2-sans" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width,
                  textAlign: col.align || 'left',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  color: 'var(--v2-text-tertiary)',
                  padding: '0 8px',
                  height: '38px',
                  whiteSpace: 'nowrap',
                  borderBottom: '1px solid var(--v2-border)',
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
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={cn('v2-row', rowClassName?.(item))}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'left',
                    padding: '0 8px',
                    whiteSpace: 'nowrap',
                    fontSize: '13px',
                  }}
                >
                  {col.render
                    ? col.render(item, index)
                    : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
