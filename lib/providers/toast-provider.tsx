"use client"

import type React from "react"

import { Toaster as HotToaster } from "react-hot-toast"
import { Toaster } from "@/components/ui/toaster"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
      <HotToaster position="top-right" />
    </>
  )
}
