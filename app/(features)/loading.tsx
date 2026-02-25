export default function FeatureLoading() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: '#161616' }}
    >
      <div className="animate-pulse p-6 lg:p-8 space-y-4 max-w-[1600px] mx-auto">
        {/* Title */}
        <div className="h-8 w-48 rounded-lg" style={{ backgroundColor: '#222222' }} />
        {/* Subtitle */}
        <div className="h-4 w-80 rounded" style={{ backgroundColor: '#222222' }} />
        {/* Controls bar */}
        <div className="h-10 w-64 rounded-lg mt-6" style={{ backgroundColor: '#222222' }} />
        {/* Main content area */}
        <div className="h-[60vh] w-full rounded-xl mt-4" style={{ backgroundColor: '#1e1e1e' }} />
      </div>
    </div>
  )
}
