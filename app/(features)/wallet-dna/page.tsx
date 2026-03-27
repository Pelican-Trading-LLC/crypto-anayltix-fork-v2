'use client'

import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { WalletEmptyState } from '@/components/wallet-dna/wallet-empty-state'
import { WalletAnalysis } from '@/components/wallet-dna/wallet-analysis'
import { MOCK_WALLET_DNA, WalletDNAData } from '@/lib/crypto-mock-data'

export default function WalletDNAPage() {
  const [address, setAddress] = useState('')
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null)
  const [data, setData] = useState<WalletDNAData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = (addr?: string) => {
    const target = addr || address
    if (!target) return
    setSubmittedAddress(target)
    setLoading(true)
    // Simulate API
    setTimeout(() => {
      // For demo: any input returns the Apex Predator wallet
      setData(MOCK_WALLET_DNA['0x7a3...apex']!)
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="p-6 w-full">
      {/* Preview Mode Banner */}
      <div className="mb-4 rounded-lg border border-[#D4A042]/20 bg-[#D4A042]/5 px-4 py-2.5 flex items-center gap-2">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#D4A042]/10 text-[#D4A042]">PREVIEW</span>
        <span className="text-[12px] text-[#D4A042]/80">Wallet DNA is running in preview mode with sample data. Live on-chain analysis coming soon.</span>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Wallet DNA & Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Behavioral archetypes, MEV losses, and Airdrop scoring.</p>
        </div>
        <div className="relative w-full max-w-[400px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            placeholder="0x... or ENS name"
            className="w-full pl-9 pr-24 py-2.5 rounded-xl border bg-card text-[13px] font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#4A90C4]/40" />
          <button onClick={() => handleAnalyze()}
            disabled={!address || loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-[12px] font-medium text-white disabled:opacity-30 cursor-pointer transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #2C5F8A, #5B4F8A)' }}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <div className="w-8 h-8 border-2 border-[#4A90C4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-muted-foreground">Analyzing wallet across 3 chains...</span>
          <div className="flex gap-3 mt-2">
            {['Scanning transactions', 'Classifying behavior', 'Checking MEV exposure', 'Scoring airdrops'].map((s) => (
              <span key={s} className="text-[10px] text-muted-foreground/60">{s}...</span>
            ))}
          </div>
        </div>
      ) : data ? (
        <WalletAnalysis data={data} />
      ) : (
        <WalletEmptyState onSelectWallet={(addr) => { setAddress(addr); handleAnalyze(addr) }} />
      )}
    </div>
  )
}
