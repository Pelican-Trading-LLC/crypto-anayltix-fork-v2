'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useT } from '@/lib/providers/translation-provider'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    stripePriceId: '',
    popular: false,
    cta: 'Start Free',
    features: [
      'Daily market brief',
      '7 education modules',
      'Portfolio dashboard (demo mode)',
      '3 Pelican questions/day',
    ],
  },
  {
    id: 'lite',
    name: 'Lite',
    price: 29,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_lite',
    popular: false,
    cta: 'Start Free',
    features: [
      'Everything in Free',
      'Unlimited Pelican questions',
      'Analyst signal feed',
      'Smart money alerts',
      'Watchlist with alerts',
      'Community access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    popular: true,
    cta: 'Start Free',
    features: [
      'Everything in Lite',
      'Pelican Portal (full conversational AI)',
      'Conversation history',
      'Cross-asset translation feed',
      'CT signal translations',
      'Wallet tracking',
      'Intelligence alerts',
      'Priority support',
    ],
  }
]

export default function PricingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useT()
  const preselectedPlan = searchParams.get('plan')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [pageReady, setPageReady] = useState(false)

  const navLinks = [
    { href: '/#features', label: t.marketing.nav.features },
    { href: '/how-to-use', label: 'How It Works' },
    { href: '/', label: t.marketing.nav.backToHome },
    { href: '/faq', label: t.marketing.nav.faq },
  ]

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setPageReady(true)
    }
    getUser()
  }, [])

  // Auto-select plan if arriving with ?plan= parameter
  useEffect(() => {
    if (preselectedPlan && user && !loadingPlan) {
      const plan = PLANS.find(p => p.id === preselectedPlan)
      if (plan && plan.id !== 'free') {
        setTimeout(() => {
          handleSelectPlan(plan)
        }, 100)
      }
      sessionStorage.removeItem('intended_plan')
    }
  }, [preselectedPlan, user, loadingPlan])

  const handleSelectPlan = async (plan: typeof PLANS[0]) => {
    if (plan.id === 'free') {
      router.push('/auth/signup')
      return
    }

    setLoadingPlan(plan.id)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        sessionStorage.setItem('intended_plan', plan.id)
        window.location.href = '/auth/login?redirect=/pricing'
        return
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId: user.id,
          userEmail: user.email,
          planName: plan.id,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoadingPlan(null)
    }
  }

  if (!pageReady) {
    return (
      <div className="pricing-loading">
        <Loader2 className="pricing-loading-spinner" />
      </div>
    )
  }

  return (
    <>
      <MarketingNav links={navLinks} ctaAction="signup" ctaLabel={t.marketing.nav.getStarted} />

      <section id="main-content" className="pricing-hero">
        <div className="pricing-hero-inner">
          <div className="pricing-nav-links">
            <Link href="/" className="pricing-back-link">
              &larr; {t.marketing.nav.backToHome}
            </Link>
            {user && (
              <Link href="/chat" className="pricing-back-link">
                &larr; Back to chat
              </Link>
            )}
          </div>

          <div className="section-tag">{'// Pricing'}</div>
          <h1 className="pricing-title">
            Simple, <span className="text-glow">Transparent</span> Pricing
          </h1>
          <p className="pricing-subtitle">
            Start free. Upgrade when you&apos;re ready. No credit card required.
          </p>
        </div>
      </section>

      {error && (
        <div className="pricing-error">
          {error}
        </div>
      )}

      <section className="pricing-cards-section">
        <div className="pricing-cards-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card bracket-box ${plan.popular ? 'pricing-card-popular' : ''}`}
            >
              {plan.popular && (
                <div className="pricing-popular-badge">Most Popular</div>
              )}

              <h2 className="pricing-card-name">{plan.name}</h2>

              <div className="pricing-card-price">
                <span className="pricing-card-amount">${plan.price}</span>
                <span className="pricing-card-period">/month</span>
              </div>

              <ul className="pricing-card-bullets">
                {plan.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan !== null}
                className={`pricing-card-cta ${plan.popular ? 'pricing-card-cta-popular' : ''}`}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="pricing-card-cta-spinner" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>{plan.cta}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="pricing-guarantee">
        <ShieldCheck className="pricing-guarantee-icon" />
        <span>Cancel anytime. No contracts, no commitments.</span>
      </div>

      <div className="pricing-footer-notes">
        <p>Free tier available forever. Upgrade or downgrade anytime.</p>
        <p>
          By subscribing, you agree to our{' '}
          <Link href="/terms">Terms of Service</Link>
        </p>
        <p>
          Questions?{' '}
          <a href="mailto:support@cryptoanalytix.com">Contact us</a>
        </p>
      </div>

      <MarketingFooter />
    </>
  )
}
