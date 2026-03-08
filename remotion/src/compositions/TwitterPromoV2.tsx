/**
 * TwitterPromoV2 - Uses ACTUAL Pelican UI components
 *
 * This composition imports the real chat components from the codebase.
 * Webpack aliases in remotion.config.ts redirect Next.js dependencies to shims.
 */

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
  Easing,
} from "remotion";
import React, { useMemo } from "react";

// Import ACTUAL components from the codebase
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import type { Message } from "@/lib/chat-utils";

// Scene timing (frames at 30fps)
const SCENE_1_END = 90; // 0-3s
const SCENE_2_END = 450; // 3-15s
const SCENE_3_END = 690; // 15-23s
const SCENE_4_END = 900; // 23-30s
const SCENE_5_END = 1050; // 30-35s

const COLORS = {
  background: "#0a0a0f",
  foreground: "#f1f5f9",
  primary: "#a855f7",
  border: "rgba(148, 163, 184, 0.15)",
};

export const TwitterPromoV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine current scene
  const scene =
    frame < SCENE_1_END
      ? 1
      : frame < SCENE_2_END
        ? 2
        : frame < SCENE_3_END
          ? 3
          : frame < SCENE_4_END
            ? 4
            : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }} className="dark">
      {scene === 1 && <Scene1 frame={frame} />}
      {scene === 2 && <Scene2 frame={frame - SCENE_1_END} fps={fps} />}
      {scene === 3 && <Scene3 frame={frame - SCENE_2_END} fps={fps} />}
      {scene === 4 && <Scene4 frame={frame - SCENE_3_END} fps={fps} />}
      {scene === 5 && <Scene5 frame={frame - SCENE_4_END} fps={fps} />}
    </AbsoluteFill>
  );
};

// =============================================================================
// Scene 1: Opening text
// =============================================================================
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [60, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const scale = interpolate(frame, [0, 25], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `scale(${scale})`,
        background: `radial-gradient(ellipse at 50% 30%, rgba(168, 85, 247, 0.15) 0%, ${COLORS.background} 70%)`,
      }}
    >
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 100,
          color: COLORS.foreground,
          textAlign: "center",
          letterSpacing: "0.05em",
          textShadow: "0 0 80px rgba(168, 85, 247, 0.5)",
        }}
      >
        Stop researching.{" "}
        <span style={{ color: COLORS.primary }}>Start asking.</span>
      </h1>
    </AbsoluteFill>
  );
};

// =============================================================================
// Scene 2: INTC Analysis - Uses actual components
// =============================================================================
const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const query = "how does INTC look?";
  const response = `INTC's current situation presents significant volatility, based on recent analysis from January 10 to January 24, 2026. Here's a breakdown:

• Current Volatility: daily volatility of 8.30%, annualized 131.8%

• Average and Maximum Range: 5.73% average, 8.47% max

• Return Analysis: Best Day +11.72%, Worst Day -16.27%

Overall, INTC is currently very active with large swings.`;

  // Animation timing
  const uiFadeIn = 20;
  const typingStart = 60;
  const typingEnd = 120;
  const sendClick = 135;
  const responseStart = 160;
  const streamDuration = 160;

  // UI fade in
  const uiOpacity = interpolate(frame, [0, uiFadeIn], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Input state
  const typingProgress = interpolate(
    frame,
    [typingStart, typingEnd],
    [0, query.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleQuery = query.slice(0, Math.floor(typingProgress));

  // Messages state
  const showUserMessage = frame >= sendClick + 15;
  const showAIResponse = frame >= responseStart;
  const streamProgress = interpolate(
    frame,
    [responseStart, responseStart + streamDuration],
    [0, response.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleResponse = response.slice(0, Math.floor(streamProgress));

  // Build messages array
  const messages: Message[] = useMemo(() => {
    const msgs: Message[] = [];
    if (showUserMessage) {
      msgs.push({
        id: "user-1",
        role: "user",
        content: query,
        timestamp: new Date(),
      });
    }
    if (showAIResponse) {
      msgs.push({
        id: "ai-1",
        role: "assistant",
        content: visibleResponse,
        timestamp: new Date(),
        isStreaming: streamProgress < response.length,
      });
    }
    return msgs;
  }, [showUserMessage, showAIResponse, visibleResponse, streamProgress]);

  return (
    <AbsoluteFill style={{ opacity: uiOpacity }} className="dark">
      <ChatLayout
        messages={messages}
        inputValue={frame >= sendClick ? "" : visibleQuery}
        isAIResponding={showAIResponse && streamProgress < response.length}
      />
    </AbsoluteFill>
  );
};

// =============================================================================
// Scene 3: NVDA/AMD Comparison
// =============================================================================
const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const query = "Compare NVDA and AMD this month";
  const response = `Here's a side-by-side comparison for January 2026:

NVDA: +12.4% price change, 48.2M avg volume, RSI 67.3
AMD: +8.7% price change, 62.1M avg volume, RSI 58.9

NVDA shows stronger momentum with higher RSI, while AMD has higher trading volume.`;

  const typingStart = 30;
  const typingEnd = 80;
  const sendClick = 95;
  const responseStart = 120;
  const streamDuration = 100;

  const typingProgress = interpolate(
    frame,
    [typingStart, typingEnd],
    [0, query.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleQuery = query.slice(0, Math.floor(typingProgress));

  const showUserMessage = frame >= sendClick + 15;
  const showAIResponse = frame >= responseStart;
  const streamProgress = interpolate(
    frame,
    [responseStart, responseStart + streamDuration],
    [0, response.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleResponse = response.slice(0, Math.floor(streamProgress));

  const messages: Message[] = useMemo(() => {
    const msgs: Message[] = [];
    if (showUserMessage)
      msgs.push({
        id: "user-2",
        role: "user",
        content: query,
        timestamp: new Date(),
      });
    if (showAIResponse)
      msgs.push({
        id: "ai-2",
        role: "assistant",
        content: visibleResponse,
        timestamp: new Date(),
        isStreaming: streamProgress < response.length,
      });
    return msgs;
  }, [showUserMessage, showAIResponse, visibleResponse, streamProgress]);

  return (
    <AbsoluteFill className="dark">
      <ChatLayout
        messages={messages}
        inputValue={frame >= sendClick ? "" : visibleQuery}
        isAIResponding={showAIResponse && streamProgress < response.length}
      />
    </AbsoluteFill>
  );
};

// =============================================================================
// Scene 4: Quick montage
// =============================================================================
const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const queries = [
    {
      q: "What's moving oil prices?",
      a: "Crude oil up 2.1% on Middle East tensions. WTI at $78.42, Brent at $82.15. Inventory data shows -4.2M barrel draw.",
    },
    {
      q: "Unusual options activity",
      a: "Detecting unusual volume: TSLA $280 calls at 3.2x normal. SPY $490 puts heavy flow. META bullish sweeps at $520.",
    },
    {
      q: "Summarize the market today",
      a: "S&P 500 +0.8%, NASDAQ +1.2%, Dow +0.4%. Tech leading, semiconductors up 2.3%. VIX at 14.2.",
    },
  ];

  const queryDuration = 70;

  return (
    <AbsoluteFill className="dark">
      {queries.map((item, index) => {
        const queryStart = index * queryDuration;
        const queryEnd = queryStart + queryDuration;
        if (frame < queryStart || frame >= queryEnd) return null;

        const localFrame = frame - queryStart;
        const opacity = interpolate(
          localFrame,
          [0, 12, queryDuration - 12, queryDuration],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" }
        );
        const responseProgress = interpolate(
          localFrame,
          [18, 55],
          [0, item.a.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const messages: Message[] = [
          {
            id: `user-${index}`,
            role: "user",
            content: item.q,
            timestamp: new Date(),
          },
          {
            id: `ai-${index}`,
            role: "assistant",
            content: item.a.slice(0, Math.floor(responseProgress)),
            timestamp: new Date(),
            isStreaming: responseProgress < item.a.length,
          },
        ];

        return (
          <AbsoluteFill key={index} style={{ opacity }}>
            <ChatLayout
              messages={messages}
              inputValue=""
              isAIResponding={responseProgress < item.a.length}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// Scene 5: Logo and CTA
// =============================================================================
const Scene5: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const urlOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(frame, [25, 40], [15, 0], {
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  const glowIntensity = interpolate(
    frame,
    [60, 90, 120, 150],
    [0.3, 0.5, 0.3, 0.5],
    { extrapolateRight: "extend" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
        background: `radial-gradient(ellipse at 50% 40%, rgba(168, 85, 247, ${glowIntensity * 0.3}) 0%, ${COLORS.background} 60%)`,
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          filter: `drop-shadow(0 0 ${60 * glowIntensity}px rgba(168, 85, 247, 0.6))`,
        }}
      >
        <Img
          src={staticFile("pelican-logo-transparent.png")}
          style={{ width: 160, height: 160, objectFit: "contain" }}
        />
      </div>
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 72,
          color: COLORS.foreground,
          letterSpacing: "0.1em",
          margin: 0,
          opacity: logoOpacity,
          textShadow: `0 0 ${40 * glowIntensity}px rgba(168, 85, 247, 0.5)`,
        }}
      >
        PELICAN
      </h1>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28,
          color: COLORS.primary,
          margin: 0,
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
          letterSpacing: "0.05em",
        }}
      >
        pelicantrading.ai
      </p>
      <div
        style={{
          marginTop: 16,
          opacity: ctaOpacity,
          transform: `scale(${Math.max(0, Math.min(ctaScale, 1))})`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, #1DA1C4 0%, ${COLORS.primary} 50%, #178BA8 100%)`,
            padding: "16px 44px",
            borderRadius: 8,
            boxShadow: `0 0 ${35 * glowIntensity}px rgba(168, 85, 247, 0.5)`,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              color: "#fff",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Sign up now
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// Layout component that uses ACTUAL imported components
// =============================================================================
interface ChatLayoutProps {
  messages: Message[];
  inputValue: string;
  isAIResponding: boolean;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  inputValue,
  isAIResponding,
}) => {
  // Mock handlers (no-op for video)
  const noop = () => {};

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* Sidebar - ACTUAL component */}
      <ConversationSidebar
        onConversationSelect={noop}
        onNewConversation={noop}
      />

      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.background,
        }}
      >
        {/* Header - ACTUAL component */}
        <ChatHeader isOnline />

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* Corner brackets decoration */}
          <CornerBrackets />

          {/* Messages - using ACTUAL MessageBubble component */}
          <div style={{ padding: "24px 0" }}>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={message.isStreaming}
              />
            ))}
          </div>
        </div>

        {/* Input - ACTUAL component */}
        <div style={{ padding: "16px 32px" }}>
          <ChatInput
            onSendMessage={noop}
            disabled={false}
            isAIResponding={isAIResponding}
            placeholder="Ask Pelican anything..."
          />
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Helper components
// =============================================================================
const CornerBrackets: React.FC = () => {
  const positions = [
    { top: 16, left: 16, borderWidth: "2px 0 0 2px" },
    { top: 16, right: 16, borderWidth: "2px 2px 0 0" },
    { bottom: 80, left: 16, borderWidth: "0 0 2px 2px" },
    { bottom: 80, right: 16, borderWidth: "0 2px 2px 0" },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          style={
            {
              position: "absolute",
              width: 28,
              height: 28,
              borderColor: COLORS.primary,
              borderStyle: "solid",
              opacity: 0.35,
              ...pos,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
};
