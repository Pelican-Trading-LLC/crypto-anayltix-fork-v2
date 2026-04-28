import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStreamingChat } from './use-streaming-chat'

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  }),
}))

describe('useStreamingChat', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('fires a stream timeout when a response sends one chunk and then goes silent', async () => {
    const encoder = new TextEncoder()
    let streamController: ReadableStreamDefaultController<Uint8Array> | null = null

    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string | URL | Request, init?: RequestInit) => {
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            streamController = controller
            controller.enqueue(encoder.encode('data: {"delta":"hello"}\n\n'))
            init?.signal?.addEventListener('abort', () => {
              controller.error(new DOMException('Aborted', 'AbortError'))
            })
          },
        })

        return Promise.resolve(
          new Response(stream, {
            status: 200,
            headers: { 'Content-Type': 'text/event-stream' },
          })
        )
      })
    )

    const onChunk = vi.fn()
    const onError = vi.fn()
    const { result } = renderHook(() => useStreamingChat())

    let sendPromise: Promise<void>
    act(() => {
      sendPromise = result.current.sendMessage(
        'hello',
        [],
        { onChunk, onError },
        null,
        []
      )
    })

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(onChunk).toHaveBeenCalledWith('hello')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(35_001)
    })

    await sendPromise!

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Stream timeout - no data received' })
    )
    expect(result.current.isStreaming).toBe(false)
    expect(streamController).not.toBeNull()
  })
})
