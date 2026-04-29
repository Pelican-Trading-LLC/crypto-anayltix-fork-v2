'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_VOICE_SAMPLES, type VoiceSample } from '@/lib/blake-mode/voice/fewShotSamples'

interface VoiceSamplesEditorProps {
  open: boolean
  samples: VoiceSample[] | null
  onOpenChange: (open: boolean) => void
  onApply: (samples: VoiceSample[]) => void
}

export function VoiceSamplesEditor({ open, samples, onOpenChange, onApply }: VoiceSamplesEditorProps) {
  const [drafts, setDrafts] = useState<VoiceSample[]>(samples ?? DEFAULT_VOICE_SAMPLES)

  useEffect(() => {
    if (open) setDrafts(samples ?? DEFAULT_VOICE_SAMPLES)
  }, [open, samples])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] overflow-y-auto border-white/10 bg-[#0E1525] text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Voice Samples</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {drafts.map((sample, index) => (
            <label key={sample.id} className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/50">
                {sample.ticker} sample {index + 1}
              </span>
              <Textarea
                value={sample.output}
                onChange={(event) => {
                  const next = drafts.map((draft) =>
                    draft.id === sample.id ? { ...draft, output: event.target.value } : draft
                  )
                  setDrafts(next)
                }}
                className="min-h-28 border-white/10 bg-white/5 font-mono text-sm leading-relaxed text-white"
              />
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onApply(drafts)
              onOpenChange(false)
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

