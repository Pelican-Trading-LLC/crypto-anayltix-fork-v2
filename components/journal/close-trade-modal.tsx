"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Trade, CloseTradeData } from "@/hooks/use-trades"

interface CloseTradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trade: Trade | null
  onSubmit: (data: CloseTradeData) => Promise<void>
}

export function CloseTradeModal({ open, onOpenChange, trade, onSubmit }: CloseTradeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exitPrice, setExitPrice] = useState("")
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState("")

  if (!trade) return null

  const calculatePnL = () => {
    if (!exitPrice) return null

    const exit = parseFloat(exitPrice)
    const entry = trade.entry_price
    const qty = trade.quantity

    let pnlAmount: number
    let pnlPercent: number

    if (trade.direction === 'long') {
      pnlAmount = (exit - entry) * qty
      pnlPercent = ((exit - entry) / entry) * 100
    } else {
      // Short
      pnlAmount = (entry - exit) * qty
      pnlPercent = ((entry - exit) / entry) * 100
    }

    const rMultiple = trade.stop_loss
      ? pnlAmount / (Math.abs(entry - trade.stop_loss) * qty)
      : null

    return { pnlAmount, pnlPercent, rMultiple }
  }

  const pnl = calculatePnL()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!exitPrice || !exitDate) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        exit_price: parseFloat(exitPrice),
        exit_date: exitDate,
        notes: notes || null,
      })

      // Reset form
      setExitPrice("")
      setExitDate(new Date().toISOString().split('T')[0])
      setNotes("")

      onOpenChange(false)
    } catch (error) {
      console.error('Error closing trade:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Close Trade</DialogTitle>
          <DialogDescription>
            Close {trade.ticker} {trade.direction} position
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Trade Summary */}
          <div className="p-3 rounded-lg bg-white/[0.03] border border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">Entry Price</span>
              <span className="font-mono font-medium text-foreground">
                ${trade.entry_price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">Quantity</span>
              <span className="font-mono font-medium text-foreground">{trade.quantity}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">Direction</span>
              <span
                className={`font-medium uppercase text-xs px-2 py-0.5 rounded ${
                  trade.direction === 'long'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-red-600/20 text-red-400'
                }`}
              >
                {trade.direction}
              </span>
            </div>
          </div>

          {/* Exit Price */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Exit Price <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              step="any"
              min="0"
              required
              autoFocus
              className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 font-mono"
              placeholder="155.00"
            />
          </div>

          {/* Exit Date */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Exit Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>

          {/* P&L Preview */}
          {pnl && (
            <div
              className={`p-3 rounded-lg border ${
                pnl.pnlAmount >= 0
                  ? 'bg-green-600/10 border-green-500/30'
                  : 'bg-red-600/10 border-red-500/30'
              }`}
            >
              <div className="text-xs text-foreground/60 mb-1">Projected P&L</div>
              <div
                className={`text-2xl font-bold font-mono tabular-nums ${
                  pnl.pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {pnl.pnlAmount >= 0 ? '+' : ''}${pnl.pnlAmount.toFixed(2)}
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className={pnl.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {pnl.pnlPercent >= 0 ? '+' : ''}
                  {pnl.pnlPercent.toFixed(2)}%
                </span>
                {pnl.rMultiple !== null && (
                  <span className="text-foreground/60">
                    {pnl.rMultiple.toFixed(2)}R
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Exit Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Exit Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none"
              placeholder="Why did you exit? What did you learn?"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-white/[0.06] border border-border text-foreground hover:bg-white/[0.08] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !exitPrice}
              className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Closing...' : 'Close Trade'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
