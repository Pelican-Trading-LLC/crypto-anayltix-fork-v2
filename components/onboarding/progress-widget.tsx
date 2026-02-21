"use client"

import { motion } from "framer-motion"
import { useOnboardingProgress } from "@/hooks/use-onboarding-progress"
import { Check, ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface ProgressWidgetProps {
  className?: string
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 20
  const stroke = 3
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={radius * 2} height={radius * 2} className="shrink-0">
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <text
        x={radius}
        y={radius}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[9px] font-mono font-semibold fill-[var(--text-primary)]"
      >
        {progress}%
      </text>
    </svg>
  )
}

export function ProgressWidget({ className }: ProgressWidgetProps) {
  const { milestones, completed, progress, nextMilestone, dismiss, dismissed, isLoading } =
    useOnboardingProgress()

  if (isLoading || dismissed || progress >= 100) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "w-full max-w-sm mx-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <ProgressRing progress={progress} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)]">Getting started</p>
          <p className="text-xs text-[var(--text-muted)]">
            <span className="font-mono tabular-nums">{completed.length}</span> of{" "}
            <span className="font-mono tabular-nums">{milestones.length}</span> completed
          </p>
        </div>
      </div>

      {/* Milestone list */}
      <div className="space-y-1.5 mb-3">
        {milestones.slice(0, 5).map((m) => {
          const done = completed.includes(m.key)
          const isNext = nextMilestone?.key === m.key
          return (
            <div
              key={m.key}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                done
                  ? "text-[var(--text-muted)]"
                  : isNext
                    ? "text-[var(--text-primary)] bg-[var(--accent-muted)]"
                    : "text-[var(--text-secondary)]",
              )}
            >
              {done ? (
                <Check size={14} weight="bold" className="text-[var(--data-positive)] shrink-0" />
              ) : isNext ? (
                <ArrowRight size={14} weight="bold" className="text-[var(--accent-primary)] shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-[var(--border-default)] shrink-0" />
              )}
              <span className={cn(done && "line-through")}>{m.label}</span>
            </div>
          )
        })}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        Dismiss
      </button>
    </motion.div>
  )
}
