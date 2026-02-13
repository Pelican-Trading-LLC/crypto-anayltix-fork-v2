/**
 * Streaks Hook
 * =============
 *
 * Manages user streaks for Journal and Plan activities.
 * Fetches current streak from user_streaks table.
 * Calls update_streak RPC to increment streaks on page visits.
 *
 * Streak day logic:
 * - Resets at 4:00 PM ET (market close)
 * - Consecutive days increment streak
 * - Missing a day resets to 1
 *
 * @version 1.0.0
 */

"use client"

import useSWR from 'swr'
import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

// =============================================================================
// TYPES
// =============================================================================

export type StreakType = 'journal' | 'plan'

interface StreakData {
  current_streak: number
  best_streak: number
  last_activity_date: string | null
}

interface StreakUpdateResult {
  current_streak: number
  best_streak: number
  is_new: boolean
}

interface UseStreaksReturn {
  journalStreak: number
  journalBestStreak: number
  planStreak: number
  planBestStreak: number
  isLoading: boolean
  error: Error | null
  updateStreak: (streakType: StreakType) => Promise<void>
  refetch: () => void
}

// =============================================================================
// FETCHER
// =============================================================================

async function fetchStreaks(userId: string): Promise<Record<StreakType, StreakData>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user_streaks')
    .select('streak_type, current_streak, best_streak, last_activity_date')
    .eq('user_id', userId)

  if (error) {
    logger.error('[STREAKS] Failed to fetch streaks', error)
    throw new Error('Failed to fetch streaks')
  }

  // Transform array to object keyed by streak_type
  const streaks: Record<StreakType, StreakData> = {
    journal: { current_streak: 0, best_streak: 0, last_activity_date: null },
    plan: { current_streak: 0, best_streak: 0, last_activity_date: null },
  }

  if (data) {
    data.forEach((row) => {
      if (row.streak_type === 'journal' || row.streak_type === 'plan') {
        const streakType = row.streak_type as StreakType
        streaks[streakType] = {
          current_streak: row.current_streak,
          best_streak: row.best_streak,
          last_activity_date: row.last_activity_date,
        }
      }
    })
  }

  return streaks
}

// =============================================================================
// MAIN HOOK
// =============================================================================

export function useStreaks(): UseStreaksReturn {
  // Get current user ID
  const supabase = createClient()
  const { data: user } = useSWR('user', async () => {
    const result = await supabase.auth.getUser()
    return result.data.user
  })

  const userId = user?.id

  // Fetch streaks with SWR
  const { data: streaks, error, mutate, isLoading } = useSWR(
    userId ? ['streaks', userId] : null,
    () => fetchStreaks(userId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute deduping
    }
  )

  // Update streak (call RPC)
  const updateStreak = useCallback(async (streakType: StreakType): Promise<void> => {
    if (!userId) {
      logger.warn('[STREAKS] Cannot update streak - no user ID')
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('update_streak', {
        p_streak_type: streakType,
      })

      if (error) {
        logger.error('[STREAKS] RPC update_streak failed', error)
        throw error
      }

      const result = data as StreakUpdateResult

      logger.info('[STREAKS] Streak updated', {
        streakType,
        currentStreak: result.current_streak,
        bestStreak: result.best_streak,
        isNew: result.is_new,
      })

      // Revalidate cache
      mutate()
    } catch (err) {
      logger.error('[STREAKS] Update streak error', err instanceof Error ? err : undefined)
      throw err
    }
  }, [userId, mutate])

  // Refetch
  const refetch = useCallback(() => {
    mutate()
  }, [mutate])

  return {
    journalStreak: streaks?.journal.current_streak ?? 0,
    journalBestStreak: streaks?.journal.best_streak ?? 0,
    planStreak: streaks?.plan.current_streak ?? 0,
    planBestStreak: streaks?.plan.best_streak ?? 0,
    isLoading,
    error: error as Error | null,
    updateStreak,
    refetch,
  }
}

export default useStreaks
