import type { Metadata } from 'next';
import { FAQFullPage } from '@/components/landing/faq-full-page';

export const metadata: Metadata = {
  title: 'FAQ | Token Analytix',
  description: 'Frequently asked questions about Token Analytix — AI-powered crypto intelligence for TradFi traders. Learn about Pelican AI, exchange connections, pricing, and more.',
  alternates: {
    canonical: '/faq',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "I've never traded crypto. Is this for me?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes \u2014 that's exactly who we built this for. If you understand TradFi concepts like futures, margin, and carry costs, Pelican will translate every crypto concept into language you already know.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does Pelican AI work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Pelican is a conversational AI that knows your portfolio, understands market data, and speaks the language of a traditional trader. It combines real-time market data with ForexAnalytix analyst content.",
      },
    },
    {
      '@type': 'Question',
      name: 'What exchanges can I connect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support Kraken, Coinbase, Binance, and other major exchanges through SnapTrade. Your API keys are encrypted and we never have withdrawal permissions.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the ForexAnalytix connection?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ForexAnalytix is the largest independent TradFi analyst community with 25,000+ members. Their analysts apply established methodologies like Elliott Wave and harmonic patterns to crypto markets.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All data is encrypted at rest and in transit. Exchange connections use read-only API keys via SnapTrade. We never store your exchange credentials directly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the subscription tiers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three tiers: Free ($0/month) with daily briefs and 3 Pelican questions/day, Lite ($29/month) with unlimited questions and analyst signals, and Pro ($99/month) with full Pelican Portal and priority support.',
      },
    },
  ],
};

export default function FAQ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQFullPage />
    </>
  );
}
