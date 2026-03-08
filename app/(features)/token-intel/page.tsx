'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TokenSearch } from '@/components/token-intel/token-search'
import { PriceActionCard, DerivativesCard, OnChainRiskCard } from '@/components/token-intel/token-data-cards'
import { PelicanSynthesisPanel } from '@/components/token-intel/pelican-synthesis-panel'
import { searchTokenIntel, TokenIntelData } from '@/lib/crypto-mock-data'

export default function TokenIntelPage() {
  const searchParams = useSearchParams()
  const initialTicker = searchParams.get('ticker')

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(initialTicker?.toUpperCase() || null)
  const [data, setData] = useState<TokenIntelData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true)
      // Simulate API delay
      const timer = setTimeout(() => {
        setData(searchTokenIntel(selectedSymbol))
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setData(null)
    }
  }, [selectedSymbol])

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Token Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Single-ticker view with AI synthesis.</p>
        </div>
        <TokenSearch onSelect={setSelectedSymbol} currentSymbol={selectedSymbol} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Data Cards (2/5 width) */}
        <div className="lg:col-span-2 space-y-4">
          {data ? (
            <>
              <PriceActionCard data={data} />
              <DerivativesCard data={data} />
              <OnChainRiskCard data={data} />
            </>
          ) : (
            <>
              {/* Skeleton cards */}
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border bg-card p-5 h-[200px]">
                  <div className="w-24 h-3 rounded shimmer mb-4" />
                  <div className="w-32 h-6 rounded shimmer mb-3" />
                  <div className="space-y-2">
                    <div className="w-full h-3 rounded shimmer" />
                    <div className="w-3/4 h-3 rounded shimmer" />
                    <div className="w-5/6 h-3 rounded shimmer" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right: Pelican Synthesis (3/5 width) */}
        <div className="lg:col-span-3">
          <PelicanSynthesisPanel data={data} loading={loading} />
        </div>
      </div>
    </div>
  )
}
