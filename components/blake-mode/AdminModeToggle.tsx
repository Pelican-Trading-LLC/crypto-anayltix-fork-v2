'use client'

export function AdminModeToggle({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      title="Admin Mode: click chart to drop levels"
      className={[
        'inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-[10px] font-bold uppercase tracking-wide transition',
        enabled ? 'border-[#DC2626]/40 bg-[#DC2626]/12 text-[#991B1B]' : 'border-black/15 bg-black/[0.03] text-[#1F2937]/65',
      ].join(' ')}
    >
      <span className={['h-2 w-2 rounded-full', enabled ? 'bg-[#DC2626]' : 'bg-[#6B7280]'].join(' ')} />
      {enabled ? 'Editing' : 'Admin Mode'}
    </button>
  )
}
