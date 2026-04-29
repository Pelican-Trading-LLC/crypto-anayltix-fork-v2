'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ChartLineUp, EnvelopeSimple, MicrophoneStage } from '@phosphor-icons/react'

export default function AdminIndexPage() {
  const [generating, setGenerating] = useState(false)

  const generateBriefing = async () => {
    setGenerating(true)
    try {
      await fetch('/api/blake-mode/briefings', { method: 'POST' })
      toast.success("Today's briefing is live")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="text-white">
      <div className="mb-7">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#2DD4D4]">Blake Mode Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Amplification Console</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/58">Start with human levels, then push the same signal into briefings and voice tuning.</p>
      </div>

      <div className="grid max-w-5xl grid-cols-3 gap-5">
        <AdminAction
          href="/blake-mode/admin"
          icon={<ChartLineUp size={28} />}
          title="Update Levels"
          body="Drop Blake's daily support, resistance, target, and invalidation levels."
        />
        <button
          type="button"
          onClick={generateBriefing}
          className="rounded-md border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-[#2DD4D4]/40 hover:bg-white/[0.06]"
        >
          <EnvelopeSimple size={28} className="text-[#2DD4D4]" />
          <h2 className="mt-4 text-lg font-semibold">Generate Today&apos;s Briefing</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">{generating ? 'Generating...' : 'Rank setups and create the email-ready morning desk note.'}</p>
        </button>
        <AdminAction
          href="/voice-lab"
          icon={<MicrophoneStage size={28} />}
          title="Voice Lab"
          body="Edit samples and promote recent Pelican generations into the voice bank."
        />
      </div>
    </main>
  )
}

function AdminAction({ href, icon, title, body }: { href: string; icon: ReactNode; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-md border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#2DD4D4]/40 hover:bg-white/[0.06]">
      <div className="text-[#2DD4D4]">{icon}</div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/58">{body}</p>
    </Link>
  )
}
