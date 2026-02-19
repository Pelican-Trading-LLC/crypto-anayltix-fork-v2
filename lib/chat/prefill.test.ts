import { describe, it, expect, beforeEach } from 'vitest'
import { setChatPrefill, getChatPrefill } from './prefill'

describe('chat prefill session storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('set and consume works', () => {
    setChatPrefill('Analyze AAPL momentum setup')

    const consumed = getChatPrefill()
    expect(consumed).toBe('Analyze AAPL momentum setup')
  })

  it('consumed prefill returns null on second read', () => {
    setChatPrefill('Scan TSLA trade')

    const first = getChatPrefill()
    const second = getChatPrefill()

    expect(first).toBe('Scan TSLA trade')
    expect(second).toBeNull()
  })

  it('rapid overwrites keep the latest value', () => {
    setChatPrefill('First prefill')
    setChatPrefill('Second prefill')
    setChatPrefill('Final prefill')

    const consumed = getChatPrefill()
    expect(consumed).toBe('Final prefill')
  })
})
