import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strategy Templates',
  description: 'Browse curated and community trading strategies for Crypto Analytix.',
}

export default function StrategiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
