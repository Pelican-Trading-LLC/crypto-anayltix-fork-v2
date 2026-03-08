'use client'

import { motion } from 'framer-motion'
import { User, Lightning } from '@phosphor-icons/react'

export function ChatMock() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-[360px] flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
        <div className="w-6 h-6 rounded-full bg-[#1DA1C4]/10 flex items-center justify-center">
          <Lightning weight="fill" className="w-3.5 h-3.5 text-[#1DA1C4]" />
        </div>
        <span className="text-xs font-medium text-slate-500">Pelican AI</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-4 py-3 space-y-3">
        {/* User message */}
        <div className="flex gap-2.5 justify-end">
          <div className="max-w-[85%] bg-[#1DA1C4]/10 border border-[#1DA1C4]/20 rounded-xl rounded-tr-sm px-3 py-2">
            <p className="text-sm text-slate-900">What&apos;s the funding rate situation on ETH?</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <User weight="regular" className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Assistant message */}
        <div className="flex gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#1DA1C4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightning weight="fill" className="w-3.5 h-3.5 text-[#1DA1C4]" />
          </div>
          <div className="max-w-[90%] space-y-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl rounded-tl-sm px-3 py-2.5 space-y-2">
              {/* Funding Rates */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4] mb-1">Funding Rates</p>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-600">
                    Binance: <span className="font-mono tabular-nums text-emerald-600">+0.018%</span> / 8h (~24% annualized)
                  </p>
                  <p className="text-xs text-slate-600">
                    Bybit: <span className="font-mono tabular-nums text-emerald-600">+0.021%</span> / 8h (~28% annualized)
                  </p>
                  <p className="text-xs text-slate-600">
                    OI delta: <span className="font-mono tabular-nums text-slate-900">+$240M</span> in 24h
                  </p>
                </div>
              </div>

              {/* TradFi Translation */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4] mb-1">TradFi Translation</p>
                <p className="text-xs text-slate-600">
                  Like paying <span className="font-mono tabular-nums text-slate-900">24-28%</span> annual carry on a leveraged futures position. Elevated but not extreme.
                </p>
              </div>

              {/* Your Position */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4] mb-1">Your Position</p>
                <div className="flex gap-4">
                  <p className="text-xs text-slate-600">
                    Holding <span className="font-mono tabular-nums text-slate-900">12.5 ETH</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    P&L <span className="font-mono tabular-nums text-emerald-600">+$1,840</span>
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="pt-1 border-t border-slate-200">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4] mb-1">Recommendation</p>
                <p className="text-xs text-slate-600">
                  Consider moving <span className="font-mono tabular-nums">50%</span> to spot to reduce carry cost. Hold perps only if targeting a <span className="font-mono tabular-nums">3:1</span> R:R on the breakout.
                </p>
              </div>
            </div>

            {/* Typing indicator */}
            <div className="flex items-center gap-1 px-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#1DA1C4]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#1DA1C4]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#1DA1C4]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
