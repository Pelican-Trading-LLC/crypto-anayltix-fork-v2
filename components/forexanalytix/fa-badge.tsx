'use client'

export function FABadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  if (size === 'sm') {
    return (
      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#4A90C4]/10 text-[#4A90C4]">
        FA
      </span>
    )
  }

  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4A90C4]/10 text-[#4A90C4]">
      ForexAnalytix
    </span>
  )
}

export function FAPoweredBy() {
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)]">
      <div
        className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #2C5F8A, #5B4F8A)' }}
      >
        FA
      </div>
      <span className="text-[10px] text-muted-foreground">
        Powered by <span className="font-semibold text-[#4A90C4]">ForexAnalytix</span>
      </span>
    </div>
  )
}
