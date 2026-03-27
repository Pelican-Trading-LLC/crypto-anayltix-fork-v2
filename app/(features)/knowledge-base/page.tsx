'use client'

import { useState, useMemo } from 'react'
import { MagnifyingGlass, Bird } from '@phosphor-icons/react'
import { MOCK_KNOWLEDGE_BASE, PROTOCOL_CATEGORIES, CATEGORY_COLORS } from '@/lib/crypto-mock-data'

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = MOCK_KNOWLEDGE_BASE
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.mechanics.toLowerCase().includes(q))
    }
    return result
  }, [search, category])

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold">Protocol Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">The exact schema Pelican uses to contextualize protocol data.</p>
        </div>
        <div className="relative w-full max-w-[280px]">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search protocols or categories"
            className="w-full pl-8 pr-4 py-2 rounded-lg border bg-card text-[12px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#4A90C4]/40" />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1 flex-wrap mb-4 py-2">
        {PROTOCOL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              category === cat ? 'bg-[#4A90C4]/15 text-[#4A90C4]' : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['PROTOCOL', 'CATEGORY', 'MECHANICS & TOKENOMICS', 'CRITICAL RISKS', 'DATA INTERPRETATION QUIRKS'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-accent/3 cursor-pointer transition-colors"
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[p.category] || '#666' }}>
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[13px] font-semibold">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{ backgroundColor: `${CATEGORY_COLORS[p.category]}15`, color: CATEGORY_COLORS[p.category] }}>
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground max-w-[220px]">{p.mechanics}</td>
                <td className="px-4 py-3 text-[12px] text-[#D4A042] max-w-[200px]">{p.critical_risks}</td>
                <td className="px-4 py-3 text-[12px] text-[#4A90C4] max-w-[240px]">{p.data_quirks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-[11px] text-muted-foreground">
        <span>{filtered.length} protocols indexed</span>
        <span className="flex items-center gap-1">
          <Bird size={12} className="text-[#4A90C4]" />
          Pelican references this knowledge on every Token Intel query
        </span>
      </div>
    </div>
  )
}
