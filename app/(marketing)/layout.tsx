import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';

const HelpChat = dynamic(() => import('@/components/marketing/HelpChat'), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tokenanalytix.com'),
  title: 'Token Analytix | AI Market Intelligence for Traders',
  description:
    'The AI trading platform that learns how you trade. Real-time market analysis, trade journaling, AI coaching, and institutional-grade intelligence for stocks, forex, crypto, and futures.',
  icons: {
    icon: '/images/pelican-logo.png',
  },
  openGraph: {
    title: 'Token Analytix — Your AI-Powered Trading Edge',
    description:
      'The AI trading platform that gets smarter every day you use it. Stocks, forex, crypto, and futures.',
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: 'Token Analytix' },
    ],
    type: 'website',
    siteName: 'Token Analytix',
    url: 'https://tokenanalytix.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Analytix',
    description:
      'The AI trading platform that gets smarter every day you use it.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-theme bg-white text-slate-900 min-h-screen antialiased scroll-smooth">
      <LandingNav />
      {children}
      <LandingFooter />
      <HelpChat />
    </div>
  );
}
