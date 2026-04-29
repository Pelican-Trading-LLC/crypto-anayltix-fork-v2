'use client'

import { TICKER_CONFIGS } from '@/lib/blake-mode/data'

interface TickerSelectorProps {
  tickers: string[]
  selected: string
  onSelect: (ticker: string) => void
}

export function TickerSelector({ tickers, selected, onSelect }: TickerSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tickers.map((ticker, index) => {
        const config = TICKER_CONFIGS[ticker]
        const selectedTicker = ticker === selected
        const needsDivider = index === 3 || index === 6

        return (
          <div key={ticker} className="flex items-center gap-2">
            {needsDivider && <div className="mx-1 h-8 w-px bg-white/12" />}
            <button
              type="button"
              onClick={() => onSelect(ticker)}
              className={[
                'h-9 rounded-md border px-3 font-mono text-sm font-semibold tabular-nums transition',
                selectedTicker
                  ? 'border-[#5BA3D9] bg-[#5BA3D9]/14 text-white shadow-[0_0_0_1px_rgba(91,163,217,0.2)]'
                  : 'border-white/10 bg-white/[0.03] text-white/62 hover:border-white/20 hover:bg-white/[0.06] hover:text-white',
              ].join(' ')}
              aria-pressed={selectedTicker}
              title={config ? `${config.displayName} · ${config.assetClass}` : ticker}
            >
              {ticker}
            </button>
          </div>
        )
      })}
    </div>
  )
}

