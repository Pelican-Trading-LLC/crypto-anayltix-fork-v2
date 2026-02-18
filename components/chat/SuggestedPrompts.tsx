"use client"

import { motion } from "framer-motion"

const SUGGESTED_PROMPTS = [
  "What are the top gaining stocks today?",
  "Analyze AAPL's technical setup",
  "Why is the market down today?",
]

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 pb-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            onClick={() => !disabled && onSelect(prompt)}
            whileHover={disabled ? undefined : { y: -2 }}
            disabled={disabled}
            className={
              disabled
                ? "p-3 sm:p-4 rounded-xl border border-border/40 bg-card text-left cursor-not-allowed opacity-50"
                : "p-3 sm:p-4 rounded-xl border border-border/40 bg-card hover:border-primary/40 hover:bg-card/80 shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20 transition-all duration-200 text-left cursor-pointer group"
            }
          >
            <span className={
              disabled
                ? "text-sm text-muted-foreground leading-snug"
                : "text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-snug"
            }>
              {prompt}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export { SUGGESTED_PROMPTS }
