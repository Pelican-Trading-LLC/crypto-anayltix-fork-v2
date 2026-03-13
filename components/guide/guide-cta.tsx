'use client'

import Link from "next/link"
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

export function GuideCTA() {
  const { openWithPrompt } = usePelicanPanelContext()

  return (
    <div className="mt-20 pt-12 border-t border-[var(--border-subtle)] text-center">
      <h3 className="text-xl font-bold text-[var(--text-primary)]">Ready to get started?</h3>
      <p className="text-[var(--text-secondary)] mt-2">
        Questions? Ask Pelican — it knows everything on this page.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link
          href="/morning"
          className="bg-[var(--accent-primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go to Daily Brief
        </Link>
        <button
          onClick={() => openWithPrompt(null, { visibleMessage: 'Ask Pelican a question', fullPrompt: '[GENERAL]\nThe user wants to start a conversation with Pelican AI. Greet them and ask how you can help with crypto analysis.' }, null)}
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
        >
          Start a Chat
        </button>
        <Link
          href="/journal"
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--bg-elevated)] transition-colors"
        >
          Log a Trade
        </Link>
      </div>
    </div>
  )
}
