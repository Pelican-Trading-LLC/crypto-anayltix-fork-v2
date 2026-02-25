export default function StrategiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8" style={{ backgroundColor: '#161616', minHeight: '100vh' }}>
      <div className="h-10 w-64 rounded-lg animate-pulse mb-2" style={{ backgroundColor: '#1e1e1e' }} />
      <div className="h-5 w-96 rounded-lg animate-pulse mb-8" style={{ backgroundColor: '#1e1e1e' }} />
      <div className="h-12 rounded-xl animate-pulse mb-8" style={{ backgroundColor: '#1e1e1e' }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-56 rounded-xl animate-pulse" style={{ backgroundColor: '#1e1e1e', border: '1px solid #2a2a2a' }} />
        ))}
      </div>
    </div>
  )
}
