// ============================================================================
// Onboarding Milestones — defines the progressive checklist for new users
// ============================================================================

export interface Milestone {
  key: string
  label: string
  description: string
  order: number
}

export const MILESTONES: Milestone[] = [
  {
    key: "first_message",
    label: "Send your first message",
    description: "Ask Pelican anything about the markets",
    order: 1,
  },
  {
    key: "first_trade",
    label: "Log your first trade",
    description: "Start building your trading journal",
    order: 2,
  },
  {
    key: "first_watchlist",
    label: "Add to your watchlist",
    description: "Track stocks you're watching",
    order: 3,
  },
  {
    key: "visited_heatmap",
    label: "Explore the heatmap",
    description: "See the market at a glance",
    order: 4,
  },
  {
    key: "visited_brief",
    label: "Read your Daily Brief",
    description: "Get your morning market overview",
    order: 5,
  },
  {
    key: "five_trades",
    label: "Log 5 trades",
    description: "Unlock personalized trading insights",
    order: 6,
  },
  {
    key: "first_insight",
    label: "Unlock your first insight",
    description: "Pelican finds patterns in your trading",
    order: 7,
  },
]

export const MILESTONE_KEYS = MILESTONES.map((m) => m.key)
export const TOTAL_MILESTONES = MILESTONES.length
