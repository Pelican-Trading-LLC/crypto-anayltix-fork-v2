"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

/** Key used to back up the user's real theme preference while public pages force light. */
export const THEME_BACKUP_KEY = "crypto-analytix-theme-user-pref"

/**
 * Forces light theme on public pages (landing, auth, pricing).
 * Backs up the user's preference to a separate localStorage key so it
 * survives full-page reloads during auth redirects.
 */
export function ForceLightTheme() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Back up the user's real preference before overwriting
    const current = localStorage.getItem("crypto-analytix-theme")
    if (current && current !== "light") {
      localStorage.setItem(THEME_BACKUP_KEY, current)
    }
    setTheme("light")

    return () => {
      // Restore on client-side navigation away from public page
      const saved = localStorage.getItem(THEME_BACKUP_KEY)
      if (saved) {
        setTheme(saved)
        localStorage.removeItem(THEME_BACKUP_KEY)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
