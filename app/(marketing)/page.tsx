import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const LandingPageClient = dynamic(
  () => import('@/components/landing/landing-page-client'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: {
    absolute: 'Token Analytix — AI-Powered Crypto Intelligence for Real Traders',
  },
  description:
    'The crypto intelligence platform built for TradFi traders. Pelican AI translates funding rates, on-chain data, and derivatives into the language you already know.',
  alternates: {
    canonical: '/',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Token Analytix',
  url: 'https://tokenanalytix.com',
  description:
    'AI-powered crypto intelligence platform for traditional finance traders.',
  foundingDate: '2026',
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Token Analytix',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'AI-powered crypto intelligence platform with Pelican AI, analyst signal feeds, education modules, and exchange integration for TradFi traders entering crypto.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '99',
    priceCurrency: 'USD',
    offerCount: 3,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <LandingPageClient />
    </>
  );
}
