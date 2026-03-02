"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ShareNetwork, SpinnerGap } from "@phosphor-icons/react"
import { InsightPreviewModal } from "./insight-preview-modal"
import type { InsightCardData } from "@/types/share-cards"

export function TextSelectionToolbar() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [insightData, setInsightData] = useState<InsightCardData | null>(null)
  const [formatError, setFormatError] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const lastSelectedText = useRef("")

  const hideToolbar = useCallback(() => {
    setPosition(null)
    setSelectedText("")
  }, [])

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        // Delay hiding so we don't flash on re-select
        const timeout = setTimeout(hideToolbar, 200)
        return () => clearTimeout(timeout)
      }

      const text = selection.toString().trim()
      if (text.length < 20) return

      // Check if selection is within an assistant message
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      const messageEl =
        container instanceof Element
          ? container.closest('[data-message-role="assistant"]')
          : container.parentElement?.closest('[data-message-role="assistant"]')

      if (!messageEl) {
        hideToolbar()
        return
      }

      const rect = range.getBoundingClientRect()
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      })
      setSelectedText(text)
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [hideToolbar])

  // Hide toolbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (position) hideToolbar()
    }
    window.addEventListener("scroll", handleScroll, true)
    return () => window.removeEventListener("scroll", handleScroll, true)
  }, [position, hideToolbar])

  const handleShareAsCard = useCallback(async () => {
    if (!selectedText) return

    lastSelectedText.current = selectedText
    setIsModalOpen(true)
    setIsFormatting(true)
    setInsightData(null)
    setFormatError(null)
    hideToolbar()

    // Clear the text selection
    window.getSelection()?.removeAllRanges()

    try {
      const res = await fetch("/api/share-card/format-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedText }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to format" }))
        throw new Error(err.error || "Failed to format insight")
      }

      const data: InsightCardData = await res.json()
      setInsightData(data)
    } catch (err) {
      setFormatError((err as Error).message)
    } finally {
      setIsFormatting(false)
    }
  }, [selectedText, hideToolbar])

  const handleRetry = useCallback(async () => {
    if (!lastSelectedText.current) return

    setIsFormatting(true)
    setFormatError(null)

    try {
      const res = await fetch("/api/share-card/format-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedText: lastSelectedText.current }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to format" }))
        throw new Error(err.error || "Failed to format insight")
      }

      const data: InsightCardData = await res.json()
      setInsightData(data)
    } catch (err) {
      setFormatError((err as Error).message)
    } finally {
      setIsFormatting(false)
    }
  }, [])

  return (
    <>
      {/* Floating toolbar */}
      {position && selectedText && (
        <div
          ref={toolbarRef}
          className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={handleShareAsCard}
            disabled={isFormatting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/30 transition-all active:scale-[0.97]"
          >
            {isFormatting ? (
              <SpinnerGap size={14} weight="regular" className="animate-spin" />
            ) : (
              <ShareNetwork size={14} weight="regular" />
            )}
            Share as Card
          </button>
        </div>
      )}

      {/* Preview modal */}
      <InsightPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        insightData={insightData}
        isLoading={isFormatting}
        error={formatError}
        onRetry={handleRetry}
      />
    </>
  )
}
