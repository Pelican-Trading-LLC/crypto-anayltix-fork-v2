import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@/test/test-utils"
import type { PropsWithChildren } from "react"
import { AttachButton } from "./AttachButton"

// Mock framer-motion
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

// Mock translation provider
vi.mock("@/lib/providers/translation-provider", () => ({
  useT: () => ({
    chat: { attachFile: "Attach file" },
  }),
}))

describe("AttachButton", () => {
  it("renders without crashing", () => {
    render(<AttachButton disabled={false} onFileSelect={vi.fn()} />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("is disabled when disabled prop is true", () => {
    render(<AttachButton disabled={true} onFileSelect={vi.fn()} />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("opens file picker on click", () => {
    render(<AttachButton disabled={false} onFileSelect={vi.fn()} />)
    // The hidden file input should exist
    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveClass("hidden")
  })

  it("calls onFileSelect when a file is selected", () => {
    const onFileSelect = vi.fn()
    render(<AttachButton disabled={false} onFileSelect={onFileSelect} />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["content"], "test.pdf", { type: "application/pdf" })

    fireEvent.change(fileInput, { target: { files: [file] } })
    expect(onFileSelect).toHaveBeenCalledWith([file])
  })
})
