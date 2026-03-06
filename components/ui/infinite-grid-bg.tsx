'use client'

import React, { useRef, useId } from 'react'
import { cn } from '@/lib/utils'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from 'framer-motion'

interface InfiniteGridBgProps {
  children?: React.ReactNode
  className?: string
  /** Grid line color — use a light-theme-safe color. Default: 'text-slate-300' */
  gridColorClass?: string
  /** Grid scroll speed (px per frame). Default: 0.3 */
  speed?: number
  /** Radius of the mouse-reveal spotlight in px. Default: 350 */
  spotlightRadius?: number
}

export function InfiniteGridBg({
  children,
  className,
  gridColorClass = 'text-slate-300',
  speed = 0.3,
  spotlightRadius = 350,
}: InfiniteGridBgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const patternId = useId()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + speed) % 40)
    gridOffsetY.set((gridOffsetY.get() + speed) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(${spotlightRadius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn('relative w-full overflow-hidden', className)}
    >
      {/* Base grid — subtle, always visible */}
      <div className="absolute inset-0 z-0 opacity-[0.06]">
        <GridPattern
          id={`${patternId}-base`}
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          colorClass={gridColorClass}
        />
      </div>

      {/* Mouse-reveal grid — brighter, follows cursor */}
      <motion.div
        className="absolute inset-0 z-0 opacity-25"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern
          id={`${patternId}-reveal`}
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          colorClass={gridColorClass}
        />
      </motion.div>

      {/* Ambient glow blobs — Pelican brand palette, light-theme safe */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-15%] top-[-15%] w-[35%] h-[35%] rounded-full bg-blue-500/[0.08] blur-[120px]" />
        <div className="absolute right-[5%] top-[-5%] w-[20%] h-[20%] rounded-full bg-cyan-400/[0.06] blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-15%] w-[35%] h-[35%] rounded-full bg-blue-600/[0.06] blur-[120px]" />
      </div>

      {/* Content on top */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function GridPattern({
  id,
  offsetX,
  offsetY,
  colorClass,
}: {
  id: string
  offsetX: ReturnType<typeof useMotionValue<number>>
  offsetY: ReturnType<typeof useMotionValue<number>>
  colorClass: string
}) {
  const patternRef = useRef<SVGPatternElement>(null)

  useAnimationFrame(() => {
    if (patternRef.current) {
      patternRef.current.setAttribute('x', String(offsetX.get()))
      patternRef.current.setAttribute('y', String(offsetY.get()))
    }
  })

  return (
    <svg className="w-full h-full">
      <defs>
        <pattern
          ref={patternRef}
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className={colorClass}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
