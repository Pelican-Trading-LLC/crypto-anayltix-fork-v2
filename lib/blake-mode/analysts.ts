export interface AnalystConfig {
  id: string
  name: string
  shortName: string
  methodology: string[]
  active: boolean
  voiceSamplesAvailable: boolean
  avatarUrl: string | null
  bio: string
}

export const ANALYSTS: Record<string, AnalystConfig> = {
  blake: {
    id: 'blake',
    name: 'Blake Morrow',
    shortName: 'Blake',
    methodology: ['Traditional TA', 'Channels', 'Fibonacci', 'Multi-timeframe'],
    active: true,
    voiceSamplesAvailable: true,
    avatarUrl: null,
    bio: 'Senior FX and macro analyst at ForexAnalytix. 25+ years professional trading.',
  },
  grega: {
    id: 'grega',
    name: 'Grega Horvat',
    shortName: 'Grega',
    methodology: ['Elliott Wave', 'Harmonic patterns', 'Wave count'],
    active: false,
    voiceSamplesAvailable: false,
    avatarUrl: null,
    bio: 'Elliott Wave specialist.',
  },
  steve: {
    id: 'steve',
    name: 'Steve Voulgaridis',
    shortName: 'Steve',
    methodology: ['Macro positioning', 'Intermarket analysis', 'Risk regime'],
    active: false,
    voiceSamplesAvailable: false,
    avatarUrl: null,
    bio: 'Macro and risk regime specialist.',
  },
  dale: {
    id: 'dale',
    name: 'Dale Pinkert',
    shortName: 'Dale',
    methodology: ['Market flow', 'Session-based analysis', 'Order flow'],
    active: false,
    voiceSamplesAvailable: false,
    avatarUrl: null,
    bio: 'Live market flow specialist. Host of FACE.',
  },
}
