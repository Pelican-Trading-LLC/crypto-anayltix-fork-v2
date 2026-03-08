'use client'

import Link from 'next/link'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'

export function FinalCTA() {
  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <Section>
        <ScrollReveal>
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#1A6FB5] to-[#25BFDF] bg-clip-text text-transparent">
                Stop translating
                <br />
                crypto yourself.
              </span>
            </h2>

            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
              Join thousands of TradFi traders who use Pelican to navigate crypto
              markets with confidence.
            </p>

            <Link
              href="/auth/signup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#1A6FB5] to-[#25BFDF] hover:opacity-90 text-white font-semibold rounded-xl text-lg shadow-lg shadow-[#1DA1C4]/20 hover:shadow-[#1DA1C4]/30 transition-all duration-300 active:scale-[0.98]"
            >
              Start for Free &rarr;
            </Link>
            <p className="text-sm text-slate-400 mt-3">
              Free tier available. No credit card required. Upgrade anytime.
            </p>
          </div>
        </ScrollReveal>
      </Section>
    </section>
  )
}
