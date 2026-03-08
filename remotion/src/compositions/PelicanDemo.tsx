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
import React from "react";

// ========================================
// CONSTANTS
// ========================================

const USER_QUERY = "how does INTC look?";

const AI_RESPONSE_PARTS = [
  { text: "INTC's current situation presents significant volatility, based on recent analysis from January 10 to January 24, 2026.", isData: false },
  { text: "\n\n", isData: false },
  { text: "- Current Volatility: ", isData: false },
  { text: "8.30%", isData: true },
  { text: " daily, ", isData: false },
  { text: "131.8%", isData: true },
  { text: " annualized", isData: false },
  { text: "\n", isData: false },
  { text: "- Daily Range: 5.73% average, 8.47% max", isData: false },
  { text: "\n", isData: false },
  { text: "- Best Day: ", isData: false },
  { text: "+11.72%", isData: true },
  { text: "\n", isData: false },
  { text: "- Worst Day: ", isData: false },
  { text: "-16.27%", isData: true },
  { text: "\n\n", isData: false },
  { text: "Overall, INTC is very active with large swings in both directions.", isData: false },
];

// Colors from the actual app
const COLORS = {
  bgPrimary: "#0a0b0f",
  bgSidebar: "#0f1115",
  bgCard: "#12141a",
  borderColor: "rgba(148, 163, 184, 0.1)",
  accentPurple: "#a855f7",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  greenOnline: "#22c55e",
};

// ========================================
// TIMING (in frames at 30fps)
// ========================================

const FPS = 30;
const TOTAL_DURATION = 15 * FPS; // 450 frames

// 0-2s: Full UI fades in
const UI_FADE_START = 0;
const UI_FADE_END = 60; // 2s

// 2-5s: Cursor moves to input, text types
const CURSOR_START = 60; // 2s
const TYPING_START = 75; // 2.5s
const TYPING_END = 150; // 5s

// 5-6s: Send click, user message appears
const SEND_CLICK = 150; // 5s
const USER_MESSAGE_APPEAR = 160; // 5.33s

// 6-13s: AI response streams
const AI_RESPONSE_START = 180; // 6s
const AI_RESPONSE_END = 390; // 13s

// 13-15s: Pause, then fade to black with CTA
const FADE_TO_BLACK_START = 390; // 13s
const CTA_APPEAR = 405; // 13.5s

// ========================================
// COMPONENT: Sidebar
// ========================================

const Sidebar: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <div
      style={{
        width: 280,
        height: "100%",
        background: COLORS.bgSidebar,
        borderRight: `1px solid ${COLORS.borderColor}`,
        display: "flex",
        flexDirection: "column",
        opacity,
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: `1px solid ${COLORS.borderColor}` }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Img
            src={staticFile("pelican-logo-transparent.png")}
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: COLORS.accentPurple,
            }}
          >
            PelicanAI
          </span>
        </div>

        {/* New Chat Button */}
        <button
          style={{
            width: "100%",
            height: 40,
            background: "linear-gradient(to right, #1DA1C4, #178BA8, #1DA1C4)",
            border: "none",
            borderRadius: 8,
            color: "white",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          New chat
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.borderColor}` }}>
        <div
          style={{
            height: 40,
            background: "rgba(15, 17, 21, 0.5)",
            border: `1px solid ${COLORS.borderColor}`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            color: COLORS.textMuted,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
          }}
        >
          <SearchIcon />
          <span style={{ marginLeft: 8, opacity: 0.6 }}>Search conversations...</span>
        </div>
      </div>

      {/* Empty state */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <MessageSquareIcon style={{ width: 32, height: 32, color: COLORS.textMuted, opacity: 0.2, marginBottom: 8 }} />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: COLORS.textMuted,
            opacity: 0.6,
            margin: 0,
          }}
        >
          No conversations yet
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: COLORS.textMuted,
            opacity: 0.4,
            margin: "4px 0 0 0",
          }}
        >
          Click "New chat" to start
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px", borderTop: `1px solid ${COLORS.borderColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Account button */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(168, 85, 247, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserIcon style={{ width: 16, height: 16, color: COLORS.accentPurple }} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: COLORS.textPrimary,
                  margin: 0,
                }}
              >
                Account
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  color: COLORS.textMuted,
                  margin: 0,
                }}
              >
                View profile
              </p>
            </div>
          </div>
          {/* Settings icon */}
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsIcon style={{ width: 16, height: 16, color: COLORS.textMuted }} />
          </div>
          {/* Logout icon */}
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOutIcon style={{ width: 16, height: 16, color: COLORS.textMuted }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// COMPONENT: Chat Header
// ========================================

const ChatHeader: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <div
      style={{
        padding: "16px 24px",
        background: "rgba(10, 11, 15, 0.95)",
        borderBottom: `1px solid ${COLORS.borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Logo with online indicator */}
        <div style={{ position: "relative" }}>
          <Img
            src={staticFile("pelican-logo-transparent.png")}
            style={{ width: 32, height: 32, borderRadius: 8 }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: COLORS.greenOnline,
              border: `2px solid ${COLORS.bgPrimary}`,
            }}
          />
        </div>

        <div>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 18,
              color: COLORS.textPrimary,
              margin: 0,
            }}
          >
            Pelican AI
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                background: "rgba(148, 163, 184, 0.1)",
                borderRadius: 9999,
                fontSize: 12,
                color: COLORS.textSecondary,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <ZapIcon style={{ width: 12, height: 12 }} />
              Elite Trading Assistant
            </div>
            <span
              style={{
                fontSize: 12,
                color: COLORS.textMuted,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconButton icon={<HomeIcon />} />
        <IconButton icon={<SettingsIcon />} />
        <IconButton icon={<MoreVerticalIcon />} />
      </div>
    </div>
  );
};

const IconButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div
    style={{
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
    }}
  >
    {icon}
  </div>
);

// ========================================
// COMPONENT: Chat Input
// ========================================

const ChatInput: React.FC<{
  opacity: number;
  text: string;
  showCursor: boolean;
  isFocused: boolean;
  isSending: boolean;
}> = ({ opacity, text, showCursor, isFocused, isSending }) => {
  return (
    <div style={{ padding: "16px 24px", opacity }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          background: COLORS.bgCard,
          borderRadius: 16,
          border: isFocused
            ? `1px solid rgba(168, 85, 247, 0.6)`
            : `1px solid ${COLORS.borderColor}`,
          boxShadow: isFocused
            ? "0 0 0 4px rgba(168, 85, 247, 0.12)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          minHeight: 56,
          transition: "all 0.2s",
        }}
      >
        {/* Paperclip button */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PaperclipIcon style={{ width: 20, height: 20, color: COLORS.textMuted }} />
        </div>

        {/* Input text */}
        <div
          style={{
            flex: 1,
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            color: text ? COLORS.textPrimary : COLORS.textMuted,
            display: "flex",
            alignItems: "center",
          }}
        >
          {text || "Ask Pelican anything..."}
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 20,
                background: COLORS.accentPurple,
                marginLeft: 1,
              }}
            />
          )}
        </div>

        {/* Send button */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: isSending || text ? COLORS.accentPurple : "rgba(148, 163, 184, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isSending ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s",
          }}
        >
          <SendIcon
            style={{
              width: 20,
              height: 20,
              color: isSending || text ? COLORS.bgPrimary : COLORS.textMuted,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ========================================
// COMPONENT: User Message
// ========================================

const UserMessage: React.FC<{ text: string; opacity: number; translateY: number }> = ({
  text,
  opacity,
  translateY,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 32,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ maxWidth: "70%" }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: COLORS.textPrimary,
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

// ========================================
// COMPONENT: AI Message
// ========================================

const AIMessage: React.FC<{
  visibleLength: number;
  opacity: number;
  translateY: number;
}> = ({ visibleLength, opacity, translateY }) => {
  // Calculate which parts to show based on visibleLength
  let totalLength = 0;
  const visibleParts: Array<{ text: string; isData: boolean }> = [];

  for (const part of AI_RESPONSE_PARTS) {
    if (totalLength >= visibleLength) break;

    const remainingLength = visibleLength - totalLength;
    if (part.text.length <= remainingLength) {
      visibleParts.push(part);
      totalLength += part.text.length;
    } else {
      visibleParts.push({ text: part.text.slice(0, remainingLength), isData: part.isData });
      totalLength += remainingLength;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Avatar */}
      <Img
        src={staticFile("pelican-logo-transparent.png")}
        style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }}
      />

      {/* Message content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: COLORS.textPrimary,
            whiteSpace: "pre-wrap",
          }}
        >
          {visibleParts.map((part, i) => (
            <span
              key={i}
              style={{
                fontFamily: part.isData ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                color: part.isData ? COLORS.accentPurple : COLORS.textPrimary,
                fontWeight: part.isData ? 600 : 400,
              }}
            >
              {part.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================
// COMPONENT: End Screen CTA
// ========================================

const EndScreenCTA: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bgPrimary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {/* Logo */}
      <Img
        src={staticFile("pelican-logo-transparent.png")}
        style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 24 }}
      />

      {/* URL */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.textPrimary,
          margin: 0,
          marginBottom: 16,
        }}
      >
        pelicantrading.ai
      </p>

      {/* CTA */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 24,
          fontWeight: 500,
          color: COLORS.accentPurple,
          margin: 0,
        }}
      >
        Sign up now
      </p>
    </AbsoluteFill>
  );
};

// ========================================
// MAIN COMPOSITION
// ========================================

export const PelicanDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ========================================
  // ANIMATIONS
  // ========================================

  // 0-2s: UI fade in
  const uiOpacity = interpolate(frame, [UI_FADE_START, UI_FADE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 2-5s: Typing animation
  const typingProgress = interpolate(
    frame,
    [TYPING_START, TYPING_END],
    [0, USER_QUERY.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleUserText = USER_QUERY.slice(0, Math.floor(typingProgress));

  // Cursor blink
  const isTypingPhase = frame >= TYPING_START && frame <= TYPING_END + 10;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;
  const showCursor = isTypingPhase && cursorBlink;
  const isFocused = frame >= CURSOR_START && frame < SEND_CLICK;

  // Send button press
  const isSending = frame >= SEND_CLICK && frame < SEND_CLICK + 5;

  // 5-6s: User message appears
  const userMessageOpacity = interpolate(
    frame,
    [USER_MESSAGE_APPEAR, USER_MESSAGE_APPEAR + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const userMessageY = interpolate(
    frame,
    [USER_MESSAGE_APPEAR, USER_MESSAGE_APPEAR + 15],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Clear input after send
  const inputText = frame >= SEND_CLICK ? "" : visibleUserText;

  // 6-13s: AI response streams
  const totalAILength = AI_RESPONSE_PARTS.reduce((sum, part) => sum + part.text.length, 0);
  const aiVisibleLength = interpolate(
    frame,
    [AI_RESPONSE_START, AI_RESPONSE_END],
    [0, totalAILength],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const aiMessageOpacity = interpolate(
    frame,
    [AI_RESPONSE_START, AI_RESPONSE_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const aiMessageY = interpolate(
    frame,
    [AI_RESPONSE_START, AI_RESPONSE_START + 15],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // 13-15s: Fade to black with CTA
  const fadeToBlackOpacity = interpolate(
    frame,
    [FADE_TO_BLACK_START, FADE_TO_BLACK_START + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const ctaOpacity = interpolate(frame, [CTA_APPEAR, CTA_APPEAR + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Show user message only after it's sent
  const showUserMessage = frame >= USER_MESSAGE_APPEAR;
  const showAIMessage = frame >= AI_RESPONSE_START;

  return (
    <AbsoluteFill style={{ background: COLORS.bgPrimary, fontFamily: "'Inter', sans-serif" }}>
      {/* Main chat interface */}
      <div style={{ display: "flex", height: "100%", opacity: 1 - fadeToBlackOpacity }}>
        {/* Sidebar */}
        <Sidebar opacity={uiOpacity} />

        {/* Main chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <ChatHeader opacity={uiOpacity} />

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: "32px 80px",
              overflowY: "auto",
              opacity: uiOpacity,
            }}
          >
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {/* User message */}
              {showUserMessage && (
                <UserMessage
                  text={USER_QUERY}
                  opacity={userMessageOpacity}
                  translateY={userMessageY}
                />
              )}

              {/* AI message */}
              {showAIMessage && (
                <AIMessage
                  visibleLength={aiVisibleLength}
                  opacity={aiMessageOpacity}
                  translateY={aiMessageY}
                />
              )}
            </div>
          </div>

          {/* Input */}
          <ChatInput
            opacity={uiOpacity}
            text={inputText}
            showCursor={showCursor}
            isFocused={isFocused}
            isSending={isSending}
          />
        </div>
      </div>

      {/* End screen CTA */}
      <EndScreenCTA opacity={fadeToBlackOpacity * ctaOpacity} />

      {/* Corner brackets */}
      <CornerBrackets frame={frame} opacity={1 - fadeToBlackOpacity} />
    </AbsoluteFill>
  );
};

// ========================================
// CORNER BRACKETS
// ========================================

const CornerBrackets: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const bracketOpacity =
    interpolate(frame, [0, 30], [0, 0.4], { extrapolateRight: "clamp" }) * opacity;

  const bracketStyle: React.CSSProperties = {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: COLORS.accentPurple,
    borderStyle: "solid",
    opacity: bracketOpacity,
  };

  return (
    <>
      <div style={{ ...bracketStyle, top: 30, left: 30, borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...bracketStyle, top: 30, right: 30, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...bracketStyle, bottom: 30, left: 30, borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...bracketStyle, bottom: 30, right: 30, borderWidth: "0 2px 2px 0" }} />
    </>
  );
};

// ========================================
// ICONS (SVG components matching Lucide icons)
// ========================================

const SearchIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MessageSquareIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogOutIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ZapIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const HomeIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={COLORS.textMuted}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MoreVerticalIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={COLORS.textMuted}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const PaperclipIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const SendIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
