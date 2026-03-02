import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createUserRateLimiter, rateLimitResponse } from "@/lib/rate-limit"

const insightLimiter = createUserRateLimiter("format-insight", 20, "1 m")

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { success: rateLimitOk } = await insightLimiter.limit(user.id)
    if (!rateLimitOk) return rateLimitResponse()

    const { selectedText } = await req.json()

    if (!selectedText || typeof selectedText !== "string" || selectedText.length < 10) {
      return NextResponse.json({ error: "Selection too short" }, { status: 400 })
    }

    if (selectedText.length > 2000) {
      return NextResponse.json({ error: "Selection too long" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a content formatter for a trading AI platform called Pelican AI.
Your job is to take a piece of market analysis text and extract the single most compelling,
shareable statistical insight from it.

Return ONLY a JSON object with this exact structure:
{
  "headline": "The core insight as a clean, punchy statement. Max 120 characters. No fluff. Lead with the specific data point or pattern.",
  "statPrimary": "The key number or stat badge, e.g. '6/6 occurrences' or '73% win rate' or '4.2% avg gain'. Max 25 chars. null if no clear primary stat.",
  "statSecondary": "A supporting stat, e.g. 'Avg +4.2%' or 'Since 2019' or '12 trades'. Max 25 chars. null if not applicable.",
  "tickers": ["ARRAY", "OF", "TICKERS"],
  "category": "One of: pattern, correlation, statistic, comparison, historical, prediction"
}

Rules:
- The headline should be a complete, self-contained statement that makes sense without context
- Strip any conversational language ("Well," "So basically," "It looks like")
- Use the ticker symbol, not the company name
- If the selected text doesn't contain a clear statistical insight, still extract the most shareable claim
- statPrimary and statSecondary should be SHORT badge labels, not sentences
- Tickers should be uppercase stock symbols only`,
          },
          {
            role: "user",
            content: selectedText,
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error("OpenAI API error:", response.status)
      return NextResponse.json({ error: "Failed to format insight" }, { status: 500 })
    }

    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content)

    if (!parsed.headline) {
      return NextResponse.json({ error: "Invalid formatting result" }, { status: 500 })
    }

    return NextResponse.json({
      headline: parsed.headline.slice(0, 150),
      statPrimary: parsed.statPrimary?.slice(0, 30) || null,
      statSecondary: parsed.statSecondary?.slice(0, 30) || null,
      tickers: (parsed.tickers || []).slice(0, 5),
      category: parsed.category || "statistic",
    })
  } catch (error) {
    console.error("Format insight error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
