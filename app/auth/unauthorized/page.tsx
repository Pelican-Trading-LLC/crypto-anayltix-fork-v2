'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UnauthorizedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <div className="max-w-md text-center px-6">
        <div className="text-6xl mb-6">🦩</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-400 mb-8">
          This environment is restricted to the Pelican founding team.
          If you believe you should have access, contact nick@pelicantrading.ai.
        </p>
        <button
          onClick={handleSignOut}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
