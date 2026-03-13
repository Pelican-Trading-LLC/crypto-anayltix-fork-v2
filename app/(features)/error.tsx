'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FeatureError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Something went wrong
        </h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-md">
          We hit an unexpected error. Try again, or head back to chat.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-colors text-sm font-medium"
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 border border-[var(--border-default)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-lg transition-colors text-sm font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
