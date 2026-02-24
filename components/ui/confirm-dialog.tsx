"use client"

import { useState, useCallback } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  warning?: string
  confirmLabel?: string
  confirmVariant?: "destructive" | "default"
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  warning,
  confirmLabel = "Confirm",
  confirmVariant = "destructive",
  onConfirm,
  isLoading: externalLoading,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const loading = externalLoading ?? internalLoading

  const handleConfirm = useCallback(async () => {
    setInternalLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch {
      // Error handled by caller via toast
    } finally {
      setInternalLoading(false)
    }
  }, [onConfirm, onOpenChange])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[var(--text-primary)]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--text-secondary)] text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
          {warning && (
            <p className="text-xs text-[var(--data-warning)] mt-2 leading-relaxed">
              {warning}
            </p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="bg-transparent border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={loading}
            className={cn(
              "transition-colors",
              confirmVariant === "destructive"
                ? "bg-[var(--data-negative)] text-white hover:bg-[var(--data-negative)]/90"
                : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)]"
            )}
          >
            {loading ? "..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
