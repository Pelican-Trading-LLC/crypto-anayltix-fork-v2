"use client"

import type React from "react"
import { TopNav } from "@/components/navigation/top-nav"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav />
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
