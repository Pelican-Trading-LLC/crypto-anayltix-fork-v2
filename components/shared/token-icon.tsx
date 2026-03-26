'use client'

const TOKEN_COLORS: Record<string, { hue: number; letters: string }> = {
  'FAF': { hue: 30, letters: 'FA' },
  'PUNCH': { hue: 340, letters: 'PC' },
  'WOJAK': { hue: 120, letters: 'WJ' },
  'KNIFE': { hue: 0, letters: 'KN' },
  'CAPTCHA': { hue: 160, letters: 'CA' },
  'VNUT': { hue: 270, letters: 'VN' },
  'NOHAT': { hue: 200, letters: 'NH' },
  'VDOR': { hue: 50, letters: 'VD' },
  'CATFU': { hue: 15, letters: 'CF' },
  'PIGEON': { hue: 220, letters: 'PG' },
  'JUP': { hue: 180, letters: 'JP' },
  'PTOKEN': { hue: 290, letters: 'PT' },
  'UNTIL': { hue: 80, letters: 'UN' },
  'CHUD': { hue: 310, letters: 'CH' },
  'MS2': { hue: 140, letters: 'MS' },
  'SPAWN': { hue: 260, letters: 'SP' },
  'LAYOFF': { hue: 350, letters: 'LO' },
  'SAMBA': { hue: 40, letters: 'SA' },
  'BTC': { hue: 35, letters: 'BT' },
  'ETH': { hue: 230, letters: 'ET' },
  'SOL': { hue: 280, letters: 'SL' },
  'AAPL': { hue: 0, letters: 'AP' },
  'NVDA': { hue: 120, letters: 'NV' },
  'ONDO': { hue: 200, letters: 'ON' },
  'AVAX': { hue: 0, letters: 'AV' },
  'LINK': { hue: 220, letters: 'LK' },
  'DOT': { hue: 330, letters: 'DT' },
  'MATIC': { hue: 270, letters: 'MA' },
  'ADA': { hue: 215, letters: 'AD' },
  'DOGE': { hue: 45, letters: 'DG' },
  'XRP': { hue: 210, letters: 'XR' },
  'BNB': { hue: 42, letters: 'BN' },
  'AAVE': { hue: 290, letters: 'AV' },
  'ARB': { hue: 210, letters: 'AR' },
  'OP': { hue: 0, letters: 'OP' },
}

function getTokenStyle(symbol: string) {
  const mapped = TOKEN_COLORS[symbol.toUpperCase()]
  if (mapped) return mapped
  let hash = 0
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  return { hue: Math.abs(hash) % 360, letters: symbol.slice(0, 2).toUpperCase() }
}

interface TokenIconProps {
  symbol: string
  size?: number
}

export function TokenIcon({ symbol, size = 22 }: TokenIconProps) {
  const { hue, letters } = getTokenStyle(symbol)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 35%, 18%)`,
        border: `1px solid hsl(${hue}, 30%, 28%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: size * 0.4,
          fontWeight: 700,
          color: `hsl(${hue}, 45%, 65%)`,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {letters}
      </span>
    </div>
  )
}
