"use client"

import { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import { HeroSceneTech } from "./hero-scene-tech"

export type HeroTechCanvasProps = {
  reducedMotion?: boolean
  accent?: string
}

/** Full-hero WebGL tech backdrop only (phone renders in a separate canvas on top). */
export default function HeroTechCanvas({
  reducedMotion = false,
  accent = "#d41514",
}: HeroTechCanvasProps) {
  const dprMax = useMemo(
    () =>
      Math.min(1.75, typeof window !== "undefined" ? window.devicePixelRatio || 1.75 : 1.75),
    []
  )

  return (
    <Canvas
      className="hero-tech-webgl"
      dpr={[1, dprMax]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0)
        if (reducedMotion) invalidate()
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5.25]} fov={44} near={0.1} far={48} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[4, 5, 3]} intensity={0.85} color="#CDCBCA" />
      <directionalLight position={[-4, -2, -3]} intensity={0.72} color={accent} />
      <pointLight position={[0, 0, 2]} intensity={0.68} color={accent} />
      <HeroSceneTech reduced={reducedMotion} accent={accent} />
    </Canvas>
  )
}
