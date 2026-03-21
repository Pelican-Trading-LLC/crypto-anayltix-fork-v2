'use client'

import { LEARNING_PATHS, TRADFI_GLOSSARY } from '@/lib/crypto-mock-data'
import { CheckCircle, Circle, ArrowRight } from '@phosphor-icons/react'

export default function LearnPage() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Knowledge Base
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your bridge from TradFi to tokenized markets
        </p>
      </div>

      {/* Learning Paths — 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEARNING_PATHS.map((path) => (
          <div
            key={path.id}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 relative overflow-hidden"
          >
            {/* Colored left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ backgroundColor: path.color }}
            />

            {/* Title */}
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {path.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {path.description}
            </p>

            {/* Lesson count badge */}
            <span
              className="inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${path.color}15`,
                color: path.color,
              }}
            >
              {path.totalLessons} lessons
            </span>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(path.completedLessons / path.totalLessons) * 100}%`,
                    backgroundColor: path.color,
                  }}
                />
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-1.5 tabular-nums">
                {path.completedLessons} of {path.totalLessons} complete
              </p>
            </div>

            {/* Module list — first 4 */}
            <ul className="mt-4 space-y-2">
              {path.modules.slice(0, 4).map((mod, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {mod.completed ? (
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="text-[#22c55e] shrink-0"
                    />
                  ) : (
                    <Circle
                      size={18}
                      weight="regular"
                      className="text-[var(--text-muted)] shrink-0"
                    />
                  )}
                  <span
                    className={`text-sm ${
                      mod.completed
                        ? 'line-through text-[var(--text-muted)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {mod.title}
                  </span>
                </li>
              ))}
            </ul>

            {/* Continue / Start button */}
            <button
              className="mt-5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: `${path.color}26`,
                color: path.color,
              }}
            >
              {path.completedLessons > 0 ? 'Continue' : 'Start'}
            </button>
          </div>
        ))}
      </div>

      {/* TradFi Glossary */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          TradFi → Token Glossary
        </h2>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-5 py-3">
                  Traditional
                </th>
                <th className="w-8" />
                <th className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-5 py-3">
                  Tokenized Equivalent
                </th>
              </tr>
            </thead>
            <tbody>
              {TRADFI_GLOSSARY.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">
                    {item.traditional}
                  </td>
                  <td className="text-center">
                    <ArrowRight
                      size={14}
                      weight="bold"
                      className="text-[var(--text-muted)] inline-block"
                    />
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--text-primary)] font-medium">
                    {item.tokenized}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
