'use client'

interface FlowBarProps {
  value: number
  max: number
  color?: string
}

export function FlowBar({ value, max, color }: FlowBarProps) {
  const pct = max > 0 ? Math.abs(value) / max : 0
  const isNeg = value < 0
  const barColor = color || (isNeg ? 'var(--data-negative)' : 'var(--data-positive)')
  return (
    <div
      style={{
        width: 48,
        height: 4,
        borderRadius: 2,
        background: 'rgba(90,130,180,0.06)',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.max(pct * 100, 6)}%`,
          minWidth: 3,
          height: '100%',
          borderRadius: 2,
          background: barColor,
          opacity: 0.7,
        }}
      />
    </div>
  )
}
