export default function Loading() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-6 w-48 bg-[var(--bg-elevated)] rounded" />
      <div className="h-4 w-96 bg-[var(--bg-elevated)] rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[1,2,3].map(i => <div key={i} className="h-48 bg-[var(--bg-elevated)] rounded-xl" />)}
      </div>
    </div>
  )
}
