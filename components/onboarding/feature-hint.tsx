"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureHintProps {
  id: string
  hint: string
  placement?: "top" | "bottom"
  children: React.ReactNode
  delay?: number
}

const STORAGE_PREFIX = "pelican_hint_"

export function FeatureHint({
  id,
  hint,
  placement = "top",
  children,
  delay = 1500,
}: FeatureHintProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const storageKey = `${STORAGE_PREFIX}${id}`

  useEffect(() => {
    // Already dismissed
    if (typeof window === "undefined") return
    if (localStorage.getItem(storageKey)) return

    timerRef.current = setTimeout(() => setVisible(true), delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [storageKey, delay])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(storageKey, "1")
  }

  return (
    <div className="relative inline-flex">
      <div onClick={visible ? dismiss : undefined}>{children}</div>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: placement === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === "top" ? 4 : -4 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={dismiss}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 z-50 cursor-pointer",
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
              "bg-[var(--accent-primary)] text-white shadow-lg",
              placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {hint}
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[var(--accent-primary)]",
                placement === "top" ? "top-full -mt-1" : "bottom-full -mb-1",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
