'use client'

import { useState } from 'react'
import { Settings, Loader2, ExternalLink } from 'lucide-react'

interface ManageSubscriptionButtonProps {
  className?: string
  variant?: 'default' | 'link'
}

export function ManageSubscriptionButton({
  className = '',
  variant = 'default'
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to open billing portal')
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleManageSubscription}
        disabled={loading}
        className={`text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 flex items-center gap-1 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <ExternalLink className="w-3 h-3" />
        )}
        <span>Manage subscription</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleManageSubscription}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Settings className="w-4 h-4" />
      )}
      <span>Manage Subscription</span>
    </button>
  )
}
