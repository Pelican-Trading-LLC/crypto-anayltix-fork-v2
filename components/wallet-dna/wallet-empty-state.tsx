'use client'

import { Bird, Crosshair, Skull, Parachute, Diamond } from '@phosphor-icons/react'
import { FEATURED_WALLETS } from '@/lib/crypto-mock-data'

const ICONS = [Crosshair, Skull, Parachute, Diamond]

interface Props {
  onSelectWallet: (address: string) => void
}

export function WalletEmptyState({ onSelectWallet }: Props) {
  return (
    <div className="max-w-[800px] mx-auto text-center py-8">
      <Bird size={56} weight="thin" className="mx-auto mb-4 text-[#4A90C4]/40" />
      <h2 className="text-lg font-semibold mb-2">Enter a wallet address to analyze</h2>
      <p className="text-sm text-muted-foreground mb-8">Get behavioral archetypes, MEV losses, and airdrop eligibility in one view.</p>

      {/* Featured Wallets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {FEATURED_WALLETS.map((fw, i) => {
          const Icon = ICONS[i]!
          return (
            <button key={fw.address} onClick={() => onSelectWallet(fw.address)}
              className="rounded-xl border bg-card p-4 hover:border-[#4A90C4]/30 hover:translate-y-[-1px] transition-all text-left cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#4A90C4]/10 flex items-center justify-center">
                  <Icon size={16} className="text-[#4A90C4]" />
                </div>
                <div>
                  <span className="text-[12px] text-muted-foreground">{fw.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium group-hover:text-[#4A90C4] transition-colors">{fw.archetype}</span>
                    <span className="font-mono text-[11px] text-[#4A90C4]">{fw.stat}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
