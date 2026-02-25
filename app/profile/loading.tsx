export default function ProfileLoading() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#161616' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Avatar + name skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full animate-pulse" style={{ backgroundColor: '#222222' }} />
          <div className="space-y-2">
            <div className="h-6 w-40 rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
            <div className="h-4 w-56 rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
          </div>
        </div>

        {/* Form fields skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded animate-pulse" style={{ backgroundColor: '#222222' }} />
            <div className="h-10 w-full rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
          </div>
        ))}

        <div className="h-10 w-32 rounded-lg animate-pulse" style={{ backgroundColor: '#222222' }} />
      </div>
    </div>
  )
}
