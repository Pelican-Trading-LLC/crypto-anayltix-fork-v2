import type { Metadata } from 'next'
import CorrelationsPageClient from './page.client'

export const metadata: Metadata = {
  title: 'Market Correlations | Crypto Analytix',
  description: 'Cross-asset correlation matrix with real-time regime detection and signal analysis.',
}

export const dynamic = 'force-dynamic'

export default function CorrelationsPage() {
  return <CorrelationsPageClient />
}
