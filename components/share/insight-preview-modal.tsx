"use client"

import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SpinnerGap, X } from "@phosphor-icons/react"
import { ShareButton } from "./share-button"
import type { InsightCardData, ShareFormat } from "@/types/share-cards"

interface InsightPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  insightData: InsightCardData | null
  isLoading: boolean
  error: string | null
  onRetry?: () => void
}

export function InsightPreviewModal({
  isOpen,
  onClose,
  insightData,
  isLoading,
  error,
  onRetry,
}: InsightPreviewModalProps) {
  const [format, setFormat] = useState<ShareFormat>("og")

  const imageUrl = useMemo(() => {
    if (!insightData) return ""
    const params = new URLSearchParams({
      type: "pelican-insight",
      headline: insightData.headline,
      format,
    })
    if (insightData.statPrimary) params.set("statPrimary", insightData.statPrimary)
    if (insightData.statSecondary) params.set("statSecondary", insightData.statSecondary)
    if (insightData.tickers.length > 0) params.set("tickers", insightData.tickers.join(","))
    return `/api/share-card?${params.toString()}`
  }, [insightData, format])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-[var(--bg-elevated)] border-[var(--border-subtle)] sm:max-w-2xl"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[var(--text-primary)]">Share Insight Card</DialogTitle>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
          >
            <X size={18} className="text-[var(--text-muted)]" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <SpinnerGap size={32} weight="regular" className="animate-spin text-[var(--accent-primary)]" />
              <span className="text-sm text-[var(--text-muted)]">Formatting insight...</span>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-sm text-[var(--data-negative)]">{error}</span>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* Preview */}
          {insightData && !isLoading && !error && (
            <>
              {/* Format toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormat("og")}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    format === "og"
                      ? "bg-[var(--accent-muted)] text-[var(--accent-primary)] font-medium"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  Twitter / LinkedIn
                </button>
                <button
                  onClick={() => setFormat("square")}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    format === "square"
                      ? "bg-[var(--accent-muted)] text-[var(--accent-primary)] font-medium"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  Square (Instagram)
                </button>
              </div>

              {/* Image preview */}
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Insight card preview"
                  className="w-full h-auto"
                  style={{ aspectRatio: format === "square" ? "1/1" : "1200/630" }}
                />
              </div>

              {/* Share actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  {insightData.headline.length > 60
                    ? insightData.headline.slice(0, 60) + "..."
                    : insightData.headline}
                </span>
                <ShareButton
                  imageUrl={imageUrl}
                  filename={`pelican-insight-${insightData.tickers[0] || "card"}.png`}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
