'use client'

import { MOCK_EDUCATION } from '@/lib/crypto-mock-data'
import { Clock } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

const categoryColors: Record<string, string> = {
  fundamentals: '#1DA1C4',
  derivatives: '#A78BFA',
  risk: '#EF4444',
  strategy: '#22C55E',
}

export default function LearnPage() {
  const router = useRouter()

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            Learn
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Crypto concepts explained for TradFi traders
          </p>
        </div>
        <span className="text-[13px] font-mono tabular-nums text-[var(--text-muted)]">
          0 of {MOCK_EDUCATION.length} completed
        </span>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_EDUCATION.map((module) => (
          <button
            key={module.slug}
            onClick={() =>
              router.push(
                `/chat?prompt=${encodeURIComponent(`Teach me about ${module.title}. I'm a TradFi trader.`)}`
              )
            }
            className="text-left rounded-xl border border-[rgba(255,255,255,0.06)] p-5 transition-all duration-150 hover:border-[rgba(255,255,255,0.15)] cursor-pointer"
            style={{
              background: 'var(--bg-surface, #111118)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Category pill */}
            <span
              className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full capitalize mb-3"
              style={{
                backgroundColor: `${categoryColors[module.category] || '#6B7280'}20`,
                color: categoryColors[module.category] || '#6B7280',
              }}
            >
              {module.category}
            </span>

            {/* Title */}
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-2">
              {module.title}
            </h3>

            {/* TradFi analog */}
            <p className="text-[12px] italic text-[var(--text-muted)] mb-3">
              <span className="text-[var(--text-secondary)] not-italic">
                TradFi:
              </span>{' '}
              {module.tradfi}
            </p>

            {/* Time estimate */}
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <Clock size={14} weight="regular" />
              <span className="text-[12px] font-mono tabular-nums">
                {module.minutes} min
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
