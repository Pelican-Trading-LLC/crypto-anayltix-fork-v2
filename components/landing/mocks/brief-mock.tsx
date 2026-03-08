'use client'

import { motion } from 'framer-motion'
import { Sun, TrendUp, Crosshair } from '@phosphor-icons/react'

export function BriefMock() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-[360px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sun weight="fill" className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-900">Pelican Brief</span>
          <span className="text-[10px] text-slate-400 font-mono">&mdash; Mar 8, 2026</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-600">Live</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4 py-3 space-y-3">
        {/* Market Overnight */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendUp weight="bold" className="w-3.5 h-3.5 text-[#1DA1C4]" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4]">Market Overnight</p>
          </div>
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">BTC</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tabular-nums text-slate-900">$84,220</span>
                <span className="text-xs font-mono tabular-nums text-emerald-600">+3.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">ETH</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tabular-nums text-slate-900">$3,890</span>
                <span className="text-xs font-mono tabular-nums text-emerald-600">+2.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">SOL</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tabular-nums text-slate-900">$138.50</span>
                <span className="text-xs font-mono tabular-nums text-red-600">-1.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Your Positions */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Crosshair weight="bold" className="w-3.5 h-3.5 text-[#1DA1C4]" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4]">Your Positions</p>
          </div>
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-900">BTC</span>
                <span className="text-[10px] text-slate-300">Long 0.5</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-emerald-600">+$4,110</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-900">SOL</span>
                <span className="text-[10px] text-slate-300">Long 48</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-red-600">-$168.00</span>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sun weight="bold" className="w-3.5 h-3.5 text-[#1DA1C4]" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#1DA1C4]">Today&apos;s Focus</p>
          </div>
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-600">BTC options expiry Friday &mdash; $4.2B notional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#1DA1C4]" />
              <span className="text-xs text-slate-600">SOL funding elevated &mdash; review carry costs</span>
            </div>
          </div>
        </div>

        {/* Streaming dots */}
        <div className="flex items-center gap-1 px-1">
          <motion.div
            className="w-1 h-1 rounded-full bg-slate-300"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1 h-1 rounded-full bg-slate-300"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="w-1 h-1 rounded-full bg-slate-300"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </div>
      </div>
    </div>
  )
}
