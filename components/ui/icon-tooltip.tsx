'use client'

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface IconTooltipProps {
  label: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delayDuration?: number
  asChild?: boolean
  kbd?: string
}

export function IconTooltip({
  label,
  children,
  side = 'bottom',
  delayDuration = 300,
  asChild = true,
  kbd,
}: IconTooltipProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild={asChild}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>
        <span>{label}</span>
        {kbd && (
          <kbd className="ml-1.5 text-[10px] opacity-60 font-mono bg-white/10 px-1 py-0.5 rounded">
            {kbd}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
