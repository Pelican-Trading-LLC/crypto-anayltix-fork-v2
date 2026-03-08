interface PromptExampleProps {
  bad: string
  good: string
}

export function PromptExample({ bad, good }: PromptExampleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[rgba(239,68,68,0.05)] border-l-2 border-[var(--data-negative)] rounded-r-lg p-4">
        <p className="text-xs font-medium text-[var(--data-negative)] mb-2">Too vague</p>
        <p className="font-mono text-sm text-[var(--text-primary)]">{bad}</p>
      </div>
      <div className="bg-[rgba(29,161,196,0.05)] border-l-2 border-[var(--accent-primary)] rounded-r-lg p-4">
        <p className="text-xs font-medium text-[var(--accent-primary)] mb-2">Specific &amp; actionable</p>
        <p className="font-mono text-sm text-[var(--text-primary)]">{good}</p>
      </div>
    </div>
  )
}
