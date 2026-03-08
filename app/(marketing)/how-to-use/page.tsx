import type { Metadata } from 'next';
import { HowToUsePage } from '@/components/landing/how-to-use-page';

export const metadata: Metadata = {
  title: 'Getting Started | Crypto Analytix — AI Crypto Intelligence Platform',
  description: 'Learn how to use Crypto Analytix: connect your exchange, explore your dashboard, ask Pelican AI anything, follow analyst signals, and complete the TradFi-to-crypto education.',
  alternates: {
    canonical: '/how-to-use',
  },
};

export default function HowToUse() {
  return <HowToUsePage />;
}
