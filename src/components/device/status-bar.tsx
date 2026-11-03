"use client"

import { useClock } from "@/hooks/use-clock"

/** Inline status icons (signal/wifi/battery) — iOS-style status bar. */
function StatusIcons() {
  return (
    <div className="flex items-center gap-1.5" style={{ color: "var(--fg)" }}>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden>
        <rect x="0" y="7" width="3" height="4" rx="0.5" fill="currentColor" />
        <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="currentColor" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="currentColor" />
        <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor" />
      </svg>
      {/* wifi */}
      <svg width="16" height="11" viewBox="0 0 16 12" fill="none" aria-hidden>
        <path
          d="M8 2.2c2.6 0 5 1 6.8 2.6l-1.4 1.6A7.6 7.6 0 0 0 8 4.4 7.6 7.6 0 0 0 2.6 6.4L1.2 4.8A9.8 9.8 0 0 1 8 2.2Z"
          fill="currentColor"
        />
        <path
          d="M8 5.6c1.6 0 3.1.6 4.2 1.6l-1.5 1.6A3.7 3.7 0 0 0 8 7.8c-1 0-2 .4-2.7 1L3.8 7.2A6 6 0 0 1 8 5.6Z"
          fill="currentColor"
        />
        <circle cx="8" cy="10" r="1.4" fill="currentColor" />
      </svg>
      {/* battery */}
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden>
        <rect
          x="0.5"
          y="0.5"
          width="22"
          height="11"
          rx="3"
          stroke="currentColor"
          strokeOpacity="0.5"
        />
        <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
        <rect
          x="24"
          y="3.5"
          width="1.5"
          height="5"
          rx="0.75"
          fill="currentColor"
          fillOpacity="0.5"
        />
      </svg>
    </div>
  )
}

/** Live clock text — isolated so only this leaf re-renders each second. */
export function LiveTime() {
  const clock = useClock()
  return (
    <span className="device-topbar-time" aria-hidden>
      {clock.time}
    </span>
  )
}

/** Phone status bar: live time + status icons. */
export function StatusBar() {
  const clock = useClock()
  return (
    <div className="status-bar" aria-hidden>
      <span>{clock.time}</span>
      <StatusIcons />
    </div>
  )
}

export function StatusIconsOnly() {
  return <StatusIcons />
}
