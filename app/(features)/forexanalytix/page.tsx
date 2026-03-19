'use client'

import { Bird } from '@phosphor-icons/react'
import { FA_ANALYSTS, FA_PIPS, FA_TRAFFIC_LIGHT, FA_FACE_SUMMARY, FA_PODCAST, FA_BLOG_POSTS } from '@/lib/forexanalytix-mock-data'
import { PiPCard } from '@/components/forexanalytix/pip-card'
import { FABadge, FAPoweredBy } from '@/components/forexanalytix/fa-badge'

const signalColors = { green: '#22C55E', amber: '#F59E0B', red: '#EF4444' }

export default function ForexAnalytixPage() {
  const activePiPs = FA_PIPS.filter(p => p.status === 'active')

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Hero Header */}
      <div className="rounded-xl border bg-card p-6" style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 60%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #1DA1C4, #178BA8)' }}>FA</div>
              <div>
                <h1 className="text-xl font-semibold">ForexAnalytix</h1>
                <p className="text-[12px] text-muted-foreground">Institutional-grade FX analysis, translated for crypto</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-[#1DA1C4]">{activePiPs.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active PiPs</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums">{FA_ANALYSTS.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Analysts</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-amber-500">{FA_TRAFFIC_LIGHT.regime_score}/10</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Regime Table */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">MACRO REGIME — TRAFFIC LIGHT</span>
            <FABadge />
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-500">{FA_TRAFFIC_LIGHT.regime}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{FA_TRAFFIC_LIGHT.updated}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {FA_TRAFFIC_LIGHT.signals.map(s => (
            <div key={s.indicator} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: signalColors[s.signal] }} />
                <span className="text-[12px] font-semibold">{s.indicator}</span>
              </div>
              <div className="font-mono text-lg tabular-nums font-semibold mb-1">{s.value}</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{s.note}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg p-2.5" style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 40%)', border: '1px solid rgba(29,161,196,0.10)' }}>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4] mb-1">
            <Bird size={12} weight="fill" className="text-[#1DA1C4]" />
            PELICAN TRANSLATION
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">{FA_TRAFFIC_LIGHT.pelican_translation}</p>
        </div>
      </div>

      {/* Active PiPs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">ACTIVE PIPS</span>
          <FABadge />
          <span className="font-mono text-[11px] text-[#1DA1C4]">{activePiPs.length} active</span>
        </div>
        <div className="space-y-3">
          {activePiPs.map(pip => (
            <PiPCard key={pip.id} pip={pip} />
          ))}
        </div>
      </div>

      {/* FACE + Podcast row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* FACE Summary */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">FACE WEBINAR</span>
            <FABadge />
          </div>
          <h3 className="text-[14px] font-semibold mb-1">{FA_FACE_SUMMARY.title}</h3>
          <p className="text-[11px] text-muted-foreground mb-3">{FA_FACE_SUMMARY.duration} &middot; {FA_FACE_SUMMARY.analysts.join(', ')}</p>
          <ul className="space-y-2 mb-3">
            {FA_FACE_SUMMARY.key_takeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-muted-foreground leading-relaxed">
                <span className="text-[#1DA1C4] font-semibold flex-shrink-0">{i + 1}.</span>
                {t}
              </li>
            ))}
          </ul>
          <FAPoweredBy />
        </div>

        {/* Podcast */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">DAY AHEAD PODCAST</span>
            <FABadge />
          </div>
          <h3 className="text-[14px] font-semibold mb-1">{FA_PODCAST.title}</h3>
          <p className="text-[11px] text-muted-foreground mb-3">{FA_PODCAST.episode} &middot; {FA_PODCAST.duration}</p>
          <ul className="space-y-2 mb-3">
            {FA_PODCAST.key_points.map((p, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-muted-foreground leading-relaxed">
                <span className="text-amber-500 flex-shrink-0">&bull;</span>
                {p}
              </li>
            ))}
          </ul>
          <FAPoweredBy />
        </div>
      </div>

      {/* Blog Posts */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">LATEST FROM FA</span>
          <FABadge />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FA_BLOG_POSTS.map(post => (
            <div key={post.id} className="group cursor-pointer p-3 rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground">{post.category}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{post.read_time}</span>
              </div>
              <h4 className="text-[13px] font-semibold group-hover:text-[#1DA1C4] transition-colors mb-1">{post.title}</h4>
              <p className="text-[12px] text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <p className="text-[11px] text-muted-foreground mt-1">by {post.author} &middot; {post.timestamp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst Team */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">ANALYST TEAM</span>
          <FABadge />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {FA_ANALYSTS.map(analyst => (
            <div key={analyst.id} className="rounded-xl border bg-card p-4 hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ backgroundColor: analyst.color }}>
                  {analyst.initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{analyst.name}</div>
                  <div className="text-[11px] text-muted-foreground">{analyst.role}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">{analyst.methodology}</span>
              <p className="text-[12px] text-muted-foreground leading-relaxed mt-2">{analyst.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
