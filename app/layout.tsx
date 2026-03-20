import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/lib/providers"
import { Suspense } from "react"
import * as Sentry from '@sentry/nextjs'
import SentryErrorBoundary from "@/components/sentry-error-boundary"
import { ReferralCapture } from "@/components/ReferralCapture"
import "./globals.css"

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tokenanalytix.com'),
    title: {
      default: 'Token Analytix',
      template: '%s | Token Analytix',
    },
    description: 'AI-powered crypto intelligence for traditional traders',
    openGraph: {
      title: 'Token Analytix',
      description: 'AI-powered crypto intelligence for traditional traders',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Token Analytix',
      description: 'AI-powered crypto intelligence for traditional traders',
    },
    other: {
      ...Sentry.getTraceData()
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#2e2e2e" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("crypto-analytix-theme")||"dark";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${GeistSans.className} antialiased bg-background ${GeistSans.variable} ${GeistMono.variable}`}>
        <ReferralCapture />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded">Skip to main content</a>
        <SentryErrorBoundary>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Providers>
              <>
                {children}
              </>
            </Providers>
          </Suspense>
        </SentryErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
