'use client'

export function ChainBadge({ chain }: { chain: string }) {
  return (
    <div
      style={{
        width: 24,
        height: 18,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 8,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-quaternary)',
          letterSpacing: '0.02em',
        }}
      >
        {chain.slice(0, 3).toUpperCase()}
      </span>
    </div>
  )
}
