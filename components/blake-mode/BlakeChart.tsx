'use client'

import {
  ColorType,
  LineStyle,
  Time,
  UTCTimestamp,
  createChart,
  type IChartApi,
} from 'lightweight-charts'
import { useEffect, useMemo, useRef } from 'react'
import type { BlakeChartState } from '@/lib/blake-mode/types'
import { BlakeChartHeader } from './BlakeChartHeader'

function chartTime(time: number): UTCTimestamp {
  return time as UTCTimestamp
}

function pricePrecision(state: BlakeChartState): number {
  return state.assetClass === 'forex' ? 5 : 2
}

const MANUAL_LEVEL_COLORS = {
  cyan: '#2DD4D4',
  black: '#1F2937',
  red: '#DC2626',
  blue: '#2563EB',
}

function addTwoPointLine(
  chart: IChartApi,
  startTime: number,
  startPrice: number,
  endTime: number,
  endPrice: number,
  color: string,
  width = 2,
  style = LineStyle.Solid
) {
  const series = chart.addLineSeries({
    color,
    lineWidth: width as 2,
    lineStyle: style,
    priceLineVisible: false,
    lastValueVisible: false,
  })
  series.setData([
    { time: chartTime(startTime), value: startPrice },
    { time: chartTime(endTime), value: endPrice },
  ])
}

function usePriceFormat(state: BlakeChartState) {
  return useMemo(
    () => ({
      type: 'price' as const,
      precision: pricePrecision(state),
      minMove: state.assetClass === 'forex' ? 0.00001 : 0.01,
    }),
    [state]
  )
}

function RsiPanel({ state }: { state: BlakeChartState }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || state.candles.length === 0) return

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#FAF9E7' }, textColor: '#1F2937' },
      grid: { vertLines: { color: 'rgba(0,0,0,0.06)' }, horzLines: { color: 'rgba(0,0,0,0.06)' } },
      width: containerRef.current.clientWidth,
      height: 150,
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1F2937' },
      rightPriceScale: { borderColor: '#1F2937', scaleMargins: { top: 0.12, bottom: 0.12 } },
      crosshair: { mode: 1 },
    })

    const rsiSeries = chart.addLineSeries({ color: '#A855F7', lineWidth: 2, priceLineVisible: false })
    rsiSeries.setData(
      state.indicators.rsi14
        .map((value, index) => {
          const candle = state.candles[index + 14]
          return candle ? { time: chartTime(candle.time), value } : null
        })
        .filter((point): point is { time: UTCTimestamp; value: number } => Boolean(point))
    )

    const signalSeries = chart.addLineSeries({ color: '#EAB308', lineWidth: 2, priceLineVisible: false })
    signalSeries.setData(
      state.indicators.rsiSignal
        .map((value, index) => {
          const candle = state.candles[index + 27]
          return candle ? { time: chartTime(candle.time), value } : null
        })
        .filter((point): point is { time: UTCTimestamp; value: number } => Boolean(point))
    )

    rsiSeries.createPriceLine({ price: 70, color: '#1F2937', lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: '70' })
    rsiSeries.createPriceLine({ price: 30, color: '#1F2937', lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: '30' })

    state.divergences.forEach((divergence) => {
      addTwoPointLine(
        chart,
        divergence.rsiPivot1.time,
        divergence.rsiPivot1.value,
        divergence.rsiPivot2.time,
        divergence.rsiPivot2.value,
        '#000000',
        2
      )
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
  }, [state])

  return <div ref={containerRef} className="h-[150px] w-full" />
}

export function BlakeChart({
  state,
  adminMode = false,
  onAdminModeChange,
  onChartClick,
}: {
  state: BlakeChartState
  adminMode?: boolean
  onAdminModeChange?: (enabled: boolean) => void
  onChartClick?: (price: number, time: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const priceFormat = usePriceFormat(state)

  useEffect(() => {
    if (!containerRef.current || state.candles.length === 0) return

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#FAF9E7' }, textColor: '#1F2937' },
      grid: { vertLines: { color: 'rgba(0,0,0,0.06)' }, horzLines: { color: 'rgba(0,0,0,0.06)' } },
      width: containerRef.current.clientWidth,
      height: 600,
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1F2937' },
      rightPriceScale: { borderColor: '#1F2937', scaleMargins: { top: 0.08, bottom: 0.08 } },
      crosshair: { mode: 1 },
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#16A34A',
      downColor: '#DC2626',
      borderUpColor: '#16A34A',
      borderDownColor: '#DC2626',
      wickUpColor: '#16A34A',
      wickDownColor: '#DC2626',
      priceFormat,
    })
    candleSeries.setData(
      state.candles.map((c) => ({
        time: chartTime(c.time) as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    )

    const ema50Series = chart.addLineSeries({ color: '#F97316', lineWidth: 2, priceLineVisible: false, lastValueVisible: false, priceFormat })
    ema50Series.setData(
      state.indicators.ema50
        .map((value, index) => {
          const candle = state.candles[index + 49]
          return candle ? { time: chartTime(candle.time), value } : null
        })
        .filter((point): point is { time: UTCTimestamp; value: number } => Boolean(point))
    )

    const ema200Series = chart.addLineSeries({ color: '#DC2626', lineWidth: 2, priceLineVisible: false, lastValueVisible: false, priceFormat })
    ema200Series.setData(
      state.indicators.ema200
        .map((value, index) => {
          const candle = state.candles[index + 199]
          return candle ? { time: chartTime(candle.time), value } : null
        })
        .filter((point): point is { time: UTCTimestamp; value: number } => Boolean(point))
    )

    state.horizontalLevels.forEach((level) => {
      const manual = level.source === 'manual'
      const color = manual ? MANUAL_LEVEL_COLORS[level.color ?? 'cyan'] : level.strength === 'major' ? '#2DD4D4' : 'rgba(31,41,55,0.45)'
      const title = manual ? `• ${level.label || 'Blake level'} (${level.price.toFixed(pricePrecision(state))})` : ''

      if (!manual && level.strength === 'minor') return

      candleSeries.createPriceLine({
        price: level.price,
        color,
        lineWidth: manual ? (4 as const) : (3 as const),
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title,
      })
    })

    state.horizontalLevels
      .filter((level) => level.source !== 'manual' && level.strength === 'minor')
      .slice(0, 4)
      .forEach((level) => {
        candleSeries.createPriceLine({
          price: level.price,
          color: 'rgba(31,41,55,0.45)',
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          axisLabelVisible: false,
          title: '',
        })
      })

    state.fibLevels.forEach((fib) => {
      const isExt = fib.type === 'extension'
      candleSeries.createPriceLine({
        price: fib.price,
        color: isExt ? '#DC2626' : '#2563EB',
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: `${fib.label} (${fib.price.toFixed(pricePrecision(state))})`,
      })
    })

    state.trendlines.forEach((line) => {
      addTwoPointLine(chart, line.startTime, line.startPrice, line.endTime, line.endPrice, '#DC2626')
    })

    if (state.channel) {
      addTwoPointLine(chart, state.channel.upperLine.startTime, state.channel.upperLine.startPrice, state.channel.upperLine.endTime, state.channel.upperLine.endPrice, '#DC2626', 2)
      addTwoPointLine(chart, state.channel.lowerLine.startTime, state.channel.lowerLine.startPrice, state.channel.lowerLine.endTime, state.channel.lowerLine.endPrice, '#DC2626', 2)
    }

    state.divergences.forEach((divergence) => {
      addTwoPointLine(
        chart,
        divergence.pricePivot1.time,
        divergence.pricePivot1.price,
        divergence.pricePivot2.time,
        divergence.pricePivot2.price,
        '#000000',
        2
      )
    })

    chart.timeScale().fitContent()
    const clickHandler = (param: { point?: { x: number; y: number } | null; time?: Time }) => {
      if (!adminMode || !param.point) return
      const price = candleSeries.coordinateToPrice(param.point.y)
      if (typeof price !== 'number') return
      onChartClick?.(price, typeof param.time === 'number' ? param.time : state.candles[state.candles.length - 1]?.time ?? 0)
    }
    chart.subscribeClick(clickHandler)

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.unsubscribeClick(clickHandler)
      chart.remove()
    }
  }, [adminMode, onChartClick, priceFormat, state])

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-[#FAF9E7] shadow-2xl shadow-black/30">
      <BlakeChartHeader state={state} adminMode={adminMode} onAdminModeChange={onAdminModeChange} />
      <div ref={containerRef} className={['h-[600px] w-full', adminMode ? 'cursor-crosshair' : ''].join(' ')} />
      <div className="border-t border-black/10 px-2 pb-2">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#1F2937]/70">
          <span>RSI 14</span>
          <span className="font-mono">{state.indicators.currentRsi.toFixed(1)}</span>
        </div>
        <RsiPanel state={state} />
      </div>
    </div>
  )
}
