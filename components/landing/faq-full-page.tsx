'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CaretDown } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/landing/section'
import { ScrollReveal } from '@/components/landing/scroll-reveal'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: 'About Token Analytix',
    items: [
      {
        question: 'What is Token Analytix?',
        answer: 'Token Analytix is an AI-powered crypto intelligence platform built specifically for traditional finance (TradFi) traders entering crypto. Pelican AI translates funding rates, on-chain data, derivatives, and crypto-native signals into the language you already know from stocks, forex, and futures.',
      },
      {
        question: "I've never traded crypto. Is this for me?",
        answer: "Yes \u2014 that's exactly who we built this for. If you understand TradFi concepts like futures, margin, and carry costs, Pelican will translate every crypto concept into language you already know. Our education modules start from zero and build up.",
      },
      {
        question: 'How does Pelican AI work?',
        answer: "Pelican is a conversational AI that knows your portfolio, understands market data, and speaks the language of a traditional trader. Ask it anything \u2014 from 'what are funding rates?' to 'analyze my BTC position relative to the upcoming options expiry.' It combines real-time market data with ForexAnalytix analyst content.",
      },
      {
        question: 'What is the current status of Token Analytix?',
        answer: 'Token Analytix is currently in Beta. You can sign up at tokenanalytix.com to get early access and help shape the future of the platform.',
      },
    ],
  },
  {
    title: 'Features',
    items: [
      {
        question: 'What can I ask Pelican?',
        answer: 'Anything crypto. Examples: "What are funding rates and why do they matter?", "Analyze my ETH position", "What does the DXY move mean for crypto?", "Translate this CT thread into something I understand", "What are the whale wallets doing with BTC right now?" Pelican combines real-time market data with analyst intelligence to give you actionable answers.',
      },
      {
        question: 'What is the education system?',
        answer: "7 structured modules that bridge TradFi concepts to crypto. Each module translates something you already know (like futures basis) into the crypto equivalent (funding rates). Designed for traders, not beginners \u2014 no 'what is Bitcoin' basics.",
      },
      {
        question: 'What are CT signal translations?',
        answer: "Crypto Twitter (CT) is full of alpha, but the language is opaque if you come from TradFi. Pelican monitors key CT accounts and translates their signals into structured analysis you can actually use \u2014 with context on why it matters and how it relates to your positions.",
      },
      {
        question: 'What is the analyst signal feed?',
        answer: "ForexAnalytix analysts (Blake Morrow, Grega Horvat, and others) apply established methodologies like Elliott Wave and harmonic patterns to crypto markets. The signal feed delivers their analysis in real-time, translated into actionable crypto intelligence.",
      },
    ],
  },
  {
    title: 'Exchanges & Data',
    items: [
      {
        question: 'What exchanges can I connect?',
        answer: 'We support Kraken, Coinbase, Binance, and other major exchanges through SnapTrade. Your API keys are encrypted and we never have withdrawal permissions.',
      },
      {
        question: 'What crypto assets are covered?',
        answer: 'Pelican covers all major cryptocurrencies including BTC, ETH, SOL, and hundreds of altcoins. We provide spot prices, derivatives data, funding rates, open interest, and on-chain metrics.',
      },
      {
        question: 'Is the data real-time?',
        answer: 'Yes. Pelican provides real-time market data including prices, funding rates, open interest, and on-chain activity. Analyst signals and CT translations are delivered as they happen.',
      },
    ],
  },
  {
    title: 'ForexAnalytix Partnership',
    items: [
      {
        question: "What's the ForexAnalytix connection?",
        answer: 'ForexAnalytix is the largest independent TradFi analyst community with 25,000+ members. Their analysts (Blake Morrow, Grega Horvat, and others) apply established methodologies like Elliott Wave and harmonic patterns to crypto markets. Pelican translates their analysis into actionable crypto intelligence.',
      },
      {
        question: 'Who are the analysts?',
        answer: 'The ForexAnalytix team includes experienced TradFi analysts who have expanded their coverage to crypto. They bring decades of experience in technical analysis, macro research, and risk management \u2014 applied to digital assets.',
      },
    ],
  },
  {
    title: 'Pricing',
    items: [
      {
        question: 'What are the subscription tiers?',
        answer: 'Three tiers: Free ($0/month) with daily briefs, education modules, and 3 Pelican questions/day. Lite ($29/month) adds unlimited questions, analyst signals, smart money alerts, and community access. Pro ($99/month) adds Pelican Portal, conversation history, CT translations, wallet tracking, and priority support.',
      },
      {
        question: 'Is there a free tier?',
        answer: "Yes. The free tier includes daily market briefs, 7 education modules, a portfolio dashboard in demo mode, and 3 Pelican questions per day. No credit card required.",
      },
      {
        question: 'Can I cancel anytime?',
        answer: "Yes. No contracts, no commitments. Cancel from your settings page and you'll revert to the free tier.",
      },
    ],
  },
  {
    title: 'Security',
    items: [
      {
        question: 'Is my data safe?',
        answer: 'Yes. All data is encrypted at rest and in transit. Exchange connections use read-only API keys via SnapTrade (an established fintech provider). We never store your exchange credentials directly.',
      },
      {
        question: 'Can Token Analytix withdraw my funds?',
        answer: 'No. Exchange connections are read-only through SnapTrade. We never request withdrawal permissions. Your funds remain fully under your control at all times.',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        question: 'How do I get help?',
        answer: 'You can use the chat widget on this site for quick questions about Token Analytix. For account issues, billing questions, bug reports, or anything else, email us at support@tokenanalytix.com.',
      },
      {
        question: 'What if I have a billing or account issue?',
        answer: 'For billing questions, payment issues, account access problems, or refund requests, please email support@tokenanalytix.com and our team will help you directly.',
      },
      {
        question: 'How do I report a bug?',
        answer: 'If you encounter a bug or technical issue with the platform, email support@tokenanalytix.com with details about what happened. Screenshots and steps to reproduce are always helpful!',
      },
    ],
  },
]

export function FAQFullPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <main className="pt-24 pb-16 overflow-x-hidden">
      <Section>
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Everything you need to know about Token Analytix.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-10">
          {faqData.map((category, catIndex) => (
            <ScrollReveal key={catIndex} delay={catIndex * 0.05}>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {category.title}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => {
                    const key = `${catIndex}-${itemIndex}`
                    const isOpen = openItems.has(key)

                    return (
                      <div
                        key={key}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-medium text-slate-800 text-left">
                            {item.question}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0 ml-4"
                          >
                            <CaretDown
                              weight="bold"
                              className="h-4 w-4 text-slate-400"
                            />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-16 text-center max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Our team is here to help. Reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:support@tokenanalytix.com"
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Email Support
              </a>
              <Link
                href="/auth/signup"
                className="rounded-xl bg-gradient-to-r from-[#2C5F8A] to-[#5BA3D9] px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-colors"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </Section>
    </main>
  )
}
