'use client'

import { ArrowSquareOut, ChatCircle, ShareNetwork } from '@phosphor-icons/react'

export default function CommunityPage() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto text-center">
      <ChatCircle size={48} weight="thin" className="mx-auto mb-4 text-[#4A90C4]" />
      <h1 className="text-xl font-semibold mb-2">Community</h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Join the ForexAnalytix community to discuss markets, share Pelican insights, and connect with traders transitioning into crypto.
      </p>
      <a href="https://www.forexanalytix.com/community" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-medium transition-all hover:brightness-110"
        style={{ background: 'linear-gradient(135deg, #2C5F8A, #5B4F8A)', boxShadow: '0 2px 8px rgba(74,144,196,0.2)' }}>
        Open ForexAnalytix Chat <ArrowSquareOut size={16} />
      </a>
      <div className="mt-12 rounded-xl border bg-card p-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <ShareNetwork size={16} className="text-[#4A90C4]" />
          <h2 className="text-sm font-semibold">Share Pelican Insights</h2>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          When Pelican gives you a useful analysis, click &ldquo;Share&rdquo; on any response to copy a formatted insight. Paste it in the community chat to share with other traders. Up to 3 insights per day.
        </p>
      </div>
    </div>
  )
}
