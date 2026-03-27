'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TokenSearch } from '@/components/token-intel/token-search'
import { PriceActionCard, DerivativesCard, OnChainRiskCard } from '@/components/token-intel/token-data-cards'
import { PelicanSynthesisPanel } from '@/components/token-intel/pelican-synthesis-panel'
import { MarketOverviewCard, TrendingCard, FundingRateCard } from '@/components/token-intel/default-cards'
import { TokenIntelData } from '@/lib/crypto-mock-data'
import { useLiveTokenData } from '@/hooks/use-crypto-data'
import { mergeTokenIntel } from '@/lib/use-live-or-mock'
import { ApiError } from '@/components/ui/api-error'
import { DataFreshness } from '@/components/ui/data-freshness'
import { WarningCircle, Bird } from '@phosphor-icons/react'
import { FA_PIPS } from '@/lib/forexanalytix-mock-data'
import { FABadge } from '@/components/forexanalytix/fa-badge'

export default function TokenIntelPage() {
  const searchParams = useSearchParams()
  const initialTicker = searchParams.get('ticker')

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(initialTicker?.toUpperCase() || null)

  // Sync selectedSymbol when URL searchParams change
  useEffect(() => {
    const ticker = searchParams.get('ticker')
    if (ticker && ticker.toUpperCase() !== selectedSymbol) {
      setSelectedSymbol(ticker.toUpperCase())
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch live data from API
  const { data: liveTokenData, error: tokenError, isLoading: liveLoading, mutate: retryToken } = useLiveTokenData(selectedSymbol)

  // Merge live data with mock (live overrides prices/TVL, mock fills derivatives/risk/pelican)
  const mergedData = selectedSymbol ? mergeTokenIntel(selectedSymbol, liveTokenData) : null

  // Fallback: if not in mock, create minimal data from live API
  const data: TokenIntelData | null = selectedSymbol
    ? mergedData
      || (liveTokenData ? {
          symbol: selectedSymbol,
          name: liveTokenData.name,
          price: liveTokenData.price,
          price_change_24h: liveTokenData.price_change_24h,
          price_change_7d: liveTokenData.price_change_7d,
          price_change_30d: liveTokenData.price_change_30d,
          market_cap: liveTokenData.market_cap,
          fdv: liveTokenData.fdv,
          volume_24h: liveTokenData.volume_24h,
          vol_mcap_ratio: liveTokenData.vol_mcap_ratio,
          ath: liveTokenData.ath,
          ath_date: liveTokenData.ath_date,
          sparkline_7d: liveTokenData.sparkline_7d,
          funding_rate: 0, funding_annualized: 0, open_interest: 0, oi_change_24h: 0,
          long_short_ratio: 1.0, liquidations_24h: { longs: 0, shorts: 0 },
          top_10_holders_pct: 0, holder_count: 0, active_addresses_7d: 0, active_addresses_change: 0,
          smart_money_flow_7d: 0, exchange_netflow_7d: 0, next_unlock: null,
          tvl: liveTokenData.tvl, tvl_change_30d: liveTokenData.tvl_change_30d,
          risk_score: 5, risk_factors: ['Derivatives and on-chain data not yet available for this token'],
          pelican_synthesis: `Live price data available for ${selectedSymbol}. Derivatives, on-chain analysis, and Pelican synthesis require additional data sources that are not yet connected. Use "Ask Pelican" for AI-generated analysis.`,
          pelican_verdict: 'NEUTRAL' as const, pelican_confidence: 0,
          pelican_checked_at: 'N/A (limited data)',
          pelican_sources: ['CoinGecko (price)', liveTokenData.sources?.tvl ? 'DeFiLlama (TVL)' : null].filter(Boolean) as string[],
        } as TokenIntelData : null)
    : null

  // Loading state
  const loading = selectedSymbol !== null && !data && liveLoading

  // "No data" state: we have a selected symbol, loading is done, but we have no data at all
  const noDataAvailable = selectedSymbol !== null && !data && !liveLoading && !loading

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Token Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Single-ticker view with AI synthesis.</p>
          {selectedSymbol && data && (
            <DataFreshness source="CoinGecko" isLive={!!liveTokenData && !tokenError} />
          )}
        </div>
        <TokenSearch onSelect={setSelectedSymbol} currentSymbol={selectedSymbol} />
      </div>

      {tokenError && selectedSymbol && !noDataAvailable && (
        <ApiError message="Live data unavailable — showing cached analysis" onRetry={() => retryToken()} compact />
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Data Cards (2/5 width) */}
        <div className="lg:col-span-2 space-y-4">
          {data ? (
            <>
              <PriceActionCard data={data} />
              <DerivativesCard data={data} />
              <OnChainRiskCard data={data} />
              {(() => {
                const matchingPip = FA_PIPS.find(p => p.asset === data.symbol && p.status === 'active')
                if (!matchingPip) return null
                return (
                  <div className="rounded-xl border bg-card p-4" style={{ borderLeftWidth: 3, borderLeftColor: '#4A90C4' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">FA COVERAGE</span>
                        <FABadge />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: matchingPip.analyst_color }}>
                        {matchingPip.analyst_initials}
                      </div>
                      <span className="text-[13px] font-medium">{matchingPip.analyst_name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${matchingPip.direction === 'BULLISH' ? 'bg-[#3EBD8C]/10 text-[#3EBD8C]' : 'bg-[#E06565]/10 text-[#E06565]'}`}>
                        {matchingPip.direction}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-semibold mb-1">{matchingPip.title}</h4>
                    <div className="flex gap-2 mb-2">
                      {Object.entries(matchingPip.key_levels).map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono">
                          <span className="uppercase text-muted-foreground">{k}</span> <span className="font-semibold">{v}</span>
                        </span>
                      ))}
                    </div>
                    {matchingPip.crypto_translation && (
                      <div className="rounded-lg p-2 mt-2" style={{ background: 'linear-gradient(135deg, rgba(74,144,196,0.04) 0%, var(--card) 40%)', border: '1px solid rgba(74,144,196,0.10)' }}>
                        <div className="flex items-center gap-1 text-[9px] uppercase tracking-[1.5px] font-semibold text-[#4A90C4] mb-0.5">
                          <Bird size={10} weight="fill" />
                          PELICAN TRANSLATION
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">{matchingPip.crypto_translation}</p>
                      </div>
                    )}
                    <a href="/forexanalytix" className="text-[11px] font-medium text-[#4A90C4] hover:underline mt-2 inline-block">View all PiPs &rarr;</a>
                  </div>
                )
              })()}
            </>
          ) : noDataAvailable ? (
            /* No data available for the selected ticker */
            <div className="rounded-xl border bg-card p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              <WarningCircle size={40} weight="thin" className="text-[#D4A042]/50 mb-3" />
              <h3 className="text-[15px] font-semibold mb-1">No data available for {selectedSymbol}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-[260px]">
                This token may not be supported by our data sources yet, or the API is temporarily unavailable. Try one of the popular tokens below.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['BTC', 'ETH', 'SOL', 'AAVE', 'WIF'].map(sym => (
                  <button
                    key={sym}
                    onClick={() => setSelectedSymbol(sym)}
                    className="px-3 py-1.5 rounded-lg border bg-card text-[12px] font-medium hover:bg-accent/10 hover:border-[#4A90C4]/30 transition-colors cursor-pointer"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            /* Loading skeleton cards */
            <>
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
          ) : (
            /* Default state — no ticker selected — show overview cards */
            <>
              <MarketOverviewCard onSelect={setSelectedSymbol} />
              <TrendingCard onSelect={setSelectedSymbol} />
              <FundingRateCard onSelect={setSelectedSymbol} />
            </>
          )}
        </div>

        {/* Right: Pelican Synthesis (3/5 width) */}
        <div className="lg:col-span-3">
          {noDataAvailable ? (
            <PelicanSynthesisPanel data={null} loading={false} noDataSymbol={selectedSymbol} />
          ) : (
            <PelicanSynthesisPanel data={data} loading={loading} />
          )}
        </div>
      </div>
    </div>
  )
}
