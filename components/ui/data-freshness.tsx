'use client'

interface Props {
  source: string
  isLive: boolean
}

export function DataFreshness({ source, isLive }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-[#3EBD8C]' : 'bg-[#D4A042]'}`} />
      <span>{source}</span>
      {!isLive && <span className="text-[#D4A042]">(mock)</span>}
    </div>
  )
}
