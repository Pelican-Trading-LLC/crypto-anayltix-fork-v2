export default function SettingsLoading() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#161616' }}>
      {/* Sidebar skeleton */}
      <div
        className="hidden md:block w-64 border-r p-6 space-y-4"
        style={{ borderColor: '#2a2a2a' }}
      >
        <div className="h-8 w-32 rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
          <div className="h-10 w-32 rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-6 space-y-4"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }}
          >
            <div className="h-6 w-48 rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
            <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
            <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
            <div className="h-10 w-full rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
