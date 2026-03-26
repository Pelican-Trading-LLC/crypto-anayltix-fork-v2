'use client'

const SOURCES: Record<string, { letter: string; bg: string; text: string }> = {
  'The Block': { letter: 'TB', bg: '#1A1A2E', text: '#E94560' },
  'Blockworks': { letter: 'BW', bg: '#0D1B2A', text: '#48CAE4' },
  'Messari': { letter: 'M', bg: '#1B2838', text: '#66BB6A' },
  'Delphi Digital': { letter: 'DD', bg: '#1A1625', text: '#BB86FC' },
  'Arkham Intel': { letter: 'AK', bg: '#1C1917', text: '#F59E0B' },
  'CoinDesk': { letter: 'CD', bg: '#0F172A', text: '#3B82F6' },
  'Nansen Research': { letter: 'NR', bg: '#0B1222', text: '#22D3EE' },
  'DeFiLlama': { letter: 'DL', bg: '#0F1F0F', text: '#4ADE80' },
}

interface SourceLogoProps {
  source: string
  size?: number
}

export function SourceLogo({ source, size = 28 }: SourceLogoProps) {
  const s = SOURCES[source] || { letter: source.charAt(0), bg: '#1A1A2E', text: '#8B949E' }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 5,
        background: s.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        style={{
          fontSize: s.letter.length > 1 ? size * 0.32 : size * 0.42,
          fontWeight: 800,
          color: s.text,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {s.letter}
      </span>
    </div>
  )
}
