export default function ChatLoading() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#161616' }}>
      <div
        className="hidden md:block w-64 border-r"
        style={{ backgroundColor: '#1e1e1e', borderColor: '#2a2a2a' }}
      />
      <div className="flex-1" />
    </div>
  )
}
