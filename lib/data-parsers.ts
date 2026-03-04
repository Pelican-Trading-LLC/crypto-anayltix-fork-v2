export interface DataPoint {
  date: string
  initialDrop: string
  forwardReturn: string
}

export interface ParsedDataTable {
  data: DataPoint[]
  title: string
}

// New: Flexible column structure for structured data
export interface Column {
  key: string
  label: string
  type?: 'date' | 'percentage' | 'number' | 'currency' | 'text'
  align?: 'left' | 'center' | 'right'
}

// New: Structured data table format (from AI markers)
export interface StructuredDataTable {
  query?: string
  title: string
  columns: Column[]
  data: Record<string, unknown>[]
  summary?: Record<string, unknown>
}

/** Result from label-value list detection, includes surrounding text for mixed-content rendering */
export interface LabelValueTableResult {
  table: StructuredDataTable
  /** Text content BEFORE the detected data rows */
  preText: string
  /** Text content AFTER the detected data rows */
  postText: string
}

/**
 * Parse a single line into label + value, or return null if it doesn't match.
 * Exported for testing.
 */
export function parseLabelValueLine(
  line: string
): { label: string; value: string } | null {
  if (!line || line.length > 200) return null

  // Strip numbering: "1." "1)" "12." etc
  // Strip bullets: "•" "-" "*"
  // Strip markdown bold
  const cleaned = line
    .replace(/^\d+[.)]\s*/, "")
    .replace(/^[•\-*]\s+/, "")
    .replace(/\*\*/g, "")
    .trim()

  if (!cleaned) return null

  // Try "Label: Value" (colon separator)
  // Try "Label — Value" or "Label – Value" (dash separators)
  const match =
    cleaned.match(/^(.{2,50}?)\s*:\s+(.+)$/) ||
    cleaned.match(/^(.{2,50}?)\s+[\u2014\u2013]\s+(.+)$/)

  if (!match || !match[1] || !match[2]) return null

  const label = match[1].trim()
  const value = match[2].trim()

  // --- FALSE POSITIVE GUARDS ---

  // Guard 1: Label looks like a sentence (contains common English stopwords)
  const sentenceWords = /\b(is|are|was|were|the|and|but|however|let|you|your|this|that|which|there|here|it|we|our|can|will|would|should|could|have|has|had|been|being|also|very|much|then|than|into|with|from|about|between|because|while|though|although|if)\b/i
  if (sentenceWords.test(label)) return null

  // Guard 2: Value looks like a sentence continuation (not a data value)
  if (value.length > 80) return null
  const valueWordCount = value.split(/\s+/).length
  if (valueWordCount > 8) return null

  // Guard 3: Label shouldn't end with punctuation
  if (/[.!?]$/.test(label)) return null

  return { label, value }
}

/**
 * Detects numbered or bulleted lists with consistent "label: value" patterns.
 * Returns table data plus surrounding text so mixed-content messages render correctly.
 *
 * Minimum 5 consecutive matching lines required to trigger.
 *
 * Patterns matched:
 *   1. 2025-01-02: $257.21          (numbered + date: price)
 *   • Win Rate: 72.4%               (bulleted + metric: value)
 *   - Total P&L: +$1,245.00         (dashed + metric: value)
 *   AAPL: $187.50                   (plain label: value)
 *   52-Week High — $198.23          (em-dash separator)
 */
export function detectLabelValueList(text: string): LabelValueTableResult | null {
  if (typeof text !== "string" || !text.trim()) return null

  const lines = text.split("\n")
  const trimmedLines = lines.map((l) => l.trim())

  // Track the best consecutive run of matching lines
  let currentRun: { label: string; value: string; lineIndex: number }[] = []
  let bestRun: typeof currentRun = []
  let gapCount = 0

  for (let i = 0; i < trimmedLines.length; i++) {
    const line = trimmedLines[i]

    // Allow empty lines as gaps (max 1 consecutive gap)
    if (!line) {
      if (currentRun.length > 0) {
        gapCount++
        if (gapCount > 1) {
          if (currentRun.length > bestRun.length) bestRun = [...currentRun]
          currentRun = []
          gapCount = 0
        }
      }
      continue
    }

    const parsed = parseLabelValueLine(line)
    if (parsed) {
      currentRun.push({ ...parsed, lineIndex: i })
      gapCount = 0
    } else {
      if (currentRun.length > bestRun.length) bestRun = [...currentRun]
      currentRun = []
      gapCount = 0
    }
  }
  if (currentRun.length > bestRun.length) bestRun = [...currentRun]

  // Minimum 5 rows to trigger
  if (bestRun.length < 5) return null

  const firstIdx = bestRun[0]!.lineIndex
  const lastIdx = bestRun[bestRun.length - 1]!.lineIndex

  // --- Build title ---
  // Walk backwards past blank lines to find the real title line
  let title = "Data"
  let titleSearchIdx = firstIdx - 1
  while (titleSearchIdx >= 0 && !trimmedLines[titleSearchIdx]) {
    titleSearchIdx--
  }
  if (titleSearchIdx >= 0) {
    const candidate = trimmedLines[titleSearchIdx]
    if (
      candidate &&
      candidate.length > 0 &&
      candidate.length < 120 &&
      !parseLabelValueLine(candidate)
    ) {
      title = candidate
        .replace(/\*\*/g, "")
        .replace(/^#+\s*/, "")
        .replace(/:$/, "")
        .trim()
    }
  }

  // --- Detect column types ---
  const allValuesAreCurrency = bestRun.every((r) => /^\$[\d,.]+/.test(r.value))
  const allValuesArePercent = bestRun.every((r) => /[\d.]+%/.test(r.value))

  // Match both ISO dates (2025-01-02) and written dates (January 2, Jun 25, 01/02)
  const datePattern = /^(?:\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(?:,?\s*\d{4})?|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/i
  const allLabelsAreDates = bestRun.every((r) => datePattern.test(r.label))

  const labelCol: Column = {
    key: "label",
    label: allLabelsAreDates ? "Date" : "Metric",
    type: allLabelsAreDates ? "date" : "text",
    align: "left",
  }

  const valueCol: Column = {
    key: "value",
    label: allValuesAreCurrency ? "Price" : allValuesArePercent ? "%" : "Value",
    type: allValuesAreCurrency ? "currency"
      : allValuesArePercent ? "percentage"
      : "text",
    align: "right",
  }

  // --- Split surrounding text ---
  // If we used a title line, exclude it from preText to avoid duplication
  const preTextEndIdx = title !== "Data" && titleSearchIdx >= 0 ? titleSearchIdx : firstIdx
  const preText = lines.slice(0, preTextEndIdx).join("\n").trim()
  const postText = lines.slice(lastIdx + 1).join("\n").trim()

  return {
    table: {
      title,
      columns: [labelCol, valueCol],
      data: bestRun.map((r) => ({ label: r.label, value: r.value })),
    },
    preText,
    postText,
  }
}

/**
 * Detects structured data wrapped in <data-table> XML markers
 * This is the preferred format as it's unambiguous and flexible
 *
 * @param text - The text content to analyze
 * @returns Structured data table, or null if not found
 */
export function detectStructuredData(text: string): StructuredDataTable | null {
  // Defensive check - ensure text is a string
  if (typeof text !== 'string') {
    return null
  }
  
  if (!text || text.trim().length === 0) {
    return null
  }

  // Look for <data-table>...</data-table> markers
  const match = text.match(/<data-table>\s*([\s\S]*?)\s*<\/data-table>/i)

  if (!match || !match[1]) {
    return null
  }

  try {
    const parsed = JSON.parse(match[1].trim())

    // Validate structure
    if (!parsed.columns || !parsed.data || !Array.isArray(parsed.columns) || !Array.isArray(parsed.data)) {

      return null
    }

    // Ensure columns have required fields
    const validColumns = parsed.columns.every((col: unknown) => {
      return typeof col === 'object' && col !== null && 'key' in col && 'label' in col
    })
    if (!validColumns) {

      return null
    }

    // Return validated structure
    return {
      query: parsed.query,
      title: parsed.title || 'Data Table',
      columns: parsed.columns,
      data: parsed.data,
      summary: parsed.summary,
    }
  } catch {

    return null
  }
}

/**
 * Detects arrow-format data tables (legacy format)
 * Pattern: YYYY-MM-DD followed by –X.XX% → –X.XX% (or +X.XX%)
 *
 * @param text - The text content to analyze
 * @returns Parsed data table with title, or null if no valid pattern found
 */
export function detectArrowFormat(text: string): ParsedDataTable | null {
  // Defensive check - ensure text is a string
  if (typeof text !== 'string') {
    return null
  }
  
  if (!text || text.trim().length === 0) {
    return null
  }

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  if (lines.length < 3) {
    return null
  }

  // Pattern: YYYY-MM-DD followed by percentage with arrow
  // Handle both en dash (–) and hyphen (-) for negative signs
  const dataPattern = /^(\d{4}-\d{2}-\d{2})\s+([-–]\d+\.\d+%|[+]?\d+\.\d+%)\s*[→>]\s*([-–+]?\d+\.\d+%)/

  const dataPoints: DataPoint[] = []
  let titleLine: string | null = null
  let firstDataLineIndex = -1

  // Find data lines and extract title
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const match = line.match(dataPattern)

    if (match) {
      if (firstDataLineIndex === -1) {
        firstDataLineIndex = i
        // The line before the first data line is likely the title
        if (i > 0) {
          titleLine = lines[i - 1] ?? null
        }
      }

      const date = match[1]
      const initialDrop = match[2]
      const forwardReturn = match[3]

      if (date && initialDrop && forwardReturn) {
        dataPoints.push({
          date,
          initialDrop,
          forwardReturn,
        })
      }
    }
  }

  // Minimum 3 consecutive matching lines required
  if (dataPoints.length < 3) {
    return null
  }

  // Default title if extraction failed
  const title = titleLine && titleLine.length > 0 && titleLine.length < 100
    ? titleLine
    : "Market Data"

  return {
    data: dataPoints,
    title,
  }
}

/**
 * Calculate statistics from data points
 *
 * @param data - Array of data points
 * @returns Object with average return and percentage positive
 */
export function calculateStats(data: DataPoint[]): { avgReturn: string; percentPositive: string } {
  if (data.length === 0) {
    return {
      avgReturn: "0.00%",
      percentPositive: "0%",
    }
  }

  // Parse forward returns (handle both – and - as negative signs)
  const returns = data.map(point => {
    const cleanValue = point.forwardReturn
      .replace(/[–-]/g, '-') // Normalize dashes to hyphen
      .replace(/%/g, '') // Remove %
      .replace(/\+/g, '') // Remove + sign
      .trim()

    return parseFloat(cleanValue)
  }).filter(value => !isNaN(value))

  if (returns.length === 0) {
    return {
      avgReturn: "0.00%",
      percentPositive: "0%",
    }
  }

  // Calculate average
  const sum = returns.reduce((acc, val) => acc + val, 0)
  const avg = sum / returns.length

  // Calculate percentage positive
  const positiveCount = returns.filter(val => val >= 0).length
  const percentPositive = (positiveCount / returns.length) * 100

  return {
    avgReturn: `${avg >= 0 ? '+' : ''}${avg.toFixed(2)}%`,
    percentPositive: `${percentPositive.toFixed(0)}%`,
  }
}

/**
 * Main detection function - tries all formats
 * Priority: Structured data (most reliable) → Arrow format (legacy)
 *
 * @param text - The text content to analyze
 * @returns Structured data or parsed data table, or null if no format matches
 */
export function detectDataTable(text: string): StructuredDataTable | ParsedDataTable | null {
  // Defensive check - ensure text is a string
  if (typeof text !== 'string') {
    return null
  }
  
  // Try structured format FIRST (most reliable, unambiguous)
  const structured = detectStructuredData(text)
  if (structured) {
    return structured
  }

  // Fall back to arrow format (legacy regex-based)
  const arrow = detectArrowFormat(text)
  if (arrow) {
    return arrow
  }

  // No format detected
  return null
}
