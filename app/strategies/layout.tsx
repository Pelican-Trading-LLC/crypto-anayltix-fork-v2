import type { Metadata } from 'next'
import { ForceDarkTheme } from '@/components/force-dark-theme'

export const metadata: Metadata = {
  title: 'Strategy Templates',
  description: 'Browse curated and community trading strategies for Pelican Trading AI.',
}

export default function StrategiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <ForceDarkTheme />
      {children}
    </div>
  )
}
