"use client"

import { createClient } from "@/lib/supabase/client"
import { useMemo, useState, useCallback } from "react"
import { useAuth } from "@/lib/providers/auth-provider"

// ============================================================================
// Hook
// ============================================================================

export function useDetectPatterns(): {
  detect: () => Promise<{ patterns_found: number }>
  isDetecting: boolean
} {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()
  const [isDetecting, setIsDetecting] = useState(false)

  const detect = useCallback(async (): Promise<{ patterns_found: number }> => {
    if (!user) {
      throw new Error('You must be logged in to detect patterns')
    }

    setIsDetecting(true)
    try {
      const { data, error } = await supabase.rpc('detect_and_store_patterns', {
        p_user_id: user.id,
      })

      if (error) throw error
      return data as { patterns_found: number }
    } finally {
      setIsDetecting(false)
    }
  }, [supabase, user])

  return {
    detect,
    isDetecting,
  }
}
