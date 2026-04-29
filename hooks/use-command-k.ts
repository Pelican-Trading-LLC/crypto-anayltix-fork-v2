"use client"

import { useEffect, useState } from "react"

/**
 * Hook for global CMD+K / CTRL+K keyboard shortcut
 * Opens the ticker search modal
 */
export function useCommandK() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K (Mac) or CTRL+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('token-analytix:open-command-palette', handleOpen)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('token-analytix:open-command-palette', handleOpen)
    }
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
