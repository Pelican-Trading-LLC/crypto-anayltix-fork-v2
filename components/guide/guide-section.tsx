import Link from "next/link"

interface GuideSectionProps {
  id: string
  title: string
  hook: string
  children: React.ReactNode
  cta?: { label: string; href: string }
}

export function GuideSection({ id, title, hook, children, cta }: GuideSectionProps) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
      <p className="text-[var(--text-secondary)] mt-2 text-base italic">{hook}</p>
      <div className="mt-6 space-y-4 text-[var(--text-primary)] leading-relaxed">
        {children}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex bg-[var(--accent-primary)] text-white rounded-lg px-6 py-3 mt-6 font-medium hover:opacity-90 transition-opacity"
        >
          {cta.label}
        </Link>
      )}
    </section>
  )
}
