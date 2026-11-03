"use client"

import { useSyncExternalStore } from "react"

const noopSubscribe = () => () => {}

/** Heuristic for low-end devices — skip heavy 3D extras there. */
export function useIsLowEndDevice(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const nav = navigator as Navigator & { deviceMemory?: number }
      const cores = nav.hardwareConcurrency ?? 4
      const memory = nav.deviceMemory ?? 4
      return cores <= 2 || memory <= 2
    },
    () => false
  )
}

/** WebGL support probe (client snapshot; assumed available during SSR). */
export function useWebGLAvailable(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    webglAvailable,
    () => true
  )
}

/** WebGL support probe. */
export function webglAvailable(): boolean {
  if (typeof window === "undefined") return true
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}
