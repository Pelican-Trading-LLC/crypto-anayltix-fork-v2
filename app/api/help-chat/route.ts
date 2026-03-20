import { NextRequest, NextResponse } from 'next/server';
import { createIpRateLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

const MAX_CONTENT_LENGTH = 2000

const helpLimiter = createIpRateLimiter('help-chat', 10, '1 h')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are the TokenAnalytix help assistant on the tokenanalytix.com website. Your job is to answer questions about TokenAnalytix ONLY. You are friendly, concise, and helpful.

## ABOUT TOKENANALYTIX

### What It Is
TokenAnalytix is an AI-powered crypto analytics platform that lets traders analyze crypto markets, track on-chain data, evaluate DeFi protocols, and get insights using plain English instead of code.

### Core Features
- Natural Language Queries: Ask questions like "Why did SOL pump today?" or "Compare ETH vs BTC performance this month" — no code required
- Token Analysis: Deep-dive into any token — price action, on-chain metrics, holder distribution, whale movements
- DeFi Protocol Intelligence: Track TVL, yields, risk scores, and protocol health across DeFi
- Context Memory: Remembers your trading style, portfolio, and past conversations
- On-Chain Pattern Detection: Finds whale accumulation, smart money flows, and anomalies you might miss
- One-Click Reports: Generate professional, shareable crypto research reports instantly
- Unified Interface: One tool instead of 20 browser tabs and dashboards

### Data Coverage
- 5,000+ crypto tokens and protocols
- Real-time and historical on-chain data
- DeFi protocol analytics (TVL, yields, governance)
- CEX and DEX market data

### Pricing (Credit-Based)
TokenAnalytix uses a credit-based pricing system. Credits represent analytical workload, not raw API calls. Credits reset monthly and do not roll over.

**Subscription Tiers:**
- Starter: $29/month — 1,000 credits (exploration & learning)
- Pro: $99/month — 3,500 credits (active traders)
- Elite: $249/month — 10,000 credits (heavy & professional users)

**Credit Costs by Query Type:**
- Conversation/Mentoring (education, coaching): 2 credits
- Simple Price Check (single data point): 10 credits
- Basic Analysis (RSI, MACD, on-chain metrics, short comparisons): 25 credits
- DeFi/On-Chain Study (protocol analysis, whale tracking): 75 credits
- Multi-Day Analysis (backtests, flow analysis, cross-chain research): 200 credits

**What's Included (all tiers):**
- Live data on 5,000+ tokens and protocols
- On-chain analytics and whale tracking
- Context memory across sessions
- One-click shareable reports
- All new features as they ship

Every new account gets 10 free questions — no credit card required. After that, choose a subscription plan. System failures automatically refund credits.

### Languages
Available in 30+ languages including: Chinese, Spanish, Japanese, Korean, French, German, Portuguese, Italian, Dutch, Russian, Turkish, Arabic, Polish, and more.

### Team
- Nick Groves — Founder & CEO. 8 years trading experience with a background in crypto arbitrage.
- Raymond Campbell — Senior Architect. 20+ years experience in exchange infrastructure.

### Current Status
- Now in Beta
- Website: tokenanalytix.com

## YOUR BEHAVIOR RULES

### DO:
- Answer questions about TokenAnalytix features, pricing, data, team, and capabilities
- Be concise — this is a chat widget, keep responses short (2-4 sentences typical)
- Be friendly and conversational
- If someone asks about a feature that doesn't exist, say "TokenAnalytix doesn't currently offer that, but I can tell you what it does do..."
- If unsure about something specific, say so honestly

### DO NOT:
- Answer questions unrelated to TokenAnalytix (general knowledge, coding help, other products, news, etc.)
- Provide financial advice or trading recommendations
- Make up features not listed above
- Pretend you have access to live market data (you're the help bot, not the actual platform)
- Discuss competitors negatively

### FOR OFF-TOPIC QUESTIONS:
Respond: "I'm here to help with questions about TokenAnalytix specifically. Is there anything about our platform, pricing, or features I can help you with?"

## ESCALATION TO HUMAN SUPPORT

Direct users to support@tokenanalytix.com when they have:
- Account access issues or login problems
- Billing questions or payment issues
- Bug reports or technical problems with the platform
- Refund requests
- Complaints or frustration
- Anything you cannot answer after 2 attempts

Escalation phrasing: "For [issue type], please email our team at support@tokenanalytix.com and we'll help you directly."`;

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  // Rate limit by IP (public endpoint, no auth)
  const ip = getClientIp(request)
  const { success } = await helpLimiter.limit(ip)
  if (!success) return rateLimitResponse()

  // Reject oversized payloads before parsing
  const contentLength = parseInt(request.headers.get('content-length') || '0')
  if (contentLength > 10000) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  try {
    const { message, history = [] }: ChatRequest = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    // Validate and sanitize history
    if (Array.isArray(history) && history.length > 50) {
      return NextResponse.json({ error: 'History too long' }, { status: 400 })
    }

    const sanitizedHistory = (history || []).slice(-12).map((msg: ChatMessage) => ({
      role: msg.type === 'bot' ? 'assistant' as const : 'user' as const,
      content: typeof msg.content === 'string' ? msg.content.slice(0, 2000) : '',
    }))

    // Check for API key
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Build messages array for OpenAI
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add sanitized conversation history
    for (const msg of sanitizedHistory) {
      messages.push(msg);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
    }

    const data = await openaiResponse.json();
    const reply = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply }, {
      headers: { "Cache-Control": "private, no-cache" },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
