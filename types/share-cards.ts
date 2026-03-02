import type { Trade } from "@/hooks/use-trades"

export type ShareCardTrade = Pick<
  Trade,
  | "id"
  | "ticker"
  | "direction"
  | "asset_type"
  | "entry_price"
  | "exit_price"
  | "pnl_amount"
  | "pnl_percent"
  | "r_multiple"
  | "entry_date"
  | "exit_date"
  | "ai_grade"
  | "setup_tags"
>

export interface InsightCardData {
  headline: string
  statPrimary: string | null
  statSecondary: string | null
  tickers: string[]
  category?: string
}

export type ShareFormat = "og" | "square"
export type ShareCardType = "trade-recap" | "pelican-insight"
