'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Rocket } from '@phosphor-icons/react'
import { useAuth } from '@/lib/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  {
    title: 'What markets do you trade?',
    options: ['Stocks & ETFs', 'Futures', 'Forex', 'Options', 'Crypto', 'New to Trading'],
    multi: true,
  },
  {
    title: 'How familiar are you with crypto?',
    options: ['Never traded crypto', 'Bought some on Coinbase', 'Active crypto trader', 'DeFi/derivatives experienced'],
    multi: false,
  },
  {
    title: 'What interests you most?',
    options: ['Portfolio tracking', 'AI market analysis', 'Derivatives & funding rates', 'On-chain / whale tracking', 'Macro-to-crypto correlations', 'Education'],
    multi: true,
  },
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<string[][]>([[], [], []])
  const [saving, setSaving] = useState(false)

  const currentStep = STEPS[step]!
  const currentSelections = selections[step]!

  const toggleSelection = (option: string) => {
    const updated = [...selections]
    if (currentStep.multi) {
      const idx = currentSelections.indexOf(option)
      if (idx >= 0) {
        updated[step] = currentSelections.filter(o => o !== option)
      } else {
        updated[step] = [...currentSelections, option]
      }
    } else {
      updated[step] = [option]
    }
    setSelections(updated)
  }

  const complete = async (skipped = false) => {
    if (!user) return
    setSaving(true)
    const supabase = createClient()

    await supabase.from('trader_survey').upsert({
      user_id: user.id,
      markets_traded: skipped ? [] : selections[0],
      experience_level: skipped ? 'skipped' : (selections[1]?.[0] || ''),
      goals: skipped ? '' : selections[2]?.join(', ') || '',
      skipped,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    await supabase.from('user_credits').update({ onboarding_complete: true }).eq('user_id', user.id)

    router.push('/dashboard')
  }

  const canContinue = currentSelections.length > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-[520px]">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[#1DA1C4] scale-110' : i < step ? 'bg-[#1DA1C4]/50' : 'bg-muted'}`} />
          ))}
        </div>

        <h1 className="text-xl font-semibold text-center mb-6">{currentStep.title}</h1>

        {/* Option cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {currentStep.options.map(option => {
            const selected = currentSelections.includes(option)
            return (
              <button key={option} onClick={() => toggleSelection(option)}
                className={`relative p-4 rounded-xl border text-left text-[13px] font-medium transition-all cursor-pointer hover:translate-y-[-1px] ${
                  selected ? 'border-[#1DA1C4] bg-[#1DA1C4]/5 text-foreground' : 'border-[var(--border)] bg-card text-muted-foreground hover:border-[var(--ring)]'
                }`}>
                {selected && <Check size={14} weight="bold" className="absolute top-2 right-2 text-[#1DA1C4]" />}
                {option}
              </button>
            )
          })}
        </div>

        {/* Continue button */}
        <button onClick={() => step < 2 ? setStep(step + 1) : complete(false)}
          disabled={!canContinue || saving}
          className="w-full py-3 rounded-lg text-white text-sm font-medium disabled:opacity-30 transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #1A6FB5, #25BFDF)' }}>
          {step === 2 ? <><Rocket size={16} /> Get Started</> : 'Continue'}
        </button>

        {/* Skip link */}
        <button onClick={() => complete(true)}
          className="w-full text-center text-[13px] text-muted-foreground mt-4 hover:text-foreground transition-colors cursor-pointer">
          Skip for now
        </button>
      </div>
    </div>
  )
}
