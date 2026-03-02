import { CardLayout, CARD_COLORS } from "./card-layout"

interface TradeRecapProps {
  trade: {
    ticker: string
    direction: "long" | "short"
    asset_type: string
    entry_price: number
    exit_price: number | null
    pnl_amount: number | null
    pnl_percent: number | null
    r_multiple: number | null
    entry_date: string
    exit_date: string | null
    ai_grade: Record<string, unknown> | null
    setup_tags: string[] | null
  }
  logoBase64?: string
}

export function TradeRecapCard({ trade, logoBase64 }: TradeRecapProps) {
  const pnlAmount = trade.pnl_amount ?? 0
  const pnlPercent = trade.pnl_percent ?? 0
  const isProfit = pnlAmount >= 0
  const pnlColor = isProfit ? CARD_COLORS.green : CARD_COLORS.red

  return (
    <CardLayout logoBase64={logoBase64}>
      {/* Ticker + Direction badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: CARD_COLORS.textPrimary,
            letterSpacing: "-0.02em",
          }}
        >
          {trade.ticker}
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: trade.direction === "long" ? CARD_COLORS.green : CARD_COLORS.red,
            background: trade.direction === "long" ? "#22c55e20" : "#ef444420",
            padding: "4px 12px",
            borderRadius: 6,
            textTransform: "uppercase",
          }}
        >
          {trade.direction}
        </span>
        {trade.asset_type !== "stock" && (
          <span
            style={{
              fontSize: 14,
              color: CARD_COLORS.textMuted,
              textTransform: "uppercase",
            }}
          >
            {trade.asset_type}
          </span>
        )}
      </div>

      {/* P&L hero number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: pnlColor,
            letterSpacing: "-0.03em",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {isProfit ? "+" : ""}
          {pnlPercent.toFixed(1)}%
        </span>
        <span
          style={{
            fontSize: 28,
            color: pnlColor,
            opacity: 0.8,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {isProfit ? "+" : ""}$
          {Math.abs(pnlAmount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 13,
              color: CARD_COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Entry
          </span>
          <span
            style={{
              fontSize: 22,
              color: CARD_COLORS.textPrimary,
              fontFamily: "Geist Mono, monospace",
            }}
          >
            ${trade.entry_price.toFixed(2)}
          </span>
        </div>

        {trade.exit_price !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 13,
                color: CARD_COLORS.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Exit
            </span>
            <span
              style={{
                fontSize: 22,
                color: CARD_COLORS.textPrimary,
                fontFamily: "Geist Mono, monospace",
              }}
            >
              ${trade.exit_price.toFixed(2)}
            </span>
          </div>
        )}

        {trade.r_multiple !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 13,
                color: CARD_COLORS.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              R-Multiple
            </span>
            <span
              style={{
                fontSize: 22,
                color: pnlColor,
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {trade.r_multiple > 0 ? "+" : ""}
              {trade.r_multiple.toFixed(1)}R
            </span>
          </div>
        )}

        {trade.ai_grade &&
          typeof trade.ai_grade === "object" &&
          "letter" in trade.ai_grade &&
          typeof (trade.ai_grade as Record<string, unknown>).letter === "string" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontSize: 13,
                  color: CARD_COLORS.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                AI Grade
              </span>
              <span
                style={{
                  fontSize: 22,
                  color: CARD_COLORS.purple,
                  fontWeight: 700,
                }}
              >
                {(trade.ai_grade as Record<string, unknown>).letter as string}
              </span>
            </div>
          )}
      </div>

      {/* Setup tags */}
      {trade.setup_tags && trade.setup_tags.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          {trade.setup_tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 13,
                color: CARD_COLORS.purpleLight,
                background: "#8b5cf620",
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Date range */}
      <div style={{ display: "flex", marginTop: "auto", paddingTop: 16 }}>
        <span style={{ fontSize: 14, color: CARD_COLORS.textMuted }}>
          {new Date(trade.entry_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          {trade.exit_date &&
            ` → ${new Date(trade.exit_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`}
        </span>
      </div>
    </CardLayout>
  )
}
