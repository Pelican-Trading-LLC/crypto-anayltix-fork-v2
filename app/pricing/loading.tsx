export default function PricingLoading() {
  return (
    <div className="min-h-[100svh] py-12" style={{ backgroundColor: '#161616' }}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-12 space-y-4">
          <div className="h-4 w-24 mx-auto rounded animate-pulse" style={{ backgroundColor: '#1e1e1e' }} />
          <div className="h-10 w-80 mx-auto rounded-lg animate-pulse" style={{ backgroundColor: '#1e1e1e' }} />
          <div className="h-5 w-64 mx-auto rounded animate-pulse" style={{ backgroundColor: '#1e1e1e' }} />
        </div>

        {/* Plan cards skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-6 space-y-4"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}
            >
              <div className="h-7 w-20 rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
              <div className="h-10 w-28 rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
              <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
              <div className="space-y-2 pt-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
                ))}
              </div>
              <div className="h-12 w-full rounded-lg animate-pulse mt-4" style={{ backgroundColor: '#222222' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
