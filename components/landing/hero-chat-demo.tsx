'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lightning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// Animation phases
type Phase = 'idle' | 'user-typing' | 'thinking' | 'block-1' | 'block-2' | 'block-3' | 'hold' | 'fade-out'

const USER_PROMPT = "What's happening with SOL funding rates?"
const TYPING_SPEED = 40 // ms per character
const THINKING_DURATION = 1500
const BLOCK_DELAY = 400
const HOLD_DURATION = 4000
const FADE_DURATION = 600
const RESTART_DELAY = 1000

export function HeroChatDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [typedChars, setTypedChars] = useState(0)
  const [visible, setVisible] = useState(true)

  const runSequence = useCallback(async () => {
    // Helper to wait
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

    setVisible(true)
    setTypedChars(0)

    // Phase: type user message
    setPhase('user-typing')
    for (let i = 1; i <= USER_PROMPT.length; i++) {
      setTypedChars(i)
      await wait(TYPING_SPEED)
    }
    await wait(300)

    // Phase: thinking
    setPhase('thinking')
    await wait(THINKING_DURATION)

    // Phase: blocks appear
    setPhase('block-1')
    await wait(BLOCK_DELAY)
    setPhase('block-2')
    await wait(BLOCK_DELAY)
    setPhase('block-3')
    await wait(HOLD_DURATION)

    // Fade out
    setPhase('fade-out')
    setVisible(false)
    await wait(FADE_DURATION + RESTART_DELAY)

    // Restart
    setPhase('idle')
  }, [])

  useEffect(() => {
    // Start after a short mount delay
    const timer = setTimeout(() => {
      const loop = async () => {
        while (true) {
          await runSequence()
        }
      }
      loop()
    }, 800)
    return () => clearTimeout(timer)
  }, [runSequence])

  const showUser = phase !== 'idle'
  const showThinking = phase === 'thinking'
  const showBlock1 = ['block-1', 'block-2', 'block-3', 'hold', 'fade-out'].includes(phase)
  const showBlock2 = ['block-2', 'block-3', 'hold', 'fade-out'].includes(phase)
  const showBlock3 = ['block-3', 'hold', 'fade-out'].includes(phase)

  return (
    <div className={cn(
      "relative mx-auto w-full max-w-2xl transition-opacity duration-500",
      visible ? "opacity-100" : "opacity-0"
    )}>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-full bg-[#4A90C4]/10 flex items-center justify-center">
            <Lightning weight="fill" className="w-4 h-4 text-[#4A90C4]" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Pelican AI</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

          </div>
        </div>

        {/* Chat area */}
        <div className="px-4 py-4 space-y-3 min-h-[320px] sm:min-h-[360px]">
          {/* User message */}
          {showUser && (
            <div className="flex justify-end animate-fade-in">
              <div className="text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%]" style={{ background: 'linear-gradient(135deg, #2C5F8A, #5B4F8A)' }}>
                {USER_PROMPT.substring(0, typedChars)}
                {phase === 'user-typing' && (
                  <span className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 animate-pulse align-middle" />
                )}
              </div>
            </div>
          )}

          {/* Thinking indicator */}
          {showThinking && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-[#4A90C4]/10 flex items-center justify-center flex-shrink-0">
                <Lightning weight="fill" className="w-3 h-3 text-[#4A90C4]" />
              </div>
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="thinking-dot" style={{ animationDelay: '0ms' }} />
                <div className="thinking-dot" style={{ animationDelay: '150ms' }} />
                <div className="thinking-dot" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Response blocks */}
          {(showBlock1 || showBlock2 || showBlock3) && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#4A90C4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightning weight="fill" className="w-3 h-3 text-[#4A90C4]" />
              </div>
              <div className="space-y-2.5 flex-1 min-w-0">
                {/* Block 1: Position Context */}
                {showBlock1 && (
                  <div className="animate-fade-slide-up rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-[10px] uppercase tracking-wider font-medium text-[#4A90C4] mb-1.5">
                      Your Position
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You&apos;re holding <span className="font-mono font-medium text-slate-900">48 SOL</span> from
                      <span className="font-mono font-medium text-slate-900"> $142.00</span>.
                      Currently <span className="font-mono font-medium text-[#E06565]">-2.46%</span> at
                      <span className="font-mono font-medium text-slate-900"> $138.50</span>.
                    </p>
                  </div>
                )}

                {/* Block 2: Funding Rate Analysis */}
                {showBlock2 && (
                  <div className="animate-fade-slide-up rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-[10px] uppercase tracking-wider font-medium text-[#4A90C4] mb-1.5">
                      Funding Rate Analysis
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-600">
                        SOL funding at <span className="font-mono font-medium text-slate-900">0.025%</span> per 8h
                        (~<span className="font-mono font-medium text-slate-900">34%</span> annualized)
                      </p>
                      <p className="text-xs text-slate-600">
                        In TradFi terms: you&apos;re paying <span className="font-mono font-medium text-[#E06565]">34% annual carry</span> on
                        a leveraged futures position.
                      </p>
                    </div>
                  </div>
                )}

                {/* Block 3: Recommendation */}
                {showBlock3 && (
                  <div className="animate-fade-slide-up rounded-xl bg-[#4A90C4]/5 border border-[#4A90C4]/20 p-3">
                    <p className="text-[10px] uppercase tracking-wider font-medium text-[#4A90C4] mb-1.5">
                      Recommendation
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Elevated funding signals overcrowded longs. Consider reducing exposure
                      or switching to <span className="font-mono font-medium text-slate-900">spot</span> to
                      avoid the carry cost.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
