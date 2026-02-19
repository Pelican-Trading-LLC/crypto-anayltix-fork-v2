const CHAT_PREFILL_STORAGE_KEY = 'pelican_chat_prefill'

export function setChatPrefill(value: string): void {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.setItem(CHAT_PREFILL_STORAGE_KEY, value)
  } catch {
    // Ignore storage failures (private mode/quota) without breaking UX.
  }
}

export function getChatPrefill(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const value = sessionStorage.getItem(CHAT_PREFILL_STORAGE_KEY)
    if (value === null) return null

    sessionStorage.removeItem(CHAT_PREFILL_STORAGE_KEY)
    return value
  } catch {
    return null
  }
}
