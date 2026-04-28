import type { Metadata } from 'next'
import PricingPageContent from '@/components/pricing/PricingPageContent'
import { PLAN_CONFIG } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Pricing | Token Analytix — AI-Powered Crypto Intelligence Plans',
  description: `${PLAN_CONFIG.none.label}, ${PLAN_CONFIG.starter.label} ($${PLAN_CONFIG.starter.price}/mo), ${PLAN_CONFIG.pro.label} ($${PLAN_CONFIG.pro.price}/mo), and ${PLAN_CONFIG.power.label} ($${PLAN_CONFIG.power.price}/mo) plans. The crypto intelligence platform built for TradFi traders.`,
  alternates: {
    canonical: 'https://tokenanalytix.com/pricing',
  },
}

const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Token Analytix',
  description: 'AI-powered crypto intelligence platform for traditional finance traders.',
  brand: {
    '@type': 'Organization',
    name: 'Token Analytix',
  },
  offers: [
    {
      '@type': 'Offer',
      name: PLAN_CONFIG.none.label,
      price: String(PLAN_CONFIG.none.price),
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(PLAN_CONFIG.none.price),
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Daily market brief, 7 education modules, portfolio dashboard (demo mode), 3 Pelican questions/day',
    },
    {
      '@type': 'Offer',
      name: PLAN_CONFIG.starter.label,
      price: String(PLAN_CONFIG.starter.price),
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(PLAN_CONFIG.starter.price),
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Unlimited Pelican questions, analyst signal feed, smart money alerts, watchlist with alerts, community access',
    },
    {
      '@type': 'Offer',
      name: PLAN_CONFIG.pro.label,
      price: String(PLAN_CONFIG.pro.price),
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(PLAN_CONFIG.pro.price),
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Pelican Portal, conversation history, CT signal translations, wallet tracking, intelligence alerts, priority support',
    },
    {
      '@type': 'Offer',
      name: PLAN_CONFIG.power.label,
      price: String(PLAN_CONFIG.power.price),
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(PLAN_CONFIG.power.price),
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
      description: 'Higher limits for professional research workflows, 10,000 monthly credits, priority support',
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
