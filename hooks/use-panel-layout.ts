"use client"

import { useState, useEffect, useRef, useCallback, type MouseEvent as ReactMouseEvent } from "react"

const PANEL_MIN = 280
const PANEL_MAX = 700
const PANEL_DEFAULT = 320
const SIDEBAR_DEFAULT = 280
const SIDEBAR_MIN = 220
const SIDEBAR_MAX = 480

export function usePanelLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [tradingPanelCollapsed, setTradingPanelCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT)
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT)

  const isResizing = useRef(false)

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("token_analytix_sidebar_collapsed", String(next))
      return next
    })
  }, [])

  const handleSidebarWidthChange = useCallback((newWidth: number) => {
    setSidebarWidth(newWidth)
    localStorage.setItem("token_analytix_sidebar_width", String(newWidth))
  }, [])

  const handleTradingPanelToggle = useCallback(() => {
    setTradingPanelCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("token_analytix_panel_collapsed", String(next))
      return next
    })
  }, [])

  const expandTradingPanel = useCallback(() => {
    setTradingPanelCollapsed(false)
    localStorage.setItem("token_analytix_panel_collapsed", "false")
  }, [])

  const handleResizeStart = useCallback((e: ReactMouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    const startX = e.clientX
    const startWidth = panelWidth

    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"
    document.querySelectorAll("iframe").forEach((frame) => {
      ;(frame as HTMLElement).style.pointerEvents = "none"
    })

    const onMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return
      // Dragging left increases width because panel is on the right.
      const delta = startX - ev.clientX
      const nextWidth = Math.min(PANEL_MAX, Math.max(PANEL_MIN, startWidth + delta))
      setPanelWidth(nextWidth)
    }

    const onMouseUp = () => {
      isResizing.current = false
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
      document.querySelectorAll("iframe").forEach((frame) => {
        ;(frame as HTMLElement).style.pointerEvents = ""
      })
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      setPanelWidth((width) => {
        localStorage.setItem("token_analytix_panel_width", String(width))
        return width
      })
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }, [panelWidth])

  useEffect(() => {
    setMounted(true)

    const savedSidebar = localStorage.getItem("token_analytix_sidebar_collapsed")
    if (savedSidebar === "true") setSidebarCollapsed(true)

    const savedPanel = localStorage.getItem("token_analytix_panel_collapsed")
    if (savedPanel === "true") setTradingPanelCollapsed(true)

    const savedPanelWidth = localStorage.getItem("token_analytix_panel_width")
    if (savedPanelWidth) {
      const width = Number.parseInt(savedPanelWidth, 10)
      if (!Number.isNaN(width) && width >= PANEL_MIN && width <= PANEL_MAX) {
        setPanelWidth(width)
      }
    }

    const savedSidebarWidth = localStorage.getItem("token_analytix_sidebar_width")
    if (savedSidebarWidth) {
      const width = Number.parseInt(savedSidebarWidth, 10)
      if (!Number.isNaN(width) && width >= SIDEBAR_MIN && width <= SIDEBAR_MAX) {
        setSidebarWidth(width)
      }
    }

    const handleOnline = () => setShowOfflineBanner(false)
    const handleOffline = () => setShowOfflineBanner(true)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return {
    mounted,
    showOfflineBanner,
    setShowOfflineBanner,
    sidebarCollapsed,
    mobileSheetOpen,
    setMobileSheetOpen,
    tradingPanelCollapsed,
    sidebarWidth,
    panelWidth,
    handleSidebarToggle,
    handleSidebarWidthChange,
    handleTradingPanelToggle,
    handleResizeStart,
    expandTradingPanel,
  }
}
