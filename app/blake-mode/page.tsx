'use client'

import { useEffect, useState } from 'react'
import { BlakeChart } from '@/components/blake-mode/BlakeChart'
import { ConfluencePanel } from '@/components/blake-mode/ConfluencePanel'
import { PelicanVoicePanel } from '@/components/blake-mode/PelicanVoicePanel'
import { TickerSelector } from '@/components/blake-mode/TickerSelector'
import { TICKER_CONFIGS } from '@/lib/blake-mode/data'
import type { BlakeConfluence } from '@/lib/blake-mode/confluence/aggregator'
import type { BlakeChartState } from '@/lib/blake-mode/types'
import type { VoiceSample } from '@/lib/blake-mode/voice/fewShotSamples'

const TICKER_ORDER = ['BTC', 'ETH', 'SOL', 'MAGS', 'AAPL', 'AMZN', 'EURUSD', 'GBPUSD']

const REFERENCES = [
  { src: '/blake-mode/pipczar-eurusd-reference.png', alt: 'Pipczar EURUSD 4H', label: 'EURUSD 4H' },
  { src: '/blake-mode/pipczar-spx-reference.png', alt: 'Pipczar SPX weekly', label: 'SPX weekly' },
  { src: '/blake-mode/pipczar-usdcad-reference.png', alt: 'Pipczar USDCAD 4H', label: 'USDCAD 4H' },
]

interface AnalysisResponse {
  analysis?: string
  fullState?: BlakeChartState
  confluence?: BlakeConfluence
  error?: string
}

export default function BlakeModePage() {
  const [ticker, setTicker] = useState('BTC')
  const [state, setState] = useState<BlakeChartState | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [confluence, setConfluence] = useState<BlakeConfluence | null>(null)
  const [loading, setLoading] = useState(true)
  const [voiceSamples, setVoiceSamples] = useState<VoiceSample[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setAnalysis('')
    setConfluence(null)

    fetch('/api/blake-mode/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, voiceSamples }),
    })
      .then((response) => response.json() as Promise<AnalysisResponse>)
      .then((data) => {
        if (cancelled) return
        if (data.fullState) setState(data.fullState)
        if (data.confluence) setConfluence(data.confluence)
        setAnalysis(data.analysis ?? data.error ?? 'Analysis unavailable for this ticker.')
      })
      .catch((error) => {
        if (!cancelled) setAnalysis(error instanceof Error ? error.message : 'Analysis unavailable for this ticker.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    fetch(`/api/blake-mode/data/${ticker}?state=1`)
      .then((response) => response.json() as Promise<BlakeChartState>)
      .then((data) => {
        if (!cancelled && Array.isArray(data.candles)) setState(data)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [ticker, voiceSamples])

  const selectedConfig = TICKER_CONFIGS[ticker]

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <header className="border-b border-white/10 px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-xl font-semibold">Blake Mode</h1>
            <p className="mt-1 text-xs text-white/58">Pipczar TA stack, applied across asset classes, with Pelican synthesis</p>
          </div>
          {selectedConfig && (
            <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
              <p className="font-mono text-sm font-semibold">{selectedConfig.polygonTicker}</p>
              <p className="text-[10px] uppercase tracking-wide text-white/42">
                {selectedConfig.timeframe} · {selectedConfig.lookbackDays}d
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="px-8 py-6">
        <TickerSelector tickers={TICKER_ORDER} selected={ticker} onSelect={setTicker} />

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            {state ? (
              <BlakeChart state={state} />
            ) : (
              <div className="flex h-[790px] items-center justify-center rounded-md border border-white/10 bg-[#FAF9E7] text-[#1F2937]">
                <div className="font-mono text-sm">Loading chart structure...</div>
              </div>
            )}
          </div>

          <aside className="col-span-12 space-y-4 xl:col-span-4">
            <PelicanVoicePanel
              ticker={ticker}
              analysis={analysis}
              loading={loading}
              voiceSamples={voiceSamples}
              onSamplesChange={setVoiceSamples}
            />
            {confluence && <ConfluencePanel confluence={confluence} />}
          </aside>
        </div>

        <section className="mt-12 border-t border-white/10 pt-8">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Source style reference</h2>
            <p className="mt-2 text-sm text-white/64">
              Blake&apos;s actual TradingView charts. The renderer above is built to match this exact visual language.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {REFERENCES.map((reference) => (
              <div key={reference.src} className="overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
                <img
                  src={reference.src}
                  alt={reference.alt}
                  className="aspect-[16/10] w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                    const fallback = event.currentTarget.nextElementSibling as HTMLElement | null
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="hidden aspect-[16/10] items-center justify-center px-4 text-center text-sm text-white/48">
                  {reference.label} reference pending
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

