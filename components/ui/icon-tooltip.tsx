'use client'

import React from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface IconTooltipProps {
  label: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delayDuration?: number
  kbd?: string
}

export const IconTooltip = React.forwardRef<HTMLSpanElement, IconTooltipProps>(
  function IconTooltip({ label, children, side = 'bottom', delayDuration = 300, kbd }, ref) {
    return (
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <span ref={ref} className="inline-flex">
            {children}
          </span>
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
)
