"use client"

import { getSectors, type SP500Sector } from "@/lib/data/sp500-constituents"
import { HeatmapStock } from "@/app/api/heatmap/route"

interface SectorLegendProps {
  stocks: HeatmapStock[]
  selectedSectors: SP500Sector[]
  onToggleSector: (sector: SP500Sector) => void
}

export function SectorLegend({ stocks, selectedSectors, onToggleSector }: SectorLegendProps) {
  const sectors = getSectors()

  // Calculate sector performance
  const sectorStats = sectors.map((sector) => {
    const sectorStocks = stocks.filter((s) => s.sector === sector)
    const avgChange =
      sectorStocks.length > 0
        ? sectorStocks.reduce((sum, s) => sum + (s.changePercent ?? 0), 0) / sectorStocks.length
        : 0

    return {
      sector,
      avgChange,
      count: sectorStocks.length,
    }
  })

  // Sort by average change descending
  const sortedSectors = sectorStats.sort((a, b) => b.avgChange - a.avgChange)

  // Calculate max absolute change for bar scaling
  const maxAbsChange = Math.max(...sortedSectors.map(s => Math.abs(s.avgChange)), 1)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Sectors</h3>
        {selectedSectors.length < sectors.length && (
          <button
            onClick={() => {
              // Select all
              sectors.forEach((s) => {
                if (!selectedSectors.includes(s)) {
                  onToggleSector(s)
                }
              })
            }}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Select All
          </button>
        )}
      </div>

      {/* Clean sector list with performance bars */}
      <div className="space-y-0.5">
        {sortedSectors.map(({ sector, avgChange, count }) => {
          const isSelected = selectedSectors.includes(sector)
          const isPositive = avgChange >= 0
          const absChange = Math.abs(avgChange)
          const barWidth = (absChange / maxAbsChange) * 100
          const sign = avgChange >= 0 ? "+" : ""

          return (
            <button
              key={sector}
              onClick={() => onToggleSector(sector)}
              className={`
                w-full group relative overflow-hidden rounded-md
                px-3 py-2.5 text-left transition-colors
                ${isSelected ? 'hover:bg-white/[0.04] active:bg-white/[0.06]' : 'opacity-40 hover:opacity-60'}
              `}
            >
              {/* Performance bar background */}
              <div
                className="absolute inset-y-0 left-0 opacity-[0.07] transition-all group-hover:opacity-[0.12]"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: isPositive ? '#22c55e' : '#ef4444',
                }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-foreground/90 truncate block">
                    {sector}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {count} stocks
                  </span>
                </div>

                <span className={`text-sm font-mono font-semibold tabular-nums ml-3 ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {sign}{avgChange.toFixed(2)}%
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
