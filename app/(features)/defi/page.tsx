'use client'

import { useState, useMemo } from 'react'
import { useProtocols, useChains, useYieldPools, useDEXVolumes, useFees, useStablecoins } from '@/hooks/use-defillama'
import { formatTvl, formatChange, normalizeCategory } from '@/lib/defillama'

const CAT_FILTERS = ['All', 'Lending', 'DEX', 'Staking', 'Yield', 'Bridge', 'Derivatives', 'RWA', 'Other']
const CHAIN_OPTS = ['All Chains', 'Ethereum', 'Solana', 'Arbitrum', 'Base', 'BSC', 'Polygon', 'Optimism', 'Avalanche']
const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }
type Section = 'protocols' | 'yields' | 'dexes' | 'fees' | 'chains'

export default function DeFiPage() {
  const [sec, setSec] = useState<Section>('protocols')
  const [catF, setCatF] = useState('All')
  const [chainF, setChainF] = useState('All Chains')
  const [pSearch, setPSearch] = useState('')
  const [ySearch, setYSearch] = useState('')
  const [stableOnly, setStableOnly] = useState(false)
  const [minTvl, setMinTvl] = useState(100000)

  const { protocols, isLoading: pLoad } = useProtocols()
  const { chains, isLoading: cLoad } = useChains()
  const { pools, isLoading: yLoad } = useYieldPools()
  const { dexes, totalVolume24h, isLoading: dLoad } = useDEXVolumes()
  const { fees, isLoading: fLoad } = useFees()
  const { stablecoins } = useStablecoins()

  const totalTvl = chains.reduce((s, c) => s + c.tvl, 0)
  const totalFees = fees.slice(0, 100).reduce((s, f) => s + (Number(f.total24h) || 0), 0)
  const totalStable = stablecoins.reduce((s, sc) => s + (sc.circulating?.peggedUSD || 0), 0)

  const filteredP = useMemo(() => protocols.filter(p => p.tvl > 100000).filter(p => catF === 'All' || normalizeCategory(p.category) === catF).filter(p => chainF === 'All Chains' || p.chains?.includes(chainF)).filter(p => !pSearch || p.name.toLowerCase().includes(pSearch.toLowerCase()) || p.symbol?.toLowerCase().includes(pSearch.toLowerCase())).sort((a, b) => b.tvl - a.tvl).slice(0, 100), [protocols, catF, chainF, pSearch])

  const filteredY = useMemo(() => pools.filter(p => p.apy > 0.01 && p.tvlUsd > minTvl).filter(p => !stableOnly || p.stablecoin).filter(p => chainF === 'All Chains' || p.chain === chainF).filter(p => !ySearch || p.project.toLowerCase().includes(ySearch.toLowerCase()) || p.symbol.toLowerCase().includes(ySearch.toLowerCase())).sort((a, b) => b.tvlUsd - a.tvlUsd).slice(0, 60), [pools, stableOnly, minTvl, chainF, ySearch])

  const gainers = useMemo(() => [...protocols].filter(p => p.tvl > 1e6 && p.change_1d != null).sort((a, b) => (b.change_1d || 0) - (a.change_1d || 0)).slice(0, 5), [protocols])
  const losers = useMemo(() => [...protocols].filter(p => p.tvl > 1e6 && p.change_1d != null).sort((a, b) => (a.change_1d || 0) - (b.change_1d || 0)).slice(0, 5), [protocols])

  const th: React.CSSProperties = { padding: '0 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-tertiary)', textTransform: 'uppercase', ...mono, whiteSpace: 'nowrap' }

  return (
    <div style={{ padding: '20px 24px 48px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>DeFi</h1>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>Protocol rankings, yield opportunities, DEX volumes, and fee revenue. <span style={{ fontSize: 10, color: 'var(--text-quaternary)' }}>Powered by DeFiLlama</span></p>
        </div>
        <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" style={{ padding: '4px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, ...mono, textDecoration: 'none', background: 'rgba(62,189,140,0.08)', border: '1px solid rgba(62,189,140,0.2)', color: 'var(--data-positive)' }}>DeFiLlama ↗</a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 22 }}>
        {[
          { l: 'TOTAL TVL', v: formatTvl(totalTvl) },
          { l: 'DEX VOL (24H)', v: formatTvl(totalVolume24h) },
          { l: 'FEES (TOP 100)', v: formatTvl(totalFees) },
          { l: 'STABLECOIN SUPPLY', v: formatTvl(totalStable) },
          { l: 'PROTOCOLS', v: protocols.filter(p => p.tvl > 100000).length.toLocaleString() },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-quaternary)', ...mono, marginBottom: 5 }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', ...mono }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-default)', marginBottom: 18 }}>
        {([['protocols', 'Protocol Rankings'], ['yields', 'Yield Explorer'], ['dexes', 'DEX Volumes'], ['fees', 'Fees & Revenue'], ['chains', 'Chains']] as [Section, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setSec(id)} style={{ padding: '9px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: sec === id ? 600 : 400, color: sec === id ? 'var(--text-primary)' : 'var(--text-tertiary)', borderBottom: sec === id ? '2px solid var(--accent-primary)' : '2px solid transparent', marginBottom: -1, transition: 'all 120ms' }}>{label}</button>
        ))}
      </div>

      {/* ═══ PROTOCOLS ═══ */}
      {sec === 'protocols' && <>
        {/* Gainers/Losers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          {[{ title: '▲ TVL GAINERS (24H)', data: gainers, color: 'var(--data-positive)' }, { title: '▼ TVL LOSERS (24H)', data: losers, color: 'var(--data-negative)' }].map(({ title, data, color }) => (
            <div key={title} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color, ...mono, marginBottom: 8 }}>{title}</div>
              {pLoad ? <div style={{ padding: 12, color: 'var(--text-tertiary)', fontSize: 11 }}>Loading...</div> : data.map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                  {p.logo && <img src={p.logo} alt="" style={{ width: 16, height: 16, borderRadius: '50%' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                  <span style={{ flex: 1, fontSize: 11.5, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span style={{ fontSize: 10, ...mono, color: 'var(--text-secondary)' }}>{formatTvl(p.tvl)}</span>
                  <span style={{ fontSize: 10, ...mono, fontWeight: 600, color, width: 56, textAlign: 'right' }}>{(p.change_1d || 0) >= 0 ? '+' : ''}{(p.change_1d || 0).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={pSearch} onChange={e => setPSearch(e.target.value)} placeholder="Search protocols..." style={{ height: 30, padding: '0 10px', width: 200, borderRadius: 6, border: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontSize: 11, outline: 'none' }} />
          {CAT_FILTERS.map(c => <button key={c} onClick={() => setCatF(c)} style={{ height: 26, padding: '0 9px', borderRadius: 5, border: '1px solid', fontSize: 10, fontWeight: 500, cursor: 'pointer', borderColor: catF === c ? 'var(--accent-primary-muted)' : 'var(--border-subtle)', background: catF === c ? 'var(--accent-primary-bg)' : 'transparent', color: catF === c ? 'var(--accent-primary)' : 'var(--text-quaternary)', transition: 'all 100ms' }}>{c}</button>)}
          <select value={chainF} onChange={e => setChainF(e.target.value)} style={{ height: 26, padding: '0 6px', borderRadius: 5, border: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', fontSize: 10, outline: 'none', marginLeft: 'auto' }}>
            {CHAIN_OPTS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 1050, borderCollapse: 'collapse' }}>
            <thead><tr style={{ height: 32, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
              {['#', 'Protocol', 'Category', 'TVL', '1D', '7D', 'MCap', 'TVL/MCap', 'Chains'].map((h, i) => <th key={h} style={{ ...th, textAlign: i >= 3 ? 'right' : 'left' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {pLoad && <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>Loading protocols...</td></tr>}
              {filteredP.map((p, i) => {
                const c1 = formatChange(p.change_1d), c7 = formatChange(p.change_7d)
                const tvlMcap = p.mcap && p.mcap > 0 ? p.tvl / p.mcap : null
                return (
                  <tr key={p.name + i} style={{ height: 36, borderBottom: '1px solid var(--border-subtle)', transition: 'background 100ms', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-3)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <td style={{ padding: '0 12px', fontSize: 10, color: 'var(--text-quaternary)', ...mono, width: 36 }}>{i + 1}</td>
                    <td style={{ padding: '0 12px', width: 190 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {p.logo && <img src={p.logo} alt="" style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                        {p.symbol && <span style={{ fontSize: 9, color: 'var(--text-quaternary)', ...mono }}>{p.symbol}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0 12px', width: 80 }}><span style={{ padding: '1px 5px', borderRadius: 3, fontSize: 9, fontWeight: 600, ...mono, background: 'var(--bg-surface-3)', color: 'var(--text-tertiary)' }}>{normalizeCategory(p.category)}</span></td>
                    <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 12, ...mono, fontWeight: 600, color: 'var(--text-primary)' }}>{formatTvl(p.tvl)}</td>
                    <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: c1.color }}>{c1.text}</td>
                    <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: c7.color }}>{c7.text}</td>
                    <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, color: 'var(--text-secondary)' }}>{p.mcap ? formatTvl(p.mcap) : '—'}</td>
                    <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: tvlMcap && tvlMcap > 1 ? 'var(--data-positive)' : tvlMcap && tvlMcap > 0.5 ? 'var(--data-warning)' : 'var(--text-quaternary)' }}>{tvlMcap ? tvlMcap.toFixed(2) + 'x' : '—'}</td>
                    <td style={{ padding: '0 12px' }}><div style={{ display: 'flex', gap: 2 }}>{(p.chains || []).slice(0, 3).map(c => <span key={c} style={{ fontSize: 8, ...mono, color: 'var(--text-quaternary)', background: 'var(--bg-surface-3)', padding: '1px 3px', borderRadius: 2 }}>{c.slice(0, 3)}</span>)}{(p.chains || []).length > 3 && <span style={{ fontSize: 8, color: 'var(--text-quaternary)' }}>+{p.chains.length - 3}</span>}</div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>}

      {/* ═══ YIELDS ═══ */}
      {sec === 'yields' && <>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={ySearch} onChange={e => setYSearch(e.target.value)} placeholder="Search pools..." style={{ height: 30, padding: '0 10px', width: 220, borderRadius: 6, border: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontSize: 11, outline: 'none' }} />
          <button onClick={() => setStableOnly(!stableOnly)} style={{ height: 26, padding: '0 9px', borderRadius: 5, border: '1px solid', fontSize: 10, fontWeight: 500, cursor: 'pointer', borderColor: stableOnly ? 'var(--data-positive)' : 'var(--border-subtle)', background: stableOnly ? 'rgba(62,189,140,0.06)' : 'transparent', color: stableOnly ? 'var(--data-positive)' : 'var(--text-quaternary)' }}>Stables Only</button>
          {[100000, 1000000, 10000000].map(mv => <button key={mv} onClick={() => setMinTvl(mv)} style={{ height: 26, padding: '0 9px', borderRadius: 5, border: '1px solid', fontSize: 10, fontWeight: 500, cursor: 'pointer', borderColor: minTvl === mv ? 'var(--accent-primary-muted)' : 'var(--border-subtle)', background: minTvl === mv ? 'var(--accent-primary-bg)' : 'transparent', color: minTvl === mv ? 'var(--accent-primary)' : 'var(--text-quaternary)' }}>{mv >= 1e6 ? `$${mv / 1e6}M+` : `$${mv / 1e3}K+`}</button>)}
          <select value={chainF} onChange={e => setChainF(e.target.value)} style={{ height: 26, padding: '0 6px', borderRadius: 5, border: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', fontSize: 10, outline: 'none', marginLeft: 'auto' }}>{CHAIN_OPTS.map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 950, borderCollapse: 'collapse' }}>
            <thead><tr style={{ height: 32, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
              {['Protocol', 'Pool', 'Chain', 'TVL', 'APY', 'Base', 'Reward', '30D Mean', 'IL Risk', 'Outlook'].map((h, i) => <th key={h} style={{ ...th, textAlign: i >= 3 ? 'right' : 'left' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {yLoad && <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>Loading yields...</td></tr>}
              {filteredY.map(pool => (
                <tr key={pool.pool} style={{ height: 36, borderBottom: '1px solid var(--border-subtle)', transition: 'background 100ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-3)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <td style={{ padding: '0 12px', fontSize: 11.5, fontWeight: 500, color: 'var(--text-primary)', width: 130 }}>{pool.project}</td>
                  <td style={{ padding: '0 12px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)', width: 130 }}>{pool.symbol}{pool.stablecoin && <span style={{ marginLeft: 3, fontSize: 9, color: 'var(--data-positive)' }}>$</span>}</td>
                  <td style={{ padding: '0 12px', width: 50 }}><span style={{ fontSize: 8, ...mono, color: 'var(--text-quaternary)', background: 'var(--bg-surface-3)', padding: '1px 4px', borderRadius: 2 }}>{pool.chain.slice(0, 5)}</span></td>
                  <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, color: 'var(--text-primary)' }}>{formatTvl(pool.tvlUsd)}</td>
                  <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 12, ...mono, fontWeight: 700, color: pool.apy > 20 ? 'var(--data-positive)' : pool.apy > 5 ? 'var(--data-warning)' : 'var(--text-primary)' }}>{pool.apy.toFixed(2)}%</td>
                  <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 10, ...mono, color: 'var(--text-secondary)' }}>{pool.apyBase != null ? pool.apyBase.toFixed(2) + '%' : '—'}</td>
                  <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 10, ...mono, color: 'var(--accent-violet)' }}>{pool.apyReward != null && pool.apyReward > 0 ? pool.apyReward.toFixed(2) + '%' : '—'}</td>
                  <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 10, ...mono, color: 'var(--text-tertiary)' }}>{pool.apyMean30d ? pool.apyMean30d.toFixed(2) + '%' : '—'}</td>
                  <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: pool.ilRisk === 'no' ? 'var(--data-positive)' : 'var(--data-negative)' }}>{pool.ilRisk === 'no' ? 'No' : 'Yes'}</td>
                  <td style={{ padding: '0 12px', textAlign: 'right' }}>{pool.predictions && <span style={{ fontSize: 9, fontWeight: 600, ...mono, padding: '1px 5px', borderRadius: 3, color: pool.predictions.predictedClass === 'Stable' ? 'var(--data-positive)' : pool.predictions.predictedClass === 'Up' ? 'var(--data-warning)' : 'var(--data-negative)', background: pool.predictions.predictedClass === 'Stable' ? 'rgba(62,189,140,0.08)' : pool.predictions.predictedClass === 'Up' ? 'rgba(212,160,66,0.08)' : 'rgba(224,101,101,0.08)' }}>{pool.predictions.predictedClass}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}

      {/* ═══ DEX ═══ */}
      {sec === 'dexes' && <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 750, borderCollapse: 'collapse' }}>
          <thead><tr style={{ height: 32, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
            {['#', 'DEX', '24H Volume', '7D Volume', '30D Volume', '1D Chg', '7D Chg', 'Chains'].map((h, i) => <th key={h} style={{ ...th, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {dLoad && <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading DEX data...</td></tr>}
            {dexes.slice(0, 30).map((d, i) => { const c1 = formatChange(d.change_1d), c7 = formatChange(d.change_7d); return (
              <tr key={d.name} style={{ height: 36, borderBottom: '1px solid var(--border-subtle)', transition: 'background 100ms' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-3)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <td style={{ padding: '0 12px', fontSize: 10, color: 'var(--text-quaternary)', ...mono, width: 36 }}>{i + 1}</td>
                <td style={{ padding: '0 12px', width: 150 }}><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>{d.logo && <img src={d.logo} alt="" style={{ width: 16, height: 16, borderRadius: '50%' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{d.displayName || d.name}</span></div></td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 12, ...mono, fontWeight: 600, color: 'var(--text-primary)' }}>{d.total24h ? formatTvl(d.total24h) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, color: 'var(--text-secondary)' }}>{d.total7d ? formatTvl(d.total7d) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, color: 'var(--text-secondary)' }}>{d.total30d ? formatTvl(d.total30d) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: c1.color }}>{c1.text}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: c7.color }}>{c7.text}</td>
                <td style={{ padding: '0 12px' }}><div style={{ display: 'flex', gap: 2 }}>{(d.chains || []).slice(0, 3).map(c => <span key={c} style={{ fontSize: 8, ...mono, color: 'var(--text-quaternary)', background: 'var(--bg-surface-3)', padding: '1px 3px', borderRadius: 2 }}>{c.slice(0, 4)}</span>)}</div></td>
              </tr>
            ) })}
          </tbody>
        </table>
      </div>}

      {/* ═══ FEES ═══ */}
      {sec === 'fees' && <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
          <thead><tr style={{ height: 32, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
            {['#', 'Protocol', 'Daily Fees', '7D Fees', 'All-Time', 'Revenue', '1D Chg', 'Chains'].map((h, i) => <th key={h} style={{ ...th, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {fLoad && <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading fees...</td></tr>}
            {fees.slice(0, 30).map((f, i) => { const c = formatChange(f.change_1d); return (
              <tr key={f.name} style={{ height: 36, borderBottom: '1px solid var(--border-subtle)', transition: 'background 100ms' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-3)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <td style={{ padding: '0 12px', fontSize: 10, color: 'var(--text-quaternary)', ...mono, width: 36 }}>{i + 1}</td>
                <td style={{ padding: '0 12px', width: 150 }}><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>{f.logo && <img src={f.logo} alt="" style={{ width: 16, height: 16, borderRadius: '50%' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{f.displayName || f.name}</span></div></td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 12, ...mono, fontWeight: 600, color: 'var(--data-positive)' }}>{f.total24h ? formatTvl(f.total24h) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, color: 'var(--text-secondary)' }}>{f.total7d ? formatTvl(f.total7d) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, color: 'var(--text-secondary)' }}>{f.totalAllTime ? formatTvl(f.totalAllTime) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: 'var(--accent-primary)' }}>{f.dailyRevenue ? formatTvl(f.dailyRevenue) : '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 11, ...mono, fontWeight: 600, color: c.color }}>{c.text}</td>
                <td style={{ padding: '0 12px' }}><div style={{ display: 'flex', gap: 2 }}>{(f.chains || []).slice(0, 3).map(c => <span key={c} style={{ fontSize: 8, ...mono, color: 'var(--text-quaternary)', background: 'var(--bg-surface-3)', padding: '1px 3px', borderRadius: 2 }}>{c.slice(0, 4)}</span>)}</div></td>
              </tr>
            ) })}
          </tbody>
        </table>
      </div>}

      {/* ═══ CHAINS ═══ */}
      {sec === 'chains' && <>
        <div style={{ marginBottom: 20 }}>
          {cLoad ? <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div> : chains.slice(0, 15).map((chain, i) => {
            const pct = chains[0] ? (chain.tvl / chains[0].tvl) * 100 : 0
            return (
              <div key={chain.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                <span style={{ width: 80, fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0 }}>{chain.name}</span>
                <div style={{ flex: 1, height: 22, background: 'rgba(255,255,255,0.02)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: `hsl(${200 + i * 8}, 40%, ${48 - i}%)`, opacity: 0.6 }} />
                  {pct > 18 && <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9, ...mono, fontWeight: 600, color: 'white' }}>{formatTvl(chain.tvl)}</span>}
                </div>
                {pct <= 18 && <span style={{ width: 65, fontSize: 10, ...mono, color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{formatTvl(chain.tvl)}</span>}
              </div>
            )
          })}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ height: 32, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
            {['#', 'Chain', 'TVL', 'Token', '% of Total'].map((h, i) => <th key={h} style={{ ...th, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {chains.slice(0, 25).map((c, i) => (
              <tr key={c.name} style={{ height: 34, borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0 12px', fontSize: 10, color: 'var(--text-quaternary)', ...mono, width: 36 }}>{i + 1}</td>
                <td style={{ padding: '0 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 12, ...mono, fontWeight: 600, color: 'var(--text-primary)' }}>{formatTvl(c.tvl)}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 10, ...mono, color: 'var(--text-tertiary)' }}>{c.tokenSymbol || '—'}</td>
                <td style={{ padding: '0 12px', textAlign: 'right', fontSize: 10, ...mono, color: 'var(--text-secondary)' }}>{totalTvl > 0 ? ((c.tvl / totalTvl) * 100).toFixed(1) + '%' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>}
    </div>
  )
}
