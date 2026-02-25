"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

/**
 * Forces dark theme on pages that sit outside the (features) layout
 * but should always render in dark mode (e.g. /strategies).
 *
 * Prevents flash of invisible content when navigating from a
 * ForceLightTheme page (auth, pricing) to these pages.
 */
export function ForceDarkTheme() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== "dark") {
      setTheme("dark")
    }
  }, [resolvedTheme, setTheme])

  return null
}
