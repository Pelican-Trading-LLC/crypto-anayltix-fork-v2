"use client"

import type React from "react"

import { AuthProvider } from "./auth-provider"
import { SWRProvider } from "./swr-provider"
import { ToastProvider } from "./toast-provider"
import { TranslationProvider } from "./translation-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { CreditsProvider } from "@/providers/credits-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={true}
      storageKey="pelican-theme-v2"
    >
      <TranslationProvider>
        <SWRProvider>
          <AuthProvider>
            <CreditsProvider>
              <TooltipProvider delayDuration={300} skipDelayDuration={100}>
                <ToastProvider>{children}</ToastProvider>
              </TooltipProvider>
            </CreditsProvider>
          </AuthProvider>
        </SWRProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}
