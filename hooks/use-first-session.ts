"use client"

import { useEffect, useRef } from "react"
import { useIsFirstTimeUser } from "./use-is-first-time-user"
import { useOnboardingProgress } from "./use-onboarding-progress"

/**
 * Auto-sends a welcome message on the user's very first session.
 * Uses useIsFirstTimeUser (conversations query) as the authoritative check
 * so that returning users without an onboarding_progress row are NOT treated
 * as first-time users.
 */
export function useFirstSession(
  sendMessage: ((message: string) => void) | undefined,
  hasMessages: boolean,
) {
  const { isFirstTime, isLoading } = useIsFirstTimeUser()
  const { completeMilestone } = useOnboardingProgress()
  const sentRef = useRef(false)

  useEffect(() => {
    // Wait for data to load, only fire once, only on welcome screen (no messages)
    if (isLoading || sentRef.current || hasMessages || !isFirstTime) return
    if (!sendMessage) return

    sentRef.current = true

    // Small delay so the UI is settled before the message animates in
    const timer = setTimeout(() => {
      sendMessage("Hey Pelican, I'm new here. What can you help me with?")
      // Initialize the row (completing first_message since we just sent one)
      completeMilestone("first_message")
    }, 800)

    return () => clearTimeout(timer)
  }, [isLoading, isFirstTime, hasMessages, sendMessage, completeMilestone])
}
