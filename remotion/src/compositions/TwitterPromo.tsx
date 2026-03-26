import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
  Easing,
  Sequence,
} from "remotion";

// Scene timing (in frames at 30fps)
const SCENE_1_START = 0;
const SCENE_1_END = 90; // 0-3s
const SCENE_2_START = 90;
const SCENE_2_END = 450; // 3-15s
const SCENE_3_START = 450;
const SCENE_3_END = 690; // 15-23s
const SCENE_4_START = 690;
const SCENE_4_END = 900; // 23-30s
const SCENE_5_START = 900;
const SCENE_5_END = 1050; // 30-35s

export const TwitterPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ambient background motion
  const bgOffsetX = Math.sin(frame * 0.01) * 5;
  const bgOffsetY = Math.cos(frame * 0.008) * 3;

  return (
    <AbsoluteFill className="video-container">
      {/* Animated grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: `${bgOffsetX}px ${bgOffsetY}px`,
          pointerEvents: "none",
        }}
      />

      {/* Ambient purple glow that shifts */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame * 0.02) * 10}% ${30 + Math.cos(frame * 0.015) * 10}%, rgba(168, 85, 247, 0.12) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Scene 1: Opening text */}
      {frame >= SCENE_1_START && frame < SCENE_1_END && (
        <Scene1 frame={frame - SCENE_1_START} />
      )}

      {/* Scene 2: First chat interaction */}
      {frame >= SCENE_2_START && frame < SCENE_2_END && (
        <Scene2 frame={frame - SCENE_2_START} fps={fps} />
      )}

      {/* Scene 3: Comparison table */}
      {frame >= SCENE_3_START && frame < SCENE_3_END && (
        <Scene3 frame={frame - SCENE_3_START} fps={fps} />
      )}

      {/* Scene 4: Quick montage */}
      {frame >= SCENE_4_START && frame < SCENE_4_END && (
        <Scene4 frame={frame - SCENE_4_START} fps={fps} />
      )}

      {/* Scene 5: Logo and CTA */}
      {frame >= SCENE_5_START && frame <= SCENE_5_END && (
        <Scene5 frame={frame - SCENE_5_START} fps={fps} />
      )}

      {/* Corner brackets - always visible */}
      <CornerBrackets frame={frame} />
    </AbsoluteFill>
  );
};

// Scene 1: Opening text
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
      }}
    >
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 96,
          color: "#f1f5f9",
          textAlign: "center",
          letterSpacing: "0.05em",
          textShadow: "0 0 40px rgba(168, 85, 247, 0.4)",
        }}
      >
        Stop researching.{" "}
        <span style={{ color: "#a855f7" }}>Start asking.</span>
      </h1>
    </AbsoluteFill>
  );
};

// Scene 2: First chat with INTC analysis
const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const query = "how does INTC look?";

  const response = `INTC's current situation presents significant volatility, based on recent analysis from January 10 to January 24, 2026. Here's a breakdown of what's going on:

• Current Volatility: INTC is experiencing high volatility with a daily volatility of 8.30% and an annualized value of 131.8%.

• Average and Maximum Range: The average daily range is 5.73%, while the maximum daily range hit 8.47%.

• Return Analysis:
  - Best Day: +11.72% gain
  - Worst Day: -16.27%
  - Movement Beyond +/-2%: 4 days up, 2 days down

Overall, INTC is currently very active with large swings both upward and downward.`;

  // Timing within scene
  const sceneEnterDuration = 15;
  const inputClickFrame = sceneEnterDuration + 10;
  const typingStartFrame = inputClickFrame + 15;
  const typingDuration = 40;
  const typingEndFrame = typingStartFrame + typingDuration;
  const responseStartFrame = typingEndFrame + 20;
  const streamDuration = 200; // Stream over ~6.6 seconds

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, sceneEnterDuration], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Input field focus animation
  const inputFocused = frame >= inputClickFrame;
  const inputBorderColor = inputFocused
    ? "rgba(168, 85, 247, 0.6)"
    : "rgba(148, 163, 184, 0.2)";

  // Typing animation
  const typingProgress = interpolate(
    frame,
    [typingStartFrame, typingEndFrame],
    [0, query.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleQuery = query.slice(0, Math.floor(typingProgress));
  const isTyping = frame >= typingStartFrame && frame <= typingEndFrame + 10;
  const cursorVisible = isTyping && Math.floor(frame / 8) % 2 === 0;

  // Response streaming
  const streamProgress = interpolate(
    frame,
    [responseStartFrame, responseStartFrame + streamDuration],
    [0, response.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleResponse = response.slice(0, Math.floor(streamProgress));

  // Response container opacity
  const responseOpacity = interpolate(
    frame,
    [responseStartFrame - 10, responseStartFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        padding: "60px 100px",
        opacity: sceneOpacity,
      }}
    >
      {/* Chat interface container */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Input field */}
        <div
          style={{
            background: "rgba(18, 20, 26, 0.8)",
            border: `1px solid ${inputBorderColor}`,
            borderRadius: 12,
            padding: "20px 24px",
            transition: "border-color 0.2s",
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              color: visibleQuery ? "#f1f5f9" : "#64748b",
              display: "flex",
              alignItems: "center",
            }}
          >
            {visibleQuery || "Ask Pelican anything..."}
            {frame >= typingStartFrame && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 26,
                  background: cursorVisible ? "#a855f7" : "transparent",
                  marginLeft: 2,
                }}
              />
            )}
          </div>
        </div>

        {/* AI Response */}
        {frame >= responseStartFrame - 10 && (
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              opacity: responseOpacity,
            }}
          >
            {/* Avatar */}
            <div style={{ flexShrink: 0, width: 40, height: 40 }}>
              <Img
                src={staticFile("pelican-logo-transparent.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {/* Response text */}
            <div
              style={{
                flex: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: 20,
                lineHeight: 1.7,
                color: "#e2e8f0",
              }}
            >
              <HighlightedText text={visibleResponse} />
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Comparison table
const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const query = "Compare NVDA and AMD this month";

  // Timing
  const sceneEnterDuration = 15;
  const typingStartFrame = sceneEnterDuration + 20;
  const typingDuration = 35;
  const typingEndFrame = typingStartFrame + typingDuration;
  const tableStartFrame = typingEndFrame + 25;

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, sceneEnterDuration], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Typing
  const typingProgress = interpolate(
    frame,
    [typingStartFrame, typingEndFrame],
    [0, query.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleQuery = query.slice(0, Math.floor(typingProgress));
  const isTyping = frame >= typingStartFrame && frame <= typingEndFrame + 10;
  const cursorVisible = isTyping && Math.floor(frame / 8) % 2 === 0;

  // Table animations
  const tableOpacity = interpolate(
    frame,
    [tableStartFrame, tableStartFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const tableY = interpolate(
    frame,
    [tableStartFrame, tableStartFrame + 20],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Row stagger
  const getRowOpacity = (rowIndex: number) =>
    interpolate(
      frame,
      [tableStartFrame + 15 + rowIndex * 8, tableStartFrame + 30 + rowIndex * 8],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  const tableData = [
    { metric: "Price Change", nvda: "+12.4%", amd: "+8.7%" },
    { metric: "Volume (Avg)", nvda: "48.2M", amd: "62.1M" },
    { metric: "RSI (14)", nvda: "67.3", amd: "58.9" },
    { metric: "52W High %", nvda: "-8.2%", amd: "-15.4%" },
  ];

  return (
    <AbsoluteFill
      style={{
        padding: "60px 100px",
        opacity: sceneOpacity,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Input field */}
        <div
          style={{
            background: "rgba(18, 20, 26, 0.8)",
            border: "1px solid rgba(168, 85, 247, 0.5)",
            borderRadius: 12,
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              color: "#f1f5f9",
              display: "flex",
              alignItems: "center",
            }}
          >
            {visibleQuery}
            {frame >= typingStartFrame && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 26,
                  background: cursorVisible ? "#a855f7" : "transparent",
                  marginLeft: 2,
                }}
              />
            )}
          </div>
        </div>

        {/* AI Response with table */}
        {frame >= tableStartFrame - 10 && (
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              opacity: tableOpacity,
              transform: `translateY(${tableY}px)`,
            }}
          >
            {/* Avatar */}
            <div style={{ flexShrink: 0, width: 40, height: 40 }}>
              <Img
                src={staticFile("pelican-logo-transparent.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {/* Table container */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 20,
                  color: "#e2e8f0",
                  marginBottom: 20,
                  opacity: getRowOpacity(0),
                }}
              >
                Here's a side-by-side comparison of NVDA and AMD for January 2026:
              </p>

              {/* Comparison table */}
              <div
                style={{
                  background: "rgba(18, 20, 26, 0.6)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    background: "rgba(168, 85, 247, 0.15)",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
                    opacity: getRowOpacity(0),
                  }}
                >
                  <div style={headerCellStyle}>Metric</div>
                  <div style={headerCellStyle}>NVDA</div>
                  <div style={headerCellStyle}>AMD</div>
                </div>

                {/* Data rows */}
                {tableData.map((row, i) => (
                  <div
                    key={row.metric}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      borderBottom:
                        i < tableData.length - 1
                          ? "1px solid rgba(148, 163, 184, 0.1)"
                          : "none",
                      opacity: getRowOpacity(i + 1),
                    }}
                  >
                    <div style={cellStyle}>{row.metric}</div>
                    <div style={{ ...cellStyle, ...dataCellStyle }}>
                      {row.nvda}
                    </div>
                    <div style={{ ...cellStyle, ...dataCellStyle }}>
                      {row.amd}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 18,
                  color: "#94a3b8",
                  marginTop: 16,
                  opacity: getRowOpacity(5),
                }}
              >
                <span style={{ color: "#a855f7", fontWeight: 600 }}>NVDA</span>{" "}
                shows stronger momentum with higher RSI and better price
                performance, while{" "}
                <span style={{ color: "#a855f7", fontWeight: 600 }}>AMD</span>{" "}
                has higher trading volume.
              </p>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Quick montage
const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const queries = [
    {
      question: "What's moving oil prices?",
      answer:
        "Oil is up 2.1% today on Middle East tensions and OPEC+ production cut signals. WTI crude at $78.42, Brent at $82.15...",
    },
    {
      question: "Unusual options activity",
      answer:
        "Detecting unusual volume in TSLA $280 calls (exp Feb 7), SPY $490 puts seeing 3x normal volume, META showing bullish sweep...",
    },
    {
      question: "Summarize the market today",
      answer:
        "S&P 500 +0.8%, NASDAQ +1.2%, Dow +0.4%. Tech leading with semiconductors up 2.3%. VIX down to 14.2. Treasury yields steady...",
    },
  ];

  // Each query gets ~70 frames (2.33 seconds)
  const queryDuration = 70;

  return (
    <AbsoluteFill style={{ padding: "80px 100px" }}>
      {queries.map((q, index) => {
        const queryStart = index * queryDuration;
        const queryEnd = queryStart + queryDuration;

        if (frame < queryStart || frame >= queryEnd) return null;

        const localFrame = frame - queryStart;

        // Quick pop in
        const opacity = interpolate(localFrame, [0, 8, queryDuration - 10, queryDuration], [0, 1, 1, 0], {
          extrapolateRight: "clamp",
        });

        const scale = interpolate(localFrame, [0, 10], [0.95, 1], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.5)),
        });

        // Response streams in quickly
        const responseProgress = interpolate(
          localFrame,
          [15, 55],
          [0, q.answer.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <AbsoluteFill
            key={index}
            style={{
              opacity,
              transform: `scale(${scale})`,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                maxWidth: 1000,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {/* Question bubble */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: "rgba(168, 85, 247, 0.2)",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    borderRadius: 12,
                    padding: "16px 24px",
                    maxWidth: "70%",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 24,
                      color: "#f1f5f9",
                      margin: 0,
                    }}
                  >
                    {q.question}
                  </p>
                </div>
              </div>

              {/* Response */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 40, height: 40 }}>
                  <Img
                    src={staticFile("pelican-logo-transparent.png")}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 22,
                    color: "#e2e8f0",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  <HighlightedText
                    text={q.answer.slice(0, Math.floor(responseProgress))}
                  />
                </p>
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// Scene 5: Logo and CTA
const Scene5: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // URL fade in
  const urlOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const urlY = interpolate(frame, [25, 40], [15, 0], {
    extrapolateRight: "clamp",
  });

  // CTA button
  const ctaOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  // Glow pulse
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
        gap: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          filter: `drop-shadow(0 0 ${50 * glowIntensity}px rgba(168, 85, 247, 0.6))`,
        }}
      >
        <Img
          src={staticFile("pelican-logo-transparent.png")}
          style={{ width: 180, height: 180, objectFit: "contain" }}
        />
      </div>

      {/* Brand name */}
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 80,
          color: "#f1f5f9",
          letterSpacing: "0.1em",
          margin: 0,
          opacity: logoOpacity,
          textShadow: `0 0 ${30 * glowIntensity}px rgba(168, 85, 247, 0.5)`,
        }}
      >
        PELICAN
      </h1>

      {/* URL */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 32,
          color: "#a855f7",
          margin: 0,
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
          letterSpacing: "0.05em",
        }}
      >
        pelicantrading.ai
      </p>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 20,
          opacity: ctaOpacity,
          transform: `scale(${Math.max(0, Math.min(ctaScale, 1))})`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #4A90C4 0%, #2C5F8A 100%)",
            padding: "18px 48px",
            borderRadius: 8,
            boxShadow: `0 0 ${30 * glowIntensity}px rgba(168, 85, 247, 0.4)`,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 24,
              color: "#0a0b0f",
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

// Highlighted text component - highlights numbers in purple
const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  // Regex to match percentages, dollar amounts, and significant numbers
  const highlightPattern =
    /([+-]?\d+\.?\d*%|\$\d+\.?\d*|\d+\.?\d*[MBK]|\d+\.\d+(?!\d))/g;

  const parts = text.split(highlightPattern);

  return (
    <>
      {parts.map((part, i) => {
        const isHighlighted = highlightPattern.test(part);
        // Reset regex lastIndex
        highlightPattern.lastIndex = 0;

        if (isHighlighted) {
          return (
            <span
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#a855f7",
                fontWeight: 600,
              }}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

// Corner brackets component
const CornerBrackets: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 0.5], {
    extrapolateRight: "clamp",
  });

  const positions = [
    { top: 30, left: 30, borderWidth: "2px 0 0 2px" },
    { top: 30, right: 30, borderWidth: "2px 2px 0 0" },
    { bottom: 30, left: 30, borderWidth: "0 0 2px 2px" },
    { bottom: 30, right: 30, borderWidth: "0 2px 2px 0" },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 35,
            height: 35,
            borderColor: "#a855f7",
            borderStyle: "solid",
            opacity,
            ...pos,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};

// Shared styles
const headerCellStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 16,
  fontWeight: 600,
  color: "#a855f7",
  padding: "14px 20px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const cellStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 18,
  color: "#e2e8f0",
  padding: "14px 20px",
};

const dataCellStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  color: "#a855f7",
  fontWeight: 500,
};
