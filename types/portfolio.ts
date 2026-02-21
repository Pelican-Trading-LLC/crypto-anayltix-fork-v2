export interface PortfolioPosition {
  id: string
  ticker: string
  asset_type: string
  direction: 'long' | 'short'
  quantity: number
  entry_price: number
  position_size_usd: number
  stop_loss: number | null
  take_profit: number | null
  thesis: string | null
  conviction: number | null
  setup_tags: string[]
  entry_date: string
  days_held: number
  has_stop_loss: boolean
  has_take_profit: boolean
  has_thesis: boolean
  risk_amount_usd: number | null
  reward_amount_usd: number | null
  risk_reward_ratio: number | null
  distance_to_stop_pct: number | null
  distance_to_target_pct: number | null
  pelican_scan_count: number
  last_pelican_scan_at: string | null
  is_paper: boolean
  playbook_id: string | null
  notes: string | null
}

export interface AssetBreakdown {
  asset_type: string
  count: number
  total_exposure: number
  pct_of_portfolio: number
}

export interface PortfolioStats {
  total_positions: number
  total_exposure: number
  long_exposure: number
  short_exposure: number
  net_exposure: number
  avg_conviction: number
  positions_without_stop: number
  positions_without_target: number
  positions_without_thesis: number
  oldest_position_date: string | null
  newest_position_date: string | null
  asset_breakdown: AssetBreakdown[]
  direction_breakdown: {
    long: { count: number; exposure: number }
    short: { count: number; exposure: number }
    net_exposure: number
  }
}

export interface RiskSummary {
  total_risk_usd: number
  total_reward_usd: number
  portfolio_rr_ratio: number | null
  positions_with_defined_risk: number
  positions_without_risk: number
}

export interface PlanCompliance {
  has_active_plan: boolean
  max_open_positions: number | null
  current_open_positions: number
  over_position_limit: boolean
  max_position_size_usd?: number | null
  require_stop_loss: boolean | null
  positions_missing_stop: number
  require_thesis: boolean | null
  positions_missing_thesis: number
}

export interface PortfolioSummary {
  positions: PortfolioPosition[]
  portfolio: PortfolioStats
  risk: RiskSummary
  plan_compliance: PlanCompliance
  generated_at: string
}
