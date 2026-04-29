import type { BlakeLevel } from '../types'
import { getLevelCache } from './redis-store'

export async function getServerLevels(ticker: string, analyst: string = 'blake'): Promise<BlakeLevel[]> {
  const levels = await getLevelCache<BlakeLevel[]>(ticker, analyst)
  return Array.isArray(levels) ? levels : []
}
