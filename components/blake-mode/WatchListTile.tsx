'use client'

import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ColorType, LineStyle, Time, createChart, type UTCTimestamp } from 'lightweight-charts'
import type { AssetClass, BlakeLevel, Candle } from '@/lib/blake-mode/types'
import type { Urgency } from '@/lib/blake-mode/urgency'

export interface WatchListTileProps {
  tile: {
    ticker: string
    displayName: string
    assetClass: AssetClass
    currentPrice: number
    priceChangePercent24h: number
    urgency: Urgency
    manualLevels: BlakeLevel[]
    candles: Candle[]
    ema50: number[]
    ema200: number[]
    analysis: string
  }
  generatedAt: string
}

const URGENCY_COLOR: Record<Urgency, string> = {
  green: 'bg-[#22C55E]',
  yellow: 'bg-[#EAB308]',
  red: 'bg-[#DC2626]',
}

function chartTime(time: number): UTCTimestamp {
  return time as UTCTimestamp
}

function formatPrice(price: number, assetClass: AssetClass): string {
  if (assetClass === 'forex') return price.toFixed(5)
  return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export function WatchListTile({ tile, generatedAt }: WatchListTileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nearest = useMemo(() => {
    const active = tile.manualLevels.filter((level) => level.status === 'active')
    if (!active.length) return null
    return active.sort((a, b) => Math.abs((a.price - tile.currentPrice) / tile.currentPrice) - Math.abs((b.price - tile.currentPrice) / tile.currentPrice))[0]
  }, [tile.currentPrice, tile.manualLevels])

  useEffect(() => {
    if (!containerRef.current || tile.candles.length === 0) return
    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#FAF9E7' }, textColor: '#1F2937' },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      width: containerRef.current.clientWidth,
      height: 150,
      timeScale: { visible: false },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      crosshair: { mode: 1 },
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#16A34A',
      downColor: '#DC2626',
      borderUpColor: '#16A34A',
      borderDownColor: '#DC2626',
      wickUpColor: '#16A34A',
      wickDownColor: '#DC2626',
      priceLineVisible: false,
    })
    candleSeries.setData(tile.candles.map((candle) => ({ time: chartTime(candle.time) as Time, open: candle.open, high: candle.high, low: candle.low, close: candle.close })))

    const addEma = (values: number[], color: string) => {
      const series = chart.addLineSeries({ color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false })
      const offset = tile.candles.length - values.length
      series.setData(values.map((value, index) => ({ time: chartTime(tile.candles[offset + index]?.time ?? tile.candles[index]?.time ?? 0), value })))
    }
    addEma(tile.ema50, '#F97316')
    addEma(tile.ema200, '#DC2626')

    tile.manualLevels
      .filter((level) => level.status === 'active')
      .forEach((level) => {
        candleSeries.createPriceLine({ price: level.price, color: level.color === 'red' ? '#DC2626' : level.color === 'blue' ? '#2563EB' : level.color === 'black' ? '#1F2937' : '#2DD4D4', lineWidth: 2, lineStyle: LineStyle.Solid, axisLabelVisible: false, title: '' })
      })

    chart.timeScale().fitContent()
    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)
    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [tile])

  const changePositive = tile.priceChangePercent24h >= 0
  const distanceText = nearest
    ? `${Math.abs(((nearest.price - tile.currentPrice) / tile.currentPrice) * 100).toFixed(2)}% from ${nearest.label || nearest.role}`
    : 'No levels published yet'

  return (
    <motion.a
      href={`/blake-mode?ticker=${tile.ticker}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="block overflow-hidden rounded-md border border-white/10 bg-[#101827] text-white shadow-xl shadow-black/20"
    >
      <div className="flex items-start justify-between px-4 py-3">
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold">{tile.ticker}</h2>
            <span className="text-xs text-white/45">{tile.displayName}</span>
          </div>
          <span className="mt-1 inline-flex rounded-sm border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/50">{tile.assetClass}</span>
        </div>
        {nearest ? <span className={['mt-1 h-3 w-3 rounded-full', URGENCY_COLOR[tile.urgency]].join(' ')} /> : <span className="text-[10px] text-white/35">no levels</span>}
      </div>
      <div ref={containerRef} className="h-[150px] border-y border-white/10" />
      <div className="px-4 py-3">
        <div className="flex items-end justify-between gap-3">
          <div className="font-mono text-xl font-semibold">{formatPrice(tile.currentPrice, tile.assetClass)}</div>
          <div className={['font-mono text-sm', changePositive ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'].join(' ')}>
            {changePositive ? '+' : ''}{tile.priceChangePercent24h.toFixed(2)}%
          </div>
        </div>
        <div className="mt-1 text-xs text-white/48">{distanceText}</div>
        <p className="mt-3 line-clamp-2 min-h-10 text-sm italic leading-5 text-white/62">{tile.analysis.split('. ').slice(0, 2).join('. ')}</p>
        <div className="mt-2 text-[10px] uppercase tracking-wide text-white/35">Updated {formatDistanceToNow(new Date(generatedAt), { addSuffix: true })}</div>
      </div>
    </motion.a>
  )
}
