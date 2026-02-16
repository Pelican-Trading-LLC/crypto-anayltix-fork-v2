"use client"

import { useMemo } from "react"
import { treemap, hierarchy } from "d3-hierarchy"
import { HeatmapStock } from "@/app/api/heatmap/route"
import { formatChangePercent } from "@/hooks/use-heatmap"

interface TreemapProps {
  stocks: HeatmapStock[]
  width: number
  height: number
  onStockClick?: (ticker: string, name: string) => void
}

type StockNode = {
  ticker: string
  name: string
  price: number | null
  changePercent: number | null
  marketCap: number
  sector: string
}

function toMarketCapValue(stock: HeatmapStock): number {
  return stock.marketCap ?? (stock.volume ? stock.volume * (stock.price ?? 100) : 1_000_000_000)
}

function getTileColor(changePercent: number): string {
  // Clamp between -5% and +5% for color mapping
  const clampedChange = Math.max(-5, Math.min(5, changePercent))

  if (Math.abs(changePercent) < 0.05) {
    // Essentially flat — dark neutral
    return '#2a2a3a'
  }

  if (changePercent > 0) {
    // Green scale: more positive = brighter/more saturated green
    const intensity = Math.min(clampedChange / 5, 1) // 0 to 1
    const r = Math.round(20 + (0 - 20) * intensity)     // 20 → 0
    const g = Math.round(60 + (180 - 60) * intensity)    // 60 → 180
    const b = Math.round(30 + (50 - 30) * intensity)     // 30 → 50
    return `rgb(${r}, ${g}, ${b})`
  } else {
    // Red scale: more negative = brighter/more saturated red
    const intensity = Math.min(Math.abs(clampedChange) / 5, 1) // 0 to 1
    const r = Math.round(60 + (200 - 60) * intensity)    // 60 → 200
    const g = Math.round(30 + (20 - 30) * intensity)     // 30 → 20
    const b = Math.round(30 + (30 - 30) * intensity)     // 30 → 30
    return `rgb(${r}, ${g}, ${b})`
  }
}

function getLabelSize(tileWidth: number): number {
  return Math.max(9, Math.min(14, tileWidth / 12))
}

export function Treemap({ stocks, width, height, onStockClick }: TreemapProps) {
  const root = useMemo(() => {
    const grouped = new Map<string, StockNode[]>()
    for (const stock of stocks) {
      const children = grouped.get(stock.sector) ?? []
      children.push({
        ticker: stock.ticker,
        name: stock.name,
        price: stock.price,
        changePercent: stock.changePercent,
        marketCap: toMarketCapValue(stock),
        sector: stock.sector,
      })
      grouped.set(stock.sector, children)
    }

    const data = {
      name: "market",
      children: Array.from(grouped.entries()).map(([sector, children]) => ({
        name: sector,
        children,
      })),
    }

    return hierarchy(data)
      .sum((d) => ("marketCap" in (d as object) ? ((d as unknown as StockNode).marketCap ?? 0) : 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
  }, [stocks])

  const layoutRoot = useMemo(() => {
    return treemap<unknown>()
      .size([width, height])
      .paddingOuter(2)
      .paddingInner(1)
      .paddingTop(18)(root as never)
  }, [root, width, height])

  const nodes = layoutRoot.descendants()

  if (stocks.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-white/[0.04] bg-surface-1" style={{ width, height }}>
        <p className="text-sm text-foreground/50">No data available</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/[0.04]" style={{ width, height }}>
      {nodes.map((node) => {
        if (node.depth === 1) {
          const sector = String((node.data as { name?: string }).name ?? "")
          return (
            <div
              key={`sector-${sector}`}
              className="pointer-events-none absolute truncate px-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
              style={{
                left: node.x0,
                top: node.y0,
                width: node.x1 - node.x0,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
              }}
            >
              {sector}
            </div>
          )
        }

        if (node.depth !== 2) return null

        const stock = node.data as StockNode
        const tileWidth = node.x1 - node.x0
        const tileHeight = node.y1 - node.y0
        const labelSize = getLabelSize(tileWidth)
        const change = stock.changePercent ?? 0
        const showPercent = tileWidth > 70 && tileHeight > 44

        return (
          <button
            key={`stock-${stock.ticker}`}
            onClick={() => onStockClick?.(stock.ticker, stock.name)}
            className="absolute cursor-pointer border transition-all duration-200 hover:z-20 hover:scale-[1.02] hover:border-white/30 hover:shadow-2xl"
            style={{
              left: node.x0,
              top: node.y0,
              width: tileWidth,
              height: tileHeight,
              backgroundColor: getTileColor(change),
              borderColor: 'rgba(0,0,0,0.4)',
              borderWidth: '1px',
            }}
            title={`${stock.ticker} ${formatChangePercent(stock.changePercent)}`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center px-1 font-mono text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: `${labelSize}px` }} className="font-bold tracking-tight">
                {stock.ticker}
              </div>
              {showPercent && (
                <div className="text-[10px] opacity-85">
                  {formatChangePercent(stock.changePercent)}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
