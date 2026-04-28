import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createUserRateLimiter, rateLimitResponse } from '@/lib/rate-limit'
import { getPlanByPriceId, getPlanCredits, PLAN_CONFIG } from '@/lib/plans'

export const dynamic = 'force-dynamic'

const checkoutLimiter = createUserRateLimiter('stripe-checkout', 5, '1 h')

const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }
  return new Stripe(secretKey, { apiVersion: '2025-12-15.clover' })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { success } = await checkoutLimiter.limit(user.id)
    if (!success) return rateLimitResponse()

    let stripe: Stripe
    try {
      stripe = getStripeClient()
    } catch (error) {
      console.error('Stripe checkout config error:', error)
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const serverPlanName = getPlanByPriceId(priceId)
    if (!serverPlanName || !PLAN_CONFIG[serverPlanName].stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }

    // Derive plan metadata server-side from lib/plans.ts — never trust client-supplied values.
    const planCredits = getPlanCredits(serverPlanName)

    const userEmail = user.email

    let customerId: string | undefined
    
    if (userEmail) {
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      })
      
      if (existingCustomers.data.length > 0 && existingCustomers.data[0]) {
        customerId = existingCustomers.data[0].id
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?subscribed=true&plan=${serverPlanName}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        plan: serverPlanName,
        credits: planCredits.toString()
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan: serverPlanName,
          credits: planCredits.toString()
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      // Stripe Terms of Service consent collection
      consent_collection: {
        terms_of_service: 'required'
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: 'I agree to the [Terms of Service](https://pelican.ai/terms)'
        }
      }
    })

    return NextResponse.json({ url: session.url }, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : error.message },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
