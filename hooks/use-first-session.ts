"use client"

import { useEffect, useRef } from "react"
import { useOnboardingProgress } from "./use-onboarding-progress"

/**
 * Auto-sends a welcome message on the user's very first session.
 * Also initializes the onboarding_progress row.
 */
export function useFirstSession(
  sendMessage: ((message: string) => void) | undefined,
  hasMessages: boolean,
) {
  const { isFirstSession, completeMilestone, isLoading } = useOnboardingProgress()
  const sentRef = useRef(false)

  useEffect(() => {
    // Wait for data to load, only fire once, only on welcome screen (no messages)
    if (isLoading || sentRef.current || hasMessages || !isFirstSession) return
    if (!sendMessage) return

    sentRef.current = true

    // Small delay so the UI is settled before the message animates in
    const timer = setTimeout(() => {
      sendMessage("Hey Pelican, I'm new here. What can you help me with?")
      // Initialize the row (completing first_message since we just sent one)
      completeMilestone("first_message")
    }, 800)

    return () => clearTimeout(timer)
  }, [isLoading, isFirstSession, hasMessages, sendMessage, completeMilestone])
}
