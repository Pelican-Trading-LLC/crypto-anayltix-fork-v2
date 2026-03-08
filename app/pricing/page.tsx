import type { Metadata } from 'next'
import PricingPageContent from '@/components/pricing/PricingPageContent'

export const metadata: Metadata = {
  title: 'Pricing | Crypto Analytix — AI-Powered Crypto Intelligence Plans',
  description: 'Free, Lite ($29/mo), and Pro ($99/mo) plans. The crypto intelligence platform built for TradFi traders. Pelican AI, analyst signals, and exchange integration.',
  alternates: {
    canonical: 'https://cryptoanalytix.com/pricing',
  },
}

const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Crypto Analytix',
  description: 'AI-powered crypto intelligence platform for traditional finance traders.',
  brand: {
    '@type': 'Organization',
    name: 'Crypto Analytix',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0',
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Daily market brief, 7 education modules, portfolio dashboard (demo mode), 3 Pelican questions/day',
    },
    {
      '@type': 'Offer',
      name: 'Lite',
      price: '29',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '29',
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Unlimited Pelican questions, analyst signal feed, smart money alerts, watchlist with alerts, community access',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '99',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '99',
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Pelican Portal, conversation history, CT signal translations, wallet tracking, intelligence alerts, priority support',
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingPageContent />
    </>
  )
}
