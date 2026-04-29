'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BlakeChart } from '@/components/blake-mode/BlakeChart'
import { ConfluencePanel } from '@/components/blake-mode/ConfluencePanel'
import { LevelEditorPopover, type LevelEditorDraft } from '@/components/blake-mode/LevelEditorPopover'
import { ManualLevelsPanel } from '@/components/blake-mode/ManualLevelsPanel'
import { PelicanVoicePanel } from '@/components/blake-mode/PelicanVoicePanel'
import { ThesisTimeline } from '@/components/blake-mode/ThesisTimeline'
import { TickerSelector } from '@/components/blake-mode/TickerSelector'
import { TICKER_CONFIGS } from '@/lib/blake-mode/config'
import type { BlakeConfluence } from '@/lib/blake-mode/confluence/aggregator'
import { useLocalLevels } from '@/lib/blake-mode/hooks/use-local-levels'
import { getAllLocalLevels, getLocalVoiceSamples, saveLocalVoiceSamples } from '@/lib/blake-mode/store/local-store'
import type { BlakeChartState, BlakeLevel, VoiceSample } from '@/lib/blake-mode/types'

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

function defaultRole(price: number, currentPrice: number): BlakeLevel['role'] {
  return price >= currentPrice ? 'resistance' : 'support'
}

function defaultColor(role: BlakeLevel['role']): BlakeLevel['color'] {
  if (role === 'target') return 'blue'
  if (role === 'invalidation') return 'red'
  if (role === 'pivot') return 'black'
  return 'cyan'
}

export function BlakeModeWorkspace({ adminDefault = false }: { adminDefault?: boolean }) {
  const [ticker, setTicker] = useState('BTC')
  const [state, setState] = useState<BlakeChartState | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [confluence, setConfluence] = useState<BlakeConfluence | null>(null)
  const [loading, setLoading] = useState(true)
  const [voiceSamples, setVoiceSamples] = useState<VoiceSample[] | null>(null)
  const [adminMode, setAdminMode] = useState(adminDefault)
  const [editingLevel, setEditingLevel] = useState<BlakeLevel | null>(null)
  const [draft, setDraft] = useState<LevelEditorDraft | null>(null)
  const [completion, setCompletion] = useState(false)
  const [allLevels, setAllLevels] = useState<Record<string, BlakeLevel[]>>({})
  const { levels, createLevel, updateLevel, deleteLevel } = useLocalLevels(ticker)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlTicker = params.get('ticker')?.toUpperCase()
    if (urlTicker && TICKER_CONFIGS[urlTicker]) setTicker(urlTicker)
    setVoiceSamples(getLocalVoiceSamples())
  }, [])

  useEffect(() => {
    const refreshAllLevels = () => setAllLevels(getAllLocalLevels())
    refreshAllLevels()
    window.addEventListener('blake-mode:levels-changed', refreshAllLevels)
    window.addEventListener('storage', refreshAllLevels)
    return () => {
      window.removeEventListener('blake-mode:levels-changed', refreshAllLevels)
      window.removeEventListener('storage', refreshAllLevels)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setAnalysis('')
    setConfluence(null)

    fetch('/api/blake-mode/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, voiceSamples, manualLevels: levels }),
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

    return () => {
      cancelled = true
    }
  }, [levels, ticker, voiceSamples])

  const selectedConfig = TICKER_CONFIGS[ticker]
  const updatedCount = useMemo(
    () => TICKER_ORDER.filter((symbol) => (allLevels[symbol] ?? []).some((level) => level.status === 'active')).length,
    [allLevels]
  )

  const closeEditor = () => {
    setEditingLevel(null)
    setDraft(null)
  }

  const handleChartClick = useCallback(
    (price: number, time: number) => {
      if (!state) return
      const tolerance = state.assetClass === 'forex' ? 0.001 : state.assetClass === 'crypto' ? 0.005 : 0.002
      const nearby = levels.find((level) => level.status === 'active' && Math.abs((level.price - price) / price) < tolerance)
      if (nearby) {
        setEditingLevel(nearby)
        setDraft(null)
        return
      }
      setEditingLevel(null)
      setDraft({ price, time })
    },
    [levels, state]
  )

  const handleSaveLevel = (patch: Omit<BlakeLevel, 'id' | 'createdAt' | 'updatedAt'> | Partial<BlakeLevel>) => {
    if (!state) return
    if (editingLevel) {
      updateLevel(editingLevel.id, patch)
    } else {
      const role = (patch.role as BlakeLevel['role'] | undefined) ?? defaultRole(Number(patch.price), state.currentPrice)
      createLevel({
        ticker,
        price: Number(patch.price),
        label: typeof patch.label === 'string' ? patch.label : null,
        role,
        strength: (patch.strength as BlakeLevel['strength'] | undefined) ?? 'major',
        color: (patch.color as BlakeLevel['color'] | undefined) ?? defaultColor(role),
        note: typeof patch.note === 'string' ? patch.note : null,
        analyst: 'blake',
        status: 'active',
      })
    }
    toast.success('Level saved')
    closeEditor()
  }

  const handleDeleteLevel = (id: string) => {
    deleteLevel(id)
    toast.success('Level deleted')
    closeEditor()
  }

  const handleSamplesChange = (samples: VoiceSample[] | null) => {
    setVoiceSamples(samples)
    if (samples) saveLocalVoiceSamples(samples)
  }

  const saveAndNext = () => {
    const index = TICKER_ORDER.indexOf(ticker)
    if (index >= TICKER_ORDER.length - 1) {
      setCompletion(true)
      return
    }
    const nextTicker = TICKER_ORDER[index + 1]
    if (nextTicker) setTicker(nextTicker)
  }

  if (completion) {
    return (
      <div className="min-h-screen bg-[#0B1220] px-8 py-10 text-white">
        <Toaster position="top-right" />
        <div className="mx-auto max-w-2xl rounded-md border border-white/10 bg-white/[0.04] p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-[#2DD4D4]">Blake admin pass complete</p>
          <h1 className="mt-3 text-3xl font-semibold">All set. {updatedCount} tickers updated.</h1>
          <p className="mt-3 text-white/62">Levels are live across the platform and ready for watchlist, alerts, briefings, and Pelican voice synthesis.</p>
          <div className="mt-6 flex gap-3">
            <a href="/watchlist" className="rounded-md bg-[#2DD4D4] px-4 py-2 text-sm font-bold text-[#062326]">Watchlist</a>
            <a href="/briefings" className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white/72">Briefings</a>
            <a href="/alerts" className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white/72">Alerts</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <Toaster position="top-right" />
      <header className="border-b border-white/10 px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-xl font-semibold">{adminDefault ? 'Blake Admin Mode' : 'Blake Mode'}</h1>
            <p className="mt-1 text-xs text-white/58">Human levels in, Pelican amplification out.</p>
          </div>
          <div className="flex items-center gap-3">
            {adminDefault && (
              <div className="rounded-md border border-[#DC2626]/30 bg-[#DC2626]/10 px-3 py-2 text-right">
                <p className="font-mono text-sm font-semibold">{updatedCount} of 8</p>
                <p className="text-[10px] uppercase tracking-wide text-white/45">tickers updated</p>
              </div>
            )}
            {selectedConfig && (
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
                <p className="font-mono text-sm font-semibold">{selectedConfig.polygonTicker}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/42">
                  {selectedConfig.timeframe} · {selectedConfig.lookbackDays}d
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <TickerSelector tickers={TICKER_ORDER} selected={ticker} onSelect={setTicker} />
          {adminDefault && (
            <button type="button" onClick={saveAndNext} className="rounded-md bg-[#2DD4D4] px-4 py-2 text-sm font-bold text-[#062326] hover:bg-[#67E8F9]">
              Save and Next
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            {state ? (
              <>
                <BlakeChart state={state} adminMode={adminMode} onAdminModeChange={setAdminMode} onChartClick={handleChartClick} />
                <ThesisTimeline ticker={ticker} />
              </>
            ) : (
              <div className="flex h-[790px] items-center justify-center rounded-md border border-white/10 bg-[#FAF9E7] text-[#1F2937]">
                <div className="font-mono text-sm">Loading chart structure...</div>
              </div>
            )}
          </div>

          <aside className="col-span-12 space-y-4 xl:col-span-4">
            {state && <ManualLevelsPanel levels={levels} currentPrice={state.currentPrice} onEdit={(level) => { setEditingLevel(level); setDraft(null) }} />}
            <PelicanVoicePanel ticker={ticker} analysis={analysis} loading={loading} voiceSamples={voiceSamples} onSamplesChange={handleSamplesChange} />
            {confluence && <ConfluencePanel confluence={confluence} />}
          </aside>
        </div>

        {!adminDefault && (
          <section className="mt-12 border-t border-white/10 pt-8">
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Source style reference</h2>
              <p className="mt-2 text-sm text-white/64">Blake&apos;s actual TradingView charts. The renderer above is built to match this exact visual language.</p>
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
                  <div className="hidden aspect-[16/10] items-center justify-center px-4 text-center text-sm text-white/48">{reference.label} reference pending</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <LevelEditorPopover
        open={Boolean(editingLevel || draft)}
        ticker={ticker}
        assetClass={state?.assetClass ?? 'crypto'}
        level={editingLevel}
        draft={draft}
        onSave={handleSaveLevel}
        onDelete={handleDeleteLevel}
        onCancel={closeEditor}
      />
    </div>
  )
}
