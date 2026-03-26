"use client"

import React from 'react'

interface PatternSVGProps {
  pattern: string
}

const MAIN = '#06B6D4'
const MUTED = '#484F58'
const LABEL = '#8B949E'

export function PatternSVG({ pattern }: PatternSVGProps) {
  return (
    <svg
      viewBox="0 0 300 120"
      style={{ width: '100%', height: '120px', display: 'block' }}
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
  )
}

function BullFlag() {
  return (
    <>
      {/* Rising pole */}
      <polyline points="30,100 80,40 120,30" stroke={MAIN} strokeWidth={2} fill="none" />
      {/* Small downward channel (flag) */}
      <polyline points="120,30 160,45 200,40" stroke={MUTED} strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
      <polyline points="120,40 160,55 200,50" stroke={MUTED} strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
      {/* Breakout arrow */}
      <polyline points="200,40 250,15" stroke={MAIN} strokeWidth={2} fill="none" />
      <polygon points="250,15 240,22 244,12" fill={MAIN} />
    </>
  )
}

function HeadAndShoulders() {
  return (
    <>
      {/* Three peaks */}
      <polyline
        points="30,80 70,45 110,75 150,20 190,75 230,45 270,80"
        stroke={MAIN}
        strokeWidth={2}
        fill="none"
      />
      {/* Neckline */}
      <line x1="30" y1="80" x2="270" y2="80" stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 3" />
      {/* Labels */}
      <text x="70" y="40" fill={LABEL} fontSize="9" textAnchor="middle">LS</text>
      <text x="150" y="14" fill={LABEL} fontSize="9" textAnchor="middle">H</text>
      <text x="230" y="40" fill={LABEL} fontSize="9" textAnchor="middle">RS</text>
    </>
  )
}

function CupAndHandle() {
  return (
    <>
      {/* U-shape cup */}
      <path
        d="M 30,30 C 30,100 160,100 190,30"
        stroke={MAIN}
        strokeWidth={2}
        fill="none"
      />
      {/* Handle dip */}
      <path
        d="M 190,30 C 200,28 215,50 235,35"
        stroke={MAIN}
        strokeWidth={2}
        fill="none"
      />
      {/* Breakout */}
      <polyline points="235,35 270,15" stroke={MAIN} strokeWidth={1.5} strokeDasharray="4 3" />
      <polygon points="270,15 262,22 265,12" fill={MAIN} />
    </>
  )
}

function ElliottWave() {
  return (
    <>
      {/* 5-wave impulse */}
      <polyline
        points="20,95 65,40 95,70 155,15 195,55 260,10"
        stroke={MAIN}
        strokeWidth={2}
        fill="none"
      />
      {/* Wave labels */}
      <text x="65" y="34" fill={LABEL} fontSize="10" textAnchor="middle">1</text>
      <text x="95" y="82" fill={LABEL} fontSize="10" textAnchor="middle">2</text>
      <text x="155" y="10" fill={LABEL} fontSize="10" textAnchor="middle">3</text>
      <text x="195" y="67" fill={LABEL} fontSize="10" textAnchor="middle">4</text>
      <text x="260" y="8" fill={LABEL} fontSize="10" textAnchor="middle">5</text>
    </>
  )
}

function BatPattern() {
  return (
    <>
      {/* XABCD harmonic */}
      <polyline
        points="25,90 80,25 130,65 175,20 250,80"
        stroke={MAIN}
        strokeWidth={2}
        fill="none"
      />
      {/* XA retrace line */}
      <line x1="25" y1="90" x2="175" y2="20" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
      {/* Labels */}
      <text x="25" y="104" fill={LABEL} fontSize="10" textAnchor="middle">X</text>
      <text x="80" y="19" fill={LABEL} fontSize="10" textAnchor="middle">A</text>
      <text x="130" y="78" fill={LABEL} fontSize="10" textAnchor="middle">B</text>
      <text x="175" y="14" fill={LABEL} fontSize="10" textAnchor="middle">C</text>
      <text x="250" y="94" fill={LABEL} fontSize="10" textAnchor="middle">D</text>
    </>
  )
}

function FallingWedge() {
  return (
    <>
      {/* Upper trendline */}
      <line x1="30" y1="20" x2="200" y2="50" stroke={MAIN} strokeWidth={1.5} strokeDasharray="5 3" />
      {/* Lower trendline */}
      <line x1="30" y1="30" x2="200" y2="55" stroke={MAIN} strokeWidth={1.5} strokeDasharray="5 3" />
      {/* Price action inside wedge */}
      <polyline
        points="35,22 60,28 80,24 110,35 130,30 160,42 185,38 200,52"
        stroke={MUTED}
        strokeWidth={1.5}
        fill="none"
      />
      {/* Breakout arrow */}
      <polyline points="200,50 255,20" stroke={MAIN} strokeWidth={2} fill="none" />
      <polygon points="255,20 247,28 250,17" fill={MAIN} />
    </>
  )
}
