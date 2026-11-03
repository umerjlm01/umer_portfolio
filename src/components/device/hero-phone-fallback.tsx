"use client"

import { useState } from "react"

type HeroPhoneFallbackProps = {
  screenshot: string
  alt: string
}

export function HeroPhoneFallback({ screenshot, alt }: HeroPhoneFallbackProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="hero-2d-fallback hero-2d-unavailable" role="img" aria-label={alt} />
    )
  }

  return (
    <img
      src={screenshot}
      alt={alt}
      className="hero-2d-fallback"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
