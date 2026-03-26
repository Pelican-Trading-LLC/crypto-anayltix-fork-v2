"use client"

import React from 'react'

interface PatternSVGProps {
  pattern: string
}

const CYAN = '#22D3EE'
const TERTIARY = '#4A5568'
const LABEL = '#8B949E'
const GREEN = '#34D399'
const RED = '#F87171'
const VIOLET = '#A78BFA'

export function PatternSVG({ pattern }: PatternSVGProps) {
  return (
    <div
      style={{
        background: 'var(--v2-bg-surface-2)',
        borderRadius: '6px',
        padding: '12px',
        border: '1px solid var(--v2-border)',
      }}
    >
      <svg
        viewBox="0 0 300 100"
        style={{ width: '100%', height: '100px', display: 'block' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {pattern === 'Bull Flag' && <BullFlag />}
        {pattern === 'Head & Shoulders' && <HeadAndShoulders />}
        {pattern === 'Cup & Handle' && <CupAndHandle />}
        {pattern === 'Elliott Wave' && <ElliottWave />}
        {pattern === 'Bat Pattern' && <BatPattern />}
        {pattern === 'Falling Wedge' && <FallingWedge />}
      </svg>
    </div>
  )
}

function BullFlag() {
  return (
    <>
      {/* Rising pole — cyan main line */}
      <polyline points="25,85 70,35 110,25" stroke={CYAN} strokeWidth={2} fill="none" />
      {/* Descending channel (flag) — dashed tertiary */}
      <polyline points="110,25 145,38 180,34" stroke={TERTIARY} strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
      <polyline points="110,35 145,48 180,44" stroke={TERTIARY} strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
      {/* Breakout arrow — green */}
      <polyline points="180,34 240,10" stroke={GREEN} strokeWidth={2} fill="none" />
      <polygon points="240,10 231,18 234,8" fill={GREEN} />
    </>
  )
}

function HeadAndShoulders() {
  return (
    <>
      {/* Three peaks — tertiary */}
      <polyline
        points="25,70 60,38 95,65 150,12 205,65 240,38 275,70"
        stroke={TERTIARY}
        strokeWidth={1.5}
        fill="none"
      />
      {/* Neckline — dashed tertiary */}
      <line x1="25" y1="70" x2="275" y2="70" stroke={TERTIARY} strokeWidth={1.5} strokeDasharray="4 4" />
      {/* Labels */}
      <text x="60" y="33" fill={LABEL} fontSize="10" textAnchor="middle">LS</text>
      <text x="150" y="8" fill={LABEL} fontSize="10" textAnchor="middle">H</text>
      <text x="240" y="33" fill={LABEL} fontSize="10" textAnchor="middle">RS</text>
      {/* Breakdown arrow — red */}
      <polyline points="240,70 265,90" stroke={RED} strokeWidth={2} fill="none" />
      <polygon points="265,90 256,86 262,80" fill={RED} />
    </>
  )
}

function CupAndHandle() {
  return (
    <>
      {/* U-curve cup — cyan */}
      <path
        d="M 25,25 C 25,90 160,90 185,25"
        stroke={CYAN}
        strokeWidth={2}
        fill="none"
      />
      {/* Small handle dip — cyan */}
      <path
        d="M 185,25 C 195,23 210,45 228,30"
        stroke={CYAN}
        strokeWidth={2}
        fill="none"
      />
      {/* Breakout arrow — green */}
      <polyline points="228,30 265,10" stroke={GREEN} strokeWidth={2} fill="none" />
      <polygon points="265,10 257,18 260,8" fill={GREEN} />
    </>
  )
}

function ElliottWave() {
  return (
    <>
      {/* 5-wave impulse — cyan */}
      <polyline
        points="18,82 58,35 85,58 145,10 180,45 250,5"
        stroke={CYAN}
        strokeWidth={2}
        fill="none"
      />
      {/* Wave number labels — secondary text */}
      <text x="58" y="30" fill={LABEL} fontSize="10" textAnchor="middle">1</text>
      <text x="85" y="70" fill={LABEL} fontSize="10" textAnchor="middle">2</text>
      <text x="145" y="7" fill={LABEL} fontSize="10" textAnchor="middle">3</text>
      <text x="180" y="57" fill={LABEL} fontSize="10" textAnchor="middle">4</text>
      <text x="250" y="4" fill={LABEL} fontSize="10" textAnchor="middle">5</text>
    </>
  )
}

function BatPattern() {
  return (
    <>
      {/* XABCD harmonic — violet */}
      <polyline
        points="22,78 72,18 120,55 165,14 245,70"
        stroke={VIOLET}
        strokeWidth={2}
        fill="none"
      />
      {/* XA retrace dashed */}
      <line x1="22" y1="78" x2="165" y2="14" stroke={TERTIARY} strokeWidth={1} strokeDasharray="4 4" />
      {/* Letter labels */}
      <text x="22" y="90" fill={LABEL} fontSize="10" textAnchor="middle">X</text>
      <text x="72" y="13" fill={LABEL} fontSize="10" textAnchor="middle">A</text>
      <text x="120" y="67" fill={LABEL} fontSize="10" textAnchor="middle">B</text>
      <text x="165" y="10" fill={LABEL} fontSize="10" textAnchor="middle">C</text>
      <text x="245" y="82" fill={LABEL} fontSize="10" textAnchor="middle">D</text>
    </>
  )
}

function FallingWedge() {
  return (
    <>
      {/* Converging downward dashed lines — tertiary */}
      <line x1="25" y1="15" x2="190" y2="45" stroke={TERTIARY} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1="25" y1="30" x2="190" y2="50" stroke={TERTIARY} strokeWidth={1.5} strokeDasharray="4 4" />
      {/* Price action inside wedge — cyan */}
      <polyline
        points="30,18 55,28 75,20 105,32 125,27 155,40 178,36 190,48"
        stroke={CYAN}
        strokeWidth={2}
        fill="none"
      />
      {/* Breakout arrow — green */}
      <polyline points="190,45 250,15" stroke={GREEN} strokeWidth={2} fill="none" />
      <polygon points="250,15 242,23 245,13" fill={GREEN} />
    </>
  )
}
