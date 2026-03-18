import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { SuggestedPrompts, SUGGESTED_PROMPTS } from "../SuggestedPrompts"

vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }: PropsWithChildren<Record<string, unknown>>) => {
      void whileHover
      void whileTap
      void initial
      void animate
      void exit
      void transition
      return <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
    },
  },
}))

vi.mock("@/hooks/use-todays-warnings", () => ({
  useTodaysWarnings: () => ({ warnings: [] }),
}))

vi.mock("@/hooks/use-behavioral-insights", () => ({
  useBehavioralInsights: () => ({ data: null }),
}))

vi.mock("@/hooks/use-trades", () => ({
  useTrades: () => ({ trades: [], openTrades: [], closedTrades: [] }),
}))

vi.mock("@/hooks/use-trader-profile", () => ({
  useTraderProfile: () => ({ survey: null }),
}))

vi.mock("@/hooks/use-trade-patterns", () => ({
  useTradePatterns: () => ({ patterns: [] }),
}))

vi.mock("@/lib/tracking", () => ({
  trackEvent: vi.fn(),
}))

describe("SuggestedPrompts", () => {
  it("renders default prompts when no personalization data", () => {
    render(<SuggestedPrompts onSelect={vi.fn()} />)
    // Should render market-default prompts (fallback path)
    for (const prompt of SUGGESTED_PROMPTS) {
      expect(screen.getByText(prompt)).toBeInTheDocument()
    }
  })

  it("calls onSelect with correct text when clicked", () => {
    const onSelect = vi.fn()
    render(<SuggestedPrompts onSelect={onSelect} />)

    const firstPrompt = SUGGESTED_PROMPTS[0]!
    const thirdPrompt = SUGGESTED_PROMPTS[2]!

    fireEvent.click(screen.getByText(firstPrompt))
    expect(onSelect).toHaveBeenCalledWith(firstPrompt)

    fireEvent.click(screen.getByText(thirdPrompt))
    expect(onSelect).toHaveBeenCalledWith(thirdPrompt)

    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it("renders with flex layout classes", () => {
    const { container } = render(<SuggestedPrompts onSelect={vi.fn()} />)
    const wrapper = container.firstElementChild
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.className).toContain("flex")
    expect(wrapper?.className).toContain("flex-wrap")
  })

  it("does not call onSelect when disabled", () => {
    const onSelect = vi.fn()
    render(<SuggestedPrompts onSelect={onSelect} disabled />)

    const firstPrompt = SUGGESTED_PROMPTS[0]!
    fireEvent.click(screen.getByText(firstPrompt))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
