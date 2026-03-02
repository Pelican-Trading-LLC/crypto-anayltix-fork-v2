import type { ReactNode } from "react"

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
  logoBase64?: string
}

export function CardLayout({ children, logoBase64 }: CardLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `linear-gradient(145deg, ${CARD_COLORS.bg} 0%, #0d0d14 50%, ${CARD_COLORS.bg} 100%)`,
        padding: 48,
        fontFamily: "Geist Sans, sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        {logoBase64 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoBase64}
            alt=""
            width={32}
            height={32}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        )}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: CARD_COLORS.purple,
            letterSpacing: "-0.02em",
          }}
        >
          PELICAN AI
        </div>
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
  )
}
