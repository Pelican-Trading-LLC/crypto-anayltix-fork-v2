// ══════════════════════════════════════════════════════════════
// Kraken Public API Client — no auth required
// ══════════════════════════════════════════════════════════════

// Use proxy in browser to avoid CORS, direct in server context
const isBrowser = typeof window !== 'undefined'
const KRAKEN_BASE = isBrowser ? '' : 'https://api.kraken.com'
const TICKER_PATH = isBrowser ? '/api/kraken?endpoint=Ticker&pair=' : '/0/public/Ticker?pair='
// OHLC uses custom URL construction below
const PAIRS_PATH = isBrowser ? '/api/kraken?endpoint=AssetPairs' : '/0/public/AssetPairs'

// Kraken uses non-standard pair names
export const KRAKEN_PAIRS: Record<string, string> = {
  BTC: 'XXBTZUSD', ETH: 'XETHZUSD', SOL: 'SOLUSD', XRP: 'XXRPZUSD',
  ADA: 'ADAUSD', AVAX: 'AVAXUSD', DOT: 'DOTUSD', MATIC: 'MATICUSD',
  LINK: 'LINKUSD', UNI: 'UNIUSD', AAVE: 'AAVEUSD', ATOM: 'ATOMUSD',
  NEAR: 'NEARUSD', ARB: 'ARBUSD', OP: 'OPUSD', APT: 'APTUSD',
  SUI: 'SUIUSD', SEI: 'SEIUSD', TIA: 'TIAUSD', INJ: 'INJUSD',
  FET: 'FETUSD', ONDO: 'ONDOUSD', JUP: 'JUPUSD', BONK: 'BONKUSD',
  WIF: 'WIFUSD', PEPE: 'PEPEUSD', SHIB: 'SHIBUSD', DOGE: 'XDGUSD',
  LTC: 'XLTCZUSD', BCH: 'BCHUSD', FIL: 'FILUSD', GRT: 'GRTUSD',
  MKR: 'MKRUSD', CRV: 'CRVUSD', LDO: 'LDOUSD', PENDLE: 'PENDLEUSD',
  PYTH: 'PYTHUSD', ENA: 'ENAUSD', RENDER: 'RENDERUSD',
}

// Reverse lookup
const PAIR_TO_SYMBOL: Record<string, string> = {}
Object.entries(KRAKEN_PAIRS).forEach(([sym, pair]) => {
  PAIR_TO_SYMBOL[pair] = sym
})

// ── Types ────────────────────────────────────────────────────

export interface KrakenTicker {
  symbol: string
  pair: string
  price: number
  bid: number
  ask: number
  volume24h: number
  volumeUsd24h: number
  vwap24h: number
  high24h: number
  low24h: number
  open24h: number
  change24h: number
  changeAbs24h: number
  trades24h: number
}

export interface KrakenOHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
  vwap: number
  volume: number
  count: number
}

// ── API Functions ────────────────────────────────────────────

export async function fetchTickers(symbols: string[]): Promise<KrakenTicker[]> {
  const pairs = symbols.map(s => KRAKEN_PAIRS[s.toUpperCase()]).filter(Boolean)
  if (pairs.length === 0) return []

  try {
    const res = await fetch(`${KRAKEN_BASE}${TICKER_PATH}${pairs.join(',')}`)
    if (!res.ok) throw new Error(`Kraken API ${res.status}`)
    const data = await res.json()
    if (data.error?.length > 0) console.error('[Kraken] API errors:', data.error)

    const tickers: KrakenTicker[] = []
    for (const [pair, info] of Object.entries(data.result || {})) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = info as any
      const symbol = PAIR_TO_SYMBOL[pair]
      if (!symbol || !t?.c) continue

      const price = parseFloat(t.c[0])
      const open = parseFloat(t.o)
      const vwap = parseFloat(t.p[1])
      const volume = parseFloat(t.v[1])

      tickers.push({
        symbol, pair, price,
        bid: parseFloat(t.b[0]),
        ask: parseFloat(t.a[0]),
        volume24h: volume,
        volumeUsd24h: volume * vwap,
        vwap24h: vwap,
        high24h: parseFloat(t.h[1]),
        low24h: parseFloat(t.l[1]),
        open24h: open,
        change24h: open > 0 ? ((price - open) / open) * 100 : 0,
        changeAbs24h: price - open,
        trades24h: parseInt(t.t[1]),
      })
    }
    return tickers
  } catch (err) {
    console.error('[Kraken] fetchTickers error:', err)
    return []
  }
}

export async function fetchOHLC(symbol: string, interval: number = 60): Promise<KrakenOHLC[]> {
  const pair = KRAKEN_PAIRS[symbol.toUpperCase()]
  if (!pair) return []

  try {
    const url = isBrowser
      ? `/api/kraken?endpoint=OHLC&pair=${pair}&interval=${interval}`
      : `${KRAKEN_BASE}/0/public/OHLC?pair=${pair}&interval=${interval}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Kraken OHLC ${res.status}`)
    const data = await res.json()
    const result = data.result || {}
    // Find the array in results (skip 'last' key)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candles = Object.entries(result).find(([k]) => k !== 'last')?.[1] as any[] | undefined
    if (!candles) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return candles.map((c: any[]) => ({
      time: c[0], open: parseFloat(c[1]), high: parseFloat(c[2]),
      low: parseFloat(c[3]), close: parseFloat(c[4]),
      vwap: parseFloat(c[5]), volume: parseFloat(c[6]), count: c[7],
    }))
  } catch (err) {
    console.error('[Kraken] fetchOHLC error:', err)
    return []
  }
}

export async function fetchAssetPairs(): Promise<{ symbol: string; pair: string; altname: string }[]> {
  try {
    const res = await fetch(`${KRAKEN_BASE}${PAIRS_PATH}`)
    if (!res.ok) throw new Error(`Kraken AssetPairs ${res.status}`)
    const data = await res.json()
    const pairs: { symbol: string; pair: string; altname: string }[] = []

    for (const [pairName, info] of Object.entries(data.result || {})) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = info as any
      if (!pairName.endsWith('USD') && !pairName.endsWith('ZUSD')) continue
      const altname = p.altname || pairName
      const symbol = altname.replace('USD', '').replace('XBT', 'BTC').replace('XDG', 'DOGE')
      pairs.push({ symbol, pair: pairName, altname })
    }
    return pairs
  } catch (err) {
    console.error('[Kraken] fetchAssetPairs error:', err)
    return []
  }
}

// ── Token name lookup ────────────────────────────────────────

export const TOKEN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', XRP: 'Ripple',
  ADA: 'Cardano', AVAX: 'Avalanche', DOT: 'Polkadot', LINK: 'Chainlink',
  UNI: 'Uniswap', AAVE: 'Aave', ATOM: 'Cosmos', NEAR: 'NEAR Protocol',
  ARB: 'Arbitrum', OP: 'Optimism', APT: 'Aptos', SUI: 'Sui',
  SEI: 'Sei', TIA: 'Celestia', INJ: 'Injective', FET: 'Fetch.ai',
  RENDER: 'Render', ONDO: 'Ondo Finance', JUP: 'Jupiter', BONK: 'Bonk',
  WIF: 'dogwifhat', PEPE: 'Pepe', SHIB: 'Shiba Inu', DOGE: 'Dogecoin',
  LTC: 'Litecoin', MKR: 'Maker', CRV: 'Curve DAO', LDO: 'Lido DAO',
  PENDLE: 'Pendle', GRT: 'The Graph', FIL: 'Filecoin', BCH: 'Bitcoin Cash',
  PYTH: 'Pyth Network', ENA: 'Ethena', MATIC: 'Polygon',
}
