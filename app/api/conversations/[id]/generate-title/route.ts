import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as Sentry from "@sentry/nextjs"
import { createUserRateLimiter, rateLimitResponse } from "@/lib/rate-limit"

const titleLimiter = createUserRateLimiter('title-generation', 10, '1 h')

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { success } = await titleLimiter.limit(user.id)
    if (!success) return rateLimitResponse()

    const body = await req.text()
    if (body.length > 10000) {
      return NextResponse.json({ error: "Body too large" }, { status: 413 })
    }
    const { userMessage, assistantMessage } = JSON.parse(body)
    if (!userMessage || !assistantMessage) {
      return NextResponse.json({ error: "Missing userMessage or assistantMessage" }, { status: 400 })
    }

    // Verify the conversation belongs to this user
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single()

    if (convError || !conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    let title: string

    // Try GPT-4o-mini title generation
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 20,
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content:
                  "Generate a concise 3-6 word title for this crypto trading conversation. No quotes, no punctuation at the end. Just the title. Examples: 'Bitcoin Technical Analysis', 'ETH Price Outlook', 'Solana DeFi Strategy', 'Portfolio Risk Assessment', 'Crypto Market Movers Today'.",
              },
              {
                role: "user",
                content: `User asked: "${userMessage.slice(0, 200)}"\n\nAssistant replied: "${assistantMessage.slice(0, 300)}"`,
              },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
          // Strip wrapping quotes and cap length
          title = raw.replace(/^["']|["']$/g, "").slice(0, 80)
        } else {
          // OpenAI call failed — fall back to smart truncation
          title = smartTruncate(userMessage)
        }
      } catch {
        title = smartTruncate(userMessage)
      }
    } else {
      // No API key — fall back to smart truncation
      title = smartTruncate(userMessage)
    }

    if (!title) {
      title = smartTruncate(userMessage)
    }

    const { error: updateError } = await supabase
      .from("conversations")
      .update({ title })
      .eq("id", conversationId)
      .eq("user_id", user.id)

    if (updateError) {
      Sentry.captureException(updateError, {
        tags: { action: "generate_title" },
        extra: { conversationId, userId: user.id },
      })
      return NextResponse.json({ error: "Failed to update title" }, { status: 500 })
    }

    return NextResponse.json({ title })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/conversations/[id]/generate-title", method: "POST" },
      level: "error",
    })
    return NextResponse.json({ error: "Failed to generate title" }, { status: 500 })
  }
}

function smartTruncate(text: string): string {
  const clean = text.trim().slice(0, 50)
  if (clean.length < 50) return clean
  const lastSpace = clean.lastIndexOf(" ")
  return lastSpace > 20 ? clean.slice(0, lastSpace) : clean
}
