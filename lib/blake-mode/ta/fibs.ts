import type { FibLevel, SwingMove } from '../types'

const RETRACEMENT_RATIOS = [0.236, 0.382, 0.5, 0.618, 0.786, 0.886, 1.0]
const EXTENSION_RATIOS = [1.272, 1.618]

function labelFor(ratio: number): string {
  return ratio === 0.5 || ratio === 1 ? ratio.toFixed(1) : ratio.toFixed(3)
}

export function computeFibLevels(swing: SwingMove): FibLevel[] {
  const high = Math.max(swing.startPivot.price, swing.endPivot.price)
  const low = Math.min(swing.startPivot.price, swing.endPivot.price)
  const range = high - low
  const isDownswing = swing.direction === 'down'

  const retracements = RETRACEMENT_RATIOS.map((ratio) => ({
    ratio,
    price: isDownswing ? low + range * ratio : high - range * ratio,
    type: 'retracement' as const,
    label: labelFor(ratio),
  }))

  const extensions = EXTENSION_RATIOS.map((ratio) => ({
    ratio,
    price: isDownswing ? low - range * (ratio - 1) : high + range * (ratio - 1),
    type: 'extension' as const,
    label: labelFor(ratio),
  }))

  return [...retracements, ...extensions]
}

