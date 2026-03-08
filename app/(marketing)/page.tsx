import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const LandingPageClient = dynamic(
  () => import('@/components/landing/landing-page-client'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: {
    absolute: 'Crypto Analytix — Your AI-Powered Trading Edge',
  },
  description:
    'Institutional-grade market analysis, personalized trade coaching, and a platform that learns how you trade. Built for stocks, forex, crypto, and futures.',
  alternates: {
    canonical: '/',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Crypto Analytix',
  url: 'https://cryptoanalytix.com',
  logo: 'https://cryptoanalytix.com/ca-logo.svg',
  description:
    'AI-powered trading intelligence platform for traders of all levels.',
  foundingDate: '2025',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@cryptoanalytix.com',
    contactType: 'customer support',
  },
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Crypto Analytix',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'AI-powered trading platform with real-time market analysis, trade journaling, AI coaching, and institutional-grade intelligence.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '29',
    highPrice: '249',
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
