'use client'

import { useEffect, useState } from 'react'
import type { AssetClass, BlakeLevel } from '@/lib/blake-mode/types'

const ROLE_OPTIONS: BlakeLevel['role'][] = ['support', 'resistance', 'target', 'invalidation', 'pivot']
const COLOR_OPTIONS: BlakeLevel['color'][] = ['cyan', 'black', 'red', 'blue']
const DEFAULT_COLOR_BY_ROLE: Record<BlakeLevel['role'], BlakeLevel['color']> = {
  support: 'cyan',
  resistance: 'cyan',
  target: 'blue',
  invalidation: 'red',
  pivot: 'black',
}
const COLOR_CLASS: Record<BlakeLevel['color'], string> = {
  cyan: 'bg-[#2DD4D4]',
  black: 'bg-[#1F2937]',
  red: 'bg-[#DC2626]',
  blue: 'bg-[#2563EB]',
}

export interface LevelEditorDraft {
  price: number
  time?: number
}

export function LevelEditorPopover({
  open,
  ticker,
  assetClass,
  level,
  draft,
  onSave,
  onDelete,
  onCancel,
}: {
  open: boolean
  ticker: string
  assetClass: AssetClass
  level: BlakeLevel | null
  draft: LevelEditorDraft | null
  onSave: (patch: Omit<BlakeLevel, 'id' | 'createdAt' | 'updatedAt'> | Partial<BlakeLevel>) => void
  onDelete?: (id: string) => void
  onCancel: () => void
}) {
  const precision = assetClass === 'forex' ? 5 : 2
  const [price, setPrice] = useState('')
  const [label, setLabel] = useState('')
  const [role, setRole] = useState<BlakeLevel['role']>('resistance')
  const [strength, setStrength] = useState<BlakeLevel['strength']>('major')
  const [color, setColor] = useState<BlakeLevel['color']>('cyan')
  const [note, setNote] = useState('')

  useEffect(() => {
    const source = level ?? draft
    if (!source) return
    const nextRole = level?.role ?? 'resistance'
    setPrice(source.price.toFixed(precision))
    setLabel(level?.label ?? '')
    setRole(nextRole)
    setStrength(level?.strength ?? 'major')
    setColor(level?.color ?? DEFAULT_COLOR_BY_ROLE[nextRole])
    setNote(level?.note ?? '')
  }, [draft, level, precision])

  if (!open) return null

  const save = () => {
    const numericPrice = Number(price)
    if (!Number.isFinite(numericPrice)) return
    onSave({
      ticker,
      price: numericPrice,
      label: label.trim() || null,
      role,
      strength,
      color,
      note: note.trim() || null,
      analyst: 'blake',
      status: level?.status ?? 'active',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-md border border-white/12 bg-[#101827] p-4 text-white shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">{level ? 'Edit Blake Level' : 'Drop Blake Level'}</h3>
            <p className="mt-1 text-xs text-white/50">{ticker} manual level, synced to the demo pipeline</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded px-2 py-1 text-white/50 hover:bg-white/10 hover:text-white">
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-1 text-xs text-white/60">
            Price
            <input value={price} onChange={(event) => setPrice(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 font-mono text-sm text-white outline-none focus:border-[#2DD4D4]" />
          </label>
          <label className="col-span-1 text-xs text-white/60">
            Label
            <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Major resistance" className="mt-1 h-9 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-[#2DD4D4]" />
          </label>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45">Role</div>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setRole(option)
                  setColor(DEFAULT_COLOR_BY_ROLE[option])
                }}
                className={['rounded-md border px-2.5 py-1.5 text-xs capitalize', role === option ? 'border-[#2DD4D4] bg-[#2DD4D4]/12 text-white' : 'border-white/10 bg-white/[0.03] text-white/60'].join(' ')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45">Strength</div>
            <div className="flex rounded-md border border-white/10 p-1">
              {(['major', 'minor'] as const).map((option) => (
                <button key={option} type="button" onClick={() => setStrength(option)} className={['h-8 flex-1 rounded text-xs capitalize', strength === option ? 'bg-white text-[#0B1220]' : 'text-white/55'].join(' ')}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45">Color</div>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button key={option} type="button" onClick={() => setColor(option)} title={option} className={['h-9 w-9 rounded-md border border-white/12', COLOR_CLASS[option], color === option ? 'ring-2 ring-white' : ''].join(' ')} />
              ))}
            </div>
          </div>
        </div>

        <label className="mt-4 block text-xs text-white/60">
          Note
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Watch for rejection candle, RSI divergence likely" className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#2DD4D4]" />
        </label>

        <div className="mt-5 flex items-center justify-between">
          {level ? (
            <button type="button" onClick={() => onDelete?.(level.id)} className="rounded-md border border-[#DC2626]/30 px-3 py-2 text-xs font-semibold text-[#FCA5A5] hover:bg-[#DC2626]/10">
              Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className="rounded-md border border-white/10 px-3 py-2 text-xs font-semibold text-white/65 hover:bg-white/10">
              Cancel
            </button>
            <button type="button" onClick={save} className="rounded-md bg-[#2DD4D4] px-3 py-2 text-xs font-bold text-[#062326] hover:bg-[#67E8F9]">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
