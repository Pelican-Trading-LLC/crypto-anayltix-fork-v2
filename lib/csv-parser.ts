export interface ParsedTrade {
  date: string
  type: 'Buy' | 'Sell'
  symbol: string
  quantity: number
  price: number
  total: number
  fee: number
  exchange: string
}

export function parseTradeCSV(content: string): ParsedTrade[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []
  const firstLine = lines[0]
  if (!firstLine) return []
  const headers = firstLine.toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''))

  if (headers.includes('transaction type') && headers.includes('asset')) return parseCoinbase(lines, headers)
  if (headers.includes('type') && headers.includes('pair')) return parseKraken(lines, headers)
  return parseGeneric(lines, headers)
}

function col(arr: string[], idx: number): string { return arr[idx] ?? '' }

function parseLine(line: string): string[] {
  const result: string[] = []
  let cur = '', inQ = false
  for (const c of line) {
    if (c === '"') { inQ = !inQ; continue }
    if (c === ',' && !inQ) { result.push(cur.trim()); cur = ''; continue }
    cur += c
  }
  result.push(cur.trim())
  return result
}

function parseCoinbase(lines: string[], h: string[]): ParsedTrade[] {
  const ti = h.indexOf('transaction type'), ai = h.indexOf('asset')
  const qi = h.indexOf('quantity transacted'), pi = h.indexOf('spot price at transaction')
  const toi = h.indexOf('total (inclusive of fees and/or spread)'), fi = h.indexOf('fees and/or spread')
  const di = h.indexOf('timestamp')
  const trades: ParsedTrade[] = []
  for (let i = 1; i < lines.length; i++) {
    const c = parseLine(lines[i] || '')
    const t = col(c, ti).toLowerCase()
    if (t !== 'buy' && t !== 'sell') continue
    trades.push({ date: col(c, di), type: t === 'buy' ? 'Buy' : 'Sell', symbol: col(c, ai).toUpperCase(), quantity: parseFloat(col(c, qi)) || 0, price: parseFloat(col(c, pi)) || 0, total: parseFloat(col(c, toi)) || 0, fee: parseFloat(col(c, fi)) || 0, exchange: 'Coinbase' })
  }
  return trades
}

function parseKraken(lines: string[], h: string[]): ParsedTrade[] {
  const ti = h.indexOf('type'), pi2 = h.indexOf('pair'), pri = h.indexOf('price')
  const ci = h.indexOf('cost'), fi = h.indexOf('fee'), vi = h.indexOf('vol'), tmi = h.indexOf('time')
  const trades: ParsedTrade[] = []
  for (let i = 1; i < lines.length; i++) {
    const c = parseLine(lines[i] || '')
    if (!col(c, ti)) continue
    const pair = col(c, pi2)
    const sym = pair.replace(/USD|ZUSD/g, '').replace('XXBT', 'BTC').replace('XETH', 'ETH').replace('XDG', 'DOGE')
    trades.push({ date: col(c, tmi), type: col(c, ti).toLowerCase() === 'buy' ? 'Buy' : 'Sell', symbol: sym.toUpperCase(), quantity: parseFloat(col(c, vi)) || 0, price: parseFloat(col(c, pri)) || 0, total: parseFloat(col(c, ci)) || 0, fee: parseFloat(col(c, fi)) || 0, exchange: 'Kraken' })
  }
  return trades
}

function parseGeneric(lines: string[], h: string[]): ParsedTrade[] {
  const find = (names: string[]) => h.findIndex(x => names.some(n => x.includes(n)))
  const di = find(['date', 'time', 'timestamp']), ti = find(['type', 'side', 'direction'])
  const si = find(['symbol', 'asset', 'token', 'coin']), qi = find(['quantity', 'amount', 'qty', 'volume'])
  const pi = find(['price', 'rate']), toi = find(['total', 'cost', 'value']), fi = find(['fee', 'commission'])
  const trades: ParsedTrade[] = []
  for (let i = 1; i < lines.length; i++) {
    const c = parseLine(lines[i] || '')
    if (c.length < 3) continue
    const ts = col(c, ti).toLowerCase()
    const isBuy = ts.includes('buy') || ts.includes('long')
    const isSell = ts.includes('sell') || ts.includes('short')
    if (!isBuy && !isSell) continue
    trades.push({ date: col(c, di), type: isBuy ? 'Buy' : 'Sell', symbol: col(c, si).toUpperCase().replace(/USD|USDT|USDC/g, ''), quantity: parseFloat(col(c, qi)) || 0, price: parseFloat(col(c, pi)) || 0, total: parseFloat(col(c, toi)) || 0, fee: parseFloat(col(c, fi)) || 0, exchange: 'CSV Import' })
  }
  return trades
}
