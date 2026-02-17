'use client'

export default function FeatureError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
