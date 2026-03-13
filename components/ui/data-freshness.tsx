'use client'

interface Props {
  source: string
  isLive: boolean
}

export function DataFreshness({ source, isLive }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-amber-500'}`} />
      <span>{source}</span>
      {!isLive && <span className="text-amber-500">(mock)</span>}
    </div>
  )
}
