'use client'

interface Props {
  source: string
  lastUpdated?: number
  isLive: boolean
}

export function DataFreshness({ source, lastUpdated, isLive }: Props) {
  const age = lastUpdated ? Math.round((Date.now() - lastUpdated) / 1000) : null
  const ageLabel = age !== null
    ? age < 60 ? `${age}s ago`
    : age < 3600 ? `${Math.round(age / 60)}m ago`
    : `${Math.round(age / 3600)}h ago`
    : null

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-amber-500'}`} />
      <span>{source}</span>
      {ageLabel && <span>· {ageLabel}</span>}
      {!isLive && <span className="text-amber-500">(mock)</span>}
    </div>
  )
}
