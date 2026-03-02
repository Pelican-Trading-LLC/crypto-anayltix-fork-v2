import type { ReactNode } from "react"
import { PELICAN_LOGO_B64 } from "./logo-base64"

export const CARD_COLORS = {
  bg: "#0a0a0f",
  cardBg: "#13131a",
  border: "#1e1e2e",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  cyan: "#22d3ee",
  green: "#22c55e",
  red: "#ef4444",
  textPrimary: "#e8e8ed",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
} as const

interface CardLayoutProps {
  children: ReactNode
}

export function CardLayout({ children }: CardLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        fontFamily: "Geist Sans, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient background */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, #0a0a1a 0%, #0f0f1f 40%, #0a0a15 100%)",
        }}
      />

      {/* Purple glow — top right */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Cyan glow — bottom left */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Content on top */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          height: "100%",
          padding: 48,
        }}
      >
        {/* Top bar: Logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PELICAN_LOGO_B64}
            alt=""
            width={36}
            height={36}
            style={{ width: 36, height: 36, borderRadius: 6 }}
          />
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: CARD_COLORS.purple,
              letterSpacing: "-0.02em",
            }}
          >
            PELICAN AI
          </span>
        </div>

        {/* Card content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>

        {/* Bottom watermark */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "auto",
            paddingTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 15,
              color: CARD_COLORS.textMuted,
              letterSpacing: "0.05em",
            }}
          >
            pelicantrading.ai
          </span>
        </div>
      </div>
    </div>
  )
}
