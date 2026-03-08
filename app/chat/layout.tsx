"use client"

import type React from "react"
import AppSidebar from "@/components/navigation/app-sidebar"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
