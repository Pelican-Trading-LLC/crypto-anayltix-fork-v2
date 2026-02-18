"use client"

const quickNavItems = [
  { icon: '🌅', title: 'Morning Routine', anchor: '#morning-routine' },
  { icon: '💬', title: 'Smarter Prompts', anchor: '#smarter-prompts' },
  { icon: '📓', title: 'Track & Improve', anchor: '#track-improve' },
  { icon: '🗺️', title: 'Market Intel', anchor: '#market-intel' },
  { icon: '📊', title: 'Earnings Edge', anchor: '#earnings-edge' },
  { icon: '🎓', title: 'Learn as You Go', anchor: '#learn' },
]

export function GuideHero() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
        Getting the Most from Pelican
      </h1>
      <p className="text-lg text-[var(--text-secondary)] mt-3">
        Your AI trading co-pilot is more powerful than you think.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
        {quickNavItems.map((item) => (
          <button
            key={item.anchor}
            onClick={() => {
              document.querySelector(item.anchor)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 hover:border-[color-mix(in_oklch,var(--accent-primary)_50%,transparent)] transition-colors cursor-pointer text-left"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-medium text-[var(--text-primary)] mt-2">{item.title}</p>
          </button>
        ))}
      </div>

      <p className="text-sm text-[var(--text-secondary)] text-center mt-6">
        or scroll to read everything
      </p>
    </div>
  )
}
