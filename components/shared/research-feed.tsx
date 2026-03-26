'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bird } from '@phosphor-icons/react'
import { SourceLogo } from '@/components/shared/source-logo'

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface ResearchArticle {
  source: string
  author: string
  title: string
  summary: string
  body: string
  tokens: string[]
  time: string
  url: string
  readTime: string
}

const SOURCE_COLORS: Record<string, string> = {
  'The Block': '#E94560',
  'Blockworks': '#48CAE4',
  'Messari': '#66BB6A',
  'Delphi Digital': '#BB86FC',
  'Arkham Intel': '#F59E0B',
  'CoinDesk': '#3B82F6',
}

const RESEARCH_FEED: ResearchArticle[] = [
  {
    source: 'The Block',
    author: 'Frank Chaparro',
    title: 'Solana DEX volume surpasses Ethereum for third consecutive week amid memecoin surge',
    summary:
      'Solana-based decentralized exchanges processed $18.2B in volume last week, outpacing Ethereum DEXs by 34%. The surge is driven by continued memecoin trading activity on platforms like Raydium and Jupiter.',
    body: 'Solana\'s decentralized exchange ecosystem has now outpaced Ethereum in weekly trading volume for three consecutive weeks, a streak that underscores the chain\'s growing dominance in spot trading activity.\n\nLast week, Solana DEXs processed $18.2 billion in total volume, compared to Ethereum\'s $13.6 billion. The gap has widened each week, driven primarily by memecoin trading on Raydium and Jupiter. Jupiter alone accounted for $7.8 billion, making it the single largest DEX by volume across all chains.',
    tokens: ['SOL', 'JUP', 'RAY'],
    time: '23m ago',
    url: 'theblock.co/research/solana-dex-volume',
    readTime: '4 min read',
  },
  {
    source: 'Blockworks',
    author: 'Casey Wagner',
    title: 'BlackRock BUIDL fund crosses $2B AUM as institutional demand for tokenized treasuries accelerates',
    summary:
      'BlackRock\'s tokenized US Treasury fund has surpassed $2 billion in assets under management, growing by $200M in the last month alone. The fund yields 4.8% APY with instant on-chain settlement.',
    body: 'BlackRock\'s BUIDL fund \u2014 the largest tokenized money market product in existence \u2014 crossed $2 billion in assets under management this week, cementing its position as the flagship product in the tokenized treasuries market.\n\nThe fund has added approximately $200 million in the last 30 days, a pace of growth that has accelerated since the SEC\'s approval of tokenized stock listings on Nasdaq.',
    tokens: ['ETH', 'USDC'],
    time: '1h ago',
    url: 'blockworks.co/news/blackrock-buidl-2b-aum',
    readTime: '3 min read',
  },
  {
    source: 'Messari',
    author: 'Kunal Goel',
    title: 'Q1 2026 DeFi report: lending protocols see 340% TVL growth driven by restaking narratives',
    summary:
      'DeFi lending TVL has grown from $12B to $52.8B in Q1 2026, with EigenLayer restaking and liquid staking tokens driving the bulk of new deposits.',
    body: 'The DeFi lending sector experienced explosive growth in Q1 2026, with total value locked across major lending protocols growing 340% from $12 billion to $52.8 billion. The growth was concentrated in protocols that integrated restaking mechanisms.\n\nAave maintained its market leadership with $18.4B in TVL, but the fastest growth came from newer protocols like Morpho and Euler v2.',
    tokens: ['ETH', 'AAVE', 'EIGEN'],
    time: '2h ago',
    url: 'messari.io/report/q1-2026-defi-lending',
    readTime: '6 min read',
  },
  {
    source: 'Delphi Digital',
    author: 'Ceteris',
    title: 'Prediction markets reach $4.2B in open interest \u2014 Polymarket dominates with 78% market share',
    summary:
      'Total prediction market open interest has reached $4.2 billion, with Polymarket controlling 78% of the market. Kalshi holds 19.5%, leaving 2.5% to smaller platforms.',
    body: 'The prediction market sector has reached a new milestone with $4.2 billion in total open interest across all platforms, up from $1.1 billion at the start of 2026. Polymarket dominates with $3.28 billion (78% share), followed by Kalshi at $819 million (19.5%).\n\nThe growth has been driven by three factors: the 2024 US election demonstrated prediction markets\' accuracy, regulatory clarity improved, and Polymarket\'s five-minute Bitcoin price betting markets have introduced a derivatives-like product.',
    tokens: ['MATIC'],
    time: '3h ago',
    url: 'members.delphidigital.io/prediction-markets-q1',
    readTime: '5 min read',
  },
  {
    source: 'Arkham Intel',
    author: 'Arkham Research',
    title: 'Whale alert: Jump Trading moves 12,400 ETH ($24.2M) to Binance \u2014 potential distribution event',
    summary:
      'Jump Trading deposited 12,400 ETH to Binance in a single transaction. Historically, Jump exchange deposits have preceded selling within 24-48 hours.',
    body: 'Jump Trading deposited 12,400 ETH ($24.2M) to Binance in a single transaction at 14:32 UTC today. The deposit originated from a known Jump Trading wallet that has been accumulating ETH since December 2025.\n\nArkham\'s on-chain analysis shows that Jump\'s exchange deposit patterns have historically preceded distribution events with approximately 73% accuracy over the trailing 12 months.',
    tokens: ['ETH'],
    time: '4h ago',
    url: 'platform.arkhamintelligence.com/alerts/jump-eth',
    readTime: '2 min read',
  },
  {
    source: 'CoinDesk',
    author: 'Sam Reynolds',
    title: 'Bitcoin mining difficulty hits all-time high as hashrate surges 23% post-halving adjustment',
    summary:
      'Bitcoin mining difficulty reached a new record, indicating miners are investing heavily in infrastructure despite reduced block rewards. Hashrate is up 23% since the April 2024 halving.',
    body: 'Bitcoin\'s mining difficulty adjusted to a new all-time high of 92.67T this week, reflecting a 23% increase in network hashrate since the April 2024 halving event.\n\nPublicly traded miners including Marathon Digital, CleanSpark, and Riot Platforms have collectively deployed over $4 billion in new mining equipment since the halving.',
    tokens: ['BTC'],
    time: '5h ago',
    url: 'coindesk.com/mining/bitcoin-difficulty-ath',
    readTime: '3 min read',
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ResearchFeed() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setExpandedId((prev) => (prev === idx ? null : idx))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {RESEARCH_FEED.map((article, idx) => {
        const isExpanded = expandedId === idx
        const brandColor = SOURCE_COLORS[article.source] ?? 'var(--text-tertiary)'

        return (
          <div
            key={idx}
            style={{
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {/* Collapsed row */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggle(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(idx)
                }
              }}
              style={{
                minHeight: 64,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                background: isExpanded ? 'var(--bg-surface-3)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isExpanded) e.currentTarget.style.background = 'var(--bg-surface-3)'
              }}
              onMouseLeave={(e) => {
                if (!isExpanded) e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Left: Logo */}
              <SourceLogo source={article.source} size={28} />

              {/* Center: Meta + Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Meta row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: brandColor,
                      lineHeight: 1,
                    }}
                  >
                    {article.source}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>&middot;</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--text-tertiary)',
                      lineHeight: 1,
                    }}
                  >
                    {article.author}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>&middot;</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-quaternary)',
                      lineHeight: 1,
                    }}
                  >
                    {article.time}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>&middot;</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--text-quaternary)',
                      lineHeight: 1,
                    }}
                  >
                    {article.readTime}
                  </span>
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.4,
                  }}
                >
                  {article.title}
                </div>
              </div>

              {/* Right: Token pills + Summarize */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {article.tokens.map((token) => (
                  <span
                    key={token}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-surface-3)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 4,
                      padding: '2px 6px',
                      lineHeight: 1.4,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {token}
                  </span>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Summarize action placeholder
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--accent-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 6,
                    transition: 'background 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(74,144,196,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <Bird size={14} weight="bold" />
                  Summarize
                </button>
              </div>
            </div>

            {/* Expanded content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key={`expanded-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '0 12px 14px 52px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12.5,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: '0 0 10px 0',
                      }}
                    >
                      {article.summary}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        textDecoration: 'none',
                        transition: 'opacity 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                    >
                      Read full article &rarr;
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
