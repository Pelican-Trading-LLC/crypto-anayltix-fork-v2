'use client'

import { Bird, ArrowRight, Check, CircleNotch, WarningCircle } from '@phosphor-icons/react'
import { TokenIntelData } from '@/lib/crypto-mock-data'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

interface Props {
  data: TokenIntelData | null
  loading?: boolean
  noDataSymbol?: string | null
}

const VERDICT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  BULLISH: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
  BEARISH: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
  NEUTRAL: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
  CAUTION: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
}

export function PelicanSynthesisPanel({ data, loading, noDataSymbol }: Props) {
  const { openWithPrompt } = usePelicanPanelContext()

  if (loading) {
    return (
      <div className="rounded-xl border p-6 h-full flex flex-col items-center justify-center gap-3"
        style={{ background: 'rgba(29,161,196,0.03)', borderColor: 'rgba(29,161,196,0.15)' }}>
        <CircleNotch size={24} className="text-[#1DA1C4] animate-spin" />
        <span className="text-[13px] text-muted-foreground">Pelican is analyzing...</span>
        <div className="flex gap-2 mt-2">
          {['Checking price action', 'Scanning derivatives', 'Reading on-chain', 'Synthesizing'].map((s, i) => (
            <span key={s} className="text-[10px] text-muted-foreground/50">{i < 3 ? '\u2713' : '...'} {s}</span>
          ))}
        </div>
      </div>
    )
  }

  if (noDataSymbol) {
    return (
      <div className="rounded-xl border p-6 h-full flex flex-col items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.02)', borderColor: 'rgba(239,68,68,0.1)' }}>
        <WarningCircle size={48} weight="thin" className="text-amber-500/40 mb-3" />
        <span className="text-[14px] text-muted-foreground mb-1">No analysis available for {noDataSymbol}</span>
        <span className="text-[12px] text-muted-foreground/60 mb-4">Data sources did not return results for this token.</span>
        <button
          onClick={() => openWithPrompt(
            noDataSymbol,
            {
              visibleMessage: `What can you tell me about ${noDataSymbol}?`,
              fullPrompt: `[TOKEN INQUIRY]\nSymbol: ${noDataSymbol}\nContext: User searched for this token on Token Intelligence but no data was available from our feeds. Provide whatever analysis you can based on your knowledge.`
            },
            null
          )}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-medium transition-all hover:brightness-110 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #1A6FB5, #25BFDF)', boxShadow: '0 2px 8px rgba(29,161,196,0.2)' }}
        >
          <Bird size={14} weight="fill" />
          Ask Pelican about {noDataSymbol}
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-xl border p-6 h-full flex flex-col items-center justify-center"
        style={{ background: 'rgba(29,161,196,0.02)', borderColor: 'rgba(29,161,196,0.1)' }}>
        <Bird size={48} weight="thin" className="text-[#1DA1C4]/30 mb-3" />
        <span className="text-[14px] text-muted-foreground mb-1">Search a ticker to generate analysis</span>
        <span className="text-[12px] text-muted-foreground/60">Try BTC, ETH, SOL, AAVE, or WIF</span>
      </div>
    )
  }

  const defaultStyle = { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' }
  const verdictStyle = VERDICT_STYLES[data.pelican_verdict] ?? defaultStyle

  return (
    <div className="rounded-xl border p-5 h-full flex flex-col"
      style={{
        background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 40%)',
        borderColor: 'rgba(29,161,196,0.15)',
      }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bird size={18} weight="fill" className="text-[#1DA1C4]" />
          <span className="text-[13px] font-semibold text-[#1DA1C4]">Pelican Synthesis</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">{data.pelican_checked_at}</span>
      </div>

      {/* Ticker + Verdict + Confidence */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xl font-bold">${data.symbol}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${verdictStyle.bg} ${verdictStyle.text} ${verdictStyle.border}`}>
          {data.pelican_verdict}
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${data.pelican_confidence}%`, background: 'linear-gradient(90deg, #1A6FB5, #25BFDF)' }} />
          </div>
          <span className="font-mono text-[11px] text-[#1DA1C4] font-semibold tabular-nums">{data.pelican_confidence}%</span>
        </div>
      </div>

      {/* Synthesis Text */}
      <div className="flex-1 mb-4">
        <p className="text-[14px] leading-[1.75] text-foreground/90">
          {data.pelican_synthesis}
        </p>
      </div>

      {/* What Pelican Checked */}
      <details className="group mb-4">
        <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-1.5">
          <span className="text-[10px]">{'\u25B8'}</span> What Pelican checked
        </summary>
        <div className="mt-2 pl-3 space-y-1">
          {data.pelican_sources.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Check size={10} className="text-green-500" />
              {s}
            </div>
          ))}
        </div>
      </details>

      {/* Ask Pelican Follow-up — opens pop-out panel */}
      <button
        onClick={() => openWithPrompt(
          data.symbol,
          {
            visibleMessage: `Deep dive on ${data.symbol}`,
            fullPrompt: `[TOKEN ANALYSIS]\nSymbol: ${data.symbol}\nName: ${data.name}\nPrice: $${data.price}\n24h Change: ${data.price_change_24h}%\n7d Change: ${data.price_change_7d}%\n30d Change: ${data.price_change_30d}%\nFunding Rate: ${(data.funding_rate * 100).toFixed(4)}%\nOpen Interest Change 24h: ${data.oi_change_24h}%\nLong/Short Ratio: ${data.long_short_ratio}\nRisk Score: ${data.risk_score}/10\nPelican Verdict: ${data.pelican_verdict}\n\nProvide a deep-dive trade setup: entry zones, targets, stops, position sizing guidance, and key risks to monitor. Explain derivatives concepts using TradFi analogs for a trader coming from futures/forex.`
          },
          null
        )}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-[13px] font-medium transition-all hover:brightness-110 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #1A6FB5, #25BFDF)', boxShadow: '0 2px 8px rgba(29,161,196,0.2)' }}
      >
        Ask Pelican for trade setup <ArrowRight size={14} />
      </button>
    </div>
  )
}
