"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#0a0a0f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily:
          "'Geist Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 700,
          background: "linear-gradient(135deg, #1DA1C4, #178BA8)",
          marginBottom: "2rem",
        }}
      >
        CA
      </div>

      <h1
        style={{
          color: "#e8e8ed",
          fontSize: "1.875rem",
          fontWeight: 600,
          margin: "0 0 0.75rem 0",
          letterSpacing: "-0.01em",
        }}
      >
        Page not found
      </h1>

      <p
        style={{
          color: "#9898a6",
          fontSize: "1rem",
          margin: "0 0 2rem 0",
          textAlign: "center",
          maxWidth: "28rem",
          lineHeight: 1.6,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/chat"
        style={{
          backgroundColor: "#1DA1C4",
          color: "#ffffff",
          padding: "0.625rem 1.5rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          textDecoration: "none",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLElement).style.backgroundColor = "#25BFDF")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLElement).style.backgroundColor = "#1DA1C4")
        }
      >
        Back to Pelican
      </Link>
    </div>
  )
}
