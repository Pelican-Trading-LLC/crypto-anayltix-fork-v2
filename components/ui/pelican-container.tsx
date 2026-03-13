"use client"

import { cn } from "@/lib/utils"

export function PelicanContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden app-background-gradient", className)}>
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </div>
  )
}
