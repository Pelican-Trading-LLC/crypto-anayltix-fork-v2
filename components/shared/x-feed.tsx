'use client'

/* ------------------------------------------------------------------ */
/*  XPost interface                                                    */
/* ------------------------------------------------------------------ */
interface XPost {
  handle: string
  displayName: string
  verified: boolean
  profileHue: number
  text: string
  likes: number
  retweets: number
  replies: number
  time: string
  tweetUrl: string
}

/* ------------------------------------------------------------------ */
/*  Mock data – 10 tweets                                              */
/* ------------------------------------------------------------------ */
const X_FEED: XPost[] = [
  {
    handle: '@CryptoHayes',
    displayName: 'Arthur Hayes',
    verified: true,
    profileHue: 200,
    text: 'ETH is cooked below 2.2k. Funding negative, OI dropping, no bid. Next stop 1.8k. The merge narrative is dead, L2s are cannibalizing the base layer. Only saving grace is the ETF flows.',
    likes: 4821,
    retweets: 1247,
    replies: 892,
    time: '12m ago',
    tweetUrl: 'https://x.com/CryptoHayes/status/1903847261',
  },
  {
    handle: '@Pentosh1',
    displayName: 'Pentoshi',
    verified: true,
    profileHue: 120,
    text: 'BTC weekly close above 84k and we are going to 95k minimum. The chart is screaming breakout. Every dip buyer from 78k is in profit. Short sellers running out of ammo.',
    likes: 3215,
    retweets: 834,
    replies: 421,
    time: '28m ago',
    tweetUrl: 'https://x.com/Pentosh1/status/1903842819',
  },
  {
    handle: '@HsakaTrades',
    displayName: 'Hsaka',
    verified: true,
    profileHue: 280,
    text: 'SOL/ETH ratio at ATH. People sleeping on this. The flippening isn\'t ETH flipping BTC, it\'s SOL flipping ETH. DeFi activity, NFTs, memecoins \u2014 all migrated. Devs follow users.',
    likes: 5102,
    retweets: 1563,
    replies: 734,
    time: '45m ago',
    tweetUrl: 'https://x.com/HsakaTrades',
  },
  {
    handle: '@GCRClassic',
    displayName: 'GCR',
    verified: true,
    profileHue: 45,
    text: 'Everyone is bullish again. You know what that means. The crowd is never right at the extremes. I\'m not saying short here, but I am saying this is where you reduce risk, not add it.',
    likes: 8934,
    retweets: 2871,
    replies: 1205,
    time: '1h ago',
    tweetUrl: 'https://x.com/GCRClassic',
  },
  {
    handle: '@inversebrah',
    displayName: 'inversebrah',
    verified: false,
    profileHue: 340,
    text: 'just watched a $2M market buy on JUP. someone knows something. or they\'re just degen. either way i\'m following that wallet.',
    likes: 1247,
    retweets: 312,
    replies: 198,
    time: '2h ago',
    tweetUrl: 'https://x.com/inversebrah',
  },
  {
    handle: '@EmperorBTC',
    displayName: 'Emperor',
    verified: true,
    profileHue: 30,
    text: 'Thread on why BTC mining difficulty ATH is actually bullish: miners are investing BILLIONS in infrastructure post-halving. They wouldn\'t do that if they expected sub-$60k prices. Follow the capex.',
    likes: 6218,
    retweets: 2104,
    replies: 567,
    time: '2h ago',
    tweetUrl: 'https://x.com/EmperorBTC',
  },
  {
    handle: '@MustStopMurad',
    displayName: 'Murad',
    verified: true,
    profileHue: 160,
    text: 'Memecoins are not going away. They are the native financial product of the internet generation. Every cycle people call the top on memes. Every cycle memes outperform "fundamentals." Cope.',
    likes: 7432,
    retweets: 2891,
    replies: 1834,
    time: '3h ago',
    tweetUrl: 'https://x.com/MustStopMurad',
  },
  {
    handle: '@Rewkang',
    displayName: 'Andrew Kang',
    verified: false,
    profileHue: 90,
    text: 'The Solana phone meta is underrated. 150k devices in the wild, each one a crypto-native distribution channel. When the next airdrop hits Saga holders, the FOMO will be insane.',
    likes: 2104,
    retweets: 612,
    replies: 341,
    time: '4h ago',
    tweetUrl: 'https://x.com/Rewkang',
  },
  {
    handle: '@CryptoKaleo',
    displayName: 'Kaleo',
    verified: true,
    profileHue: 260,
    text: 'SPX bull flag breakout confirmed. BTC-SPX correlation at 0.72. As long as equities hold, crypto has a tailwind. Don\'t overthink it.',
    likes: 3891,
    retweets: 1023,
    replies: 456,
    time: '5h ago',
    tweetUrl: 'https://x.com/CryptoKaleo',
  },
  {
    handle: '@zaborack',
    displayName: 'Nick Groves',
    verified: true,
    profileHue: 190,
    text: '$57M in volume on a single Polymarket contract. 80% probability marked the bottom. 20% marked the top. This is prediction market data as a leading indicator. No code. No bot. Just a chart any trader can read.',
    likes: 2567,
    retweets: 891,
    replies: 312,
    time: '6h ago',
    tweetUrl: 'https://x.com/zaborack',
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatEngagement(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

/** Render tweet text with $TICKER highlights */
function renderText(text: string) {
  const parts = text.split(/(\$[A-Za-z]+)/g)
  return parts.map((part, i) =>
    part.startsWith('$') ? (
      <span key={i} style={{ color: 'var(--accent-primary, #4A90C4)' }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */
function VerifiedIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx={7} cy={7} r={7} fill="#3B82F6" />
      <path
        d="M4.5 7.2L6.2 8.9L9.5 5.5"
        stroke="#fff"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReplyIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function RetweetIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  )
}

function LikeIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1={10} y1={14} x2={21} y2={3} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  XFeed component                                                    */
/* ------------------------------------------------------------------ */
export function XFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {X_FEED.map((post, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            gap: 10,
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
            transition: 'background 0.15s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.background =
              'var(--bg-surface-3, rgba(255,255,255,0.03))'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              minWidth: 28,
              borderRadius: '50%',
              background: `hsl(${post.profileHue}, 30%, 20%)`,
              border: `1px solid hsl(${post.profileHue}, 25%, 30%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: `hsl(${post.profileHue}, 40%, 60%)`,
              flexShrink: 0,
            }}
          >
            {post.displayName.charAt(0)}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--text-primary, #e8e8ed)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {post.displayName}
              </span>

              {post.verified && <VerifiedIcon />}

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--text-tertiary, #5a5a6e)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {post.handle}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-quaternary, #3a3a4a)',
                }}
              >
                &middot;
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--text-quaternary, #3a3a4a)',
                  whiteSpace: 'nowrap',
                }}
              >
                {post.time}
              </span>

              <div style={{ flex: 1 }} />

              <a
                href={post.tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  color: 'var(--text-quaternary, #3a3a4a)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color =
                    'var(--accent-primary, #4A90C4)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color =
                    'var(--text-quaternary, #3a3a4a)'
                }}
              >
                <ExternalLinkIcon />
              </a>
            </div>

            {/* Tweet text */}
            <p
              style={{
                fontSize: 12.5,
                lineHeight: 1.45,
                color: 'var(--text-secondary, #9898a6)',
                margin: '0 0 6px 0',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {renderText(post.text)}
            </p>

            {/* Engagement row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontSize: 10,
                color: 'var(--text-quaternary, #3a3a4a)',
                opacity: 0.6,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <ReplyIcon />
                {formatEngagement(post.replies)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <RetweetIcon />
                {formatEngagement(post.retweets)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <LikeIcon />
                {formatEngagement(post.likes)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
