"use client"

import { useEffect, useState } from "react"

export type DeviceMode = "phone" | "ipad"
export type Orientation = "portrait" | "landscape"

export interface DeviceState {
  mode: DeviceMode
  orientation: Orientation
}

/**
 * Single source of truth for the device layout. Driven by matchMedia so it
 * re-computes live on resize and orientationchange with no reload.
 *
 * The ORIGINAL two-device concept:
 *   - phone: viewport width < 768px  → mobile phone frame (portrait, bottom tabs)
 *   - ipad:  viewport width ≥ 768px  → iPad frame
 *       · landscape → sidebar + sticky 3D phone showcase (desktop-split)
 *       · portrait  → bottom tabs + single column
 *
 * Orientation: portrait = height > width; landscape = width ≥ height.
 *
 * SSR-safe: the initial state is a stable default (phone/portrait) that matches
 * the server render. The real viewport is only read inside useEffect (after
 * mount), so there is never a hydration mismatch.
 */
const PHONE_MAX = 767

/** Stable default used for SSR + the first client render (avoids hydration mismatch). */
const SSR_DEFAULT: DeviceState = { mode: "phone", orientation: "portrait" }

function read(): DeviceState {
  const w = window.innerWidth
  const h = window.innerHeight
  const mode: DeviceMode = w < 768 ? "phone" : "ipad"
  const orientation: Orientation = w >= h ? "landscape" : "portrait"
  return { mode, orientation }
}

export function useDeviceMode(): DeviceState {
  const [state, setState] = useState<DeviceState>(SSR_DEFAULT)

  useEffect(() => {
    // Use matchMedia for both width breakpoints and orientation so the browser
    // handles cross-browser resize/orientationchange timing for us.
    const widthMq = window.matchMedia(`(min-width: ${PHONE_MAX + 1}px)`)
    const orientationMq = window.matchMedia("(orientation: landscape)")

    const update = () => setState(read())

    widthMq.addEventListener("change", update)
    orientationMq.addEventListener("change", update)
    window.addEventListener("resize", update)

    update() // set the real viewport mode now that we're mounted
    return () => {
      widthMq.removeEventListener("change", update)
      orientationMq.removeEventListener("change", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return state
}
