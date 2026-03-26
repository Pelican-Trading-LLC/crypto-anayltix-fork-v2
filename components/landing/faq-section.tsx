'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CaretDown } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'

const faqs = [
  {
    question: "I've never traded crypto. Is this for me?",
    answer:
      "Yes \u2014 that's exactly who we built this for. If you understand TradFi concepts like futures, margin, and carry costs, Pelican will translate every crypto concept into language you already know. Our education modules start from zero and build up.",
  },
  {
    question: 'How does Pelican AI work?',
    answer:
      "Pelican is a conversational AI that knows your portfolio, understands market data, and speaks the language of a traditional trader. Ask it anything \u2014 from 'what are funding rates?' to 'analyze my BTC position relative to the upcoming options expiry.' It combines real-time market data with ForexAnalytix analyst content.",
  },
  {
    question: 'What exchanges can I connect?',
    answer:
      'We support Kraken, Coinbase, Binance, and other major exchanges through SnapTrade. Your API keys are encrypted and we never have withdrawal permissions.',
  },
  {
    question: "What's the ForexAnalytix connection?",
    answer:
      'ForexAnalytix is the largest independent TradFi analyst community with 25,000+ members. Their analysts (Blake Morrow, Grega Horvat, and others) apply established methodologies like Elliott Wave and harmonic patterns to crypto markets. Pelican translates their analysis into actionable crypto intelligence.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. All data is encrypted at rest and in transit. Exchange connections use read-only API keys via SnapTrade (an established fintech provider). We never store your exchange credentials directly.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes. No contracts, no commitments. Cancel from your settings page and you'll revert to the free tier.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section id="faq">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>
      </ScrollReveal>

      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-800 text-left">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 ml-4"
                >
                  <CaretDown weight="bold" className="h-4 w-4 text-slate-400" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4}>
        <div className="text-center mt-8">
          <Link href="/faq" className="text-sm text-[#4A90C4] hover:text-[#2C5F8A] font-medium transition-colors">
            See all FAQs →
          </Link>
        </div>
      </ScrollReveal>
    </Section>
  )
}
