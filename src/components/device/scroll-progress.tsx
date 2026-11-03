"use client"

import { useEffect, useRef } from "react"

/**
 * A thin laser-crimson progress bar showing scroll progress.
 * It tracks the #phone-content container (the device screen scrolls).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = document.getElementById("phone-content")
    if (!el) return

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / Math.max(1, max) : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="scroll-progress-track" role="progressbar" aria-label="Scroll progress">
      <div
        ref={barRef}
        className="scroll-progress-bar"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 8px rgba(212,21,20,0.6)" }}
      />
    </div>
  )
}
