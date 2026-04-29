'use client'

import { useState } from 'react'
import { PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { VoiceSample } from '@/lib/blake-mode/voice/fewShotSamples'
import { VoiceSamplesEditor } from './VoiceSamplesEditor'

interface PelicanVoicePanelProps {
  ticker: string
  analysis: string
  loading: boolean
  voiceSamples: VoiceSample[] | null
  onSamplesChange: (samples: VoiceSample[]) => void
}

export function PelicanVoicePanel({
  ticker,
  analysis,
  loading,
  voiceSamples,
  onSamplesChange,
}: PelicanVoicePanelProps) {
  const [editorOpen, setEditorOpen] = useState(false)

  return (
    <section className="rounded-md border border-white/10 bg-[#101A2B] p-4 shadow-xl shadow-black/20">
      <div className="flex items-center gap-3">
        <img src="/images/pelican-logo.png" alt="Pelican" className="h-16 w-16 rounded-md object-contain" />
        <div>
          <p className="text-sm font-semibold text-white">Pelican Insights, Blake Voice</p>
          <p className="font-mono text-[11px] uppercase tracking-wide text-white/45">${ticker}</p>
        </div>
      </div>

      <div className="mt-4 min-h-32 rounded-md border border-white/10 bg-[#0B1220] p-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-3 w-4/5 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-full animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-white/88">{analysis}</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-3 h-8 px-2 text-xs text-white/60 hover:bg-white/5 hover:text-white"
        onClick={() => setEditorOpen(true)}
      >
        <PencilLine className="h-3.5 w-3.5" />
        Voice samples
      </Button>

      <VoiceSamplesEditor
        open={editorOpen}
        samples={voiceSamples}
        onOpenChange={setEditorOpen}
        onApply={onSamplesChange}
      />
    </section>
  )
}

