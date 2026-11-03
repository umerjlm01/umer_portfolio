"use client"

const decoded = new Map<string, HTMLImageElement>()
const inflight = new Map<string, Promise<HTMLImageElement | null>>()

export function isPortfolioScreenshot(src: string): boolean {
  return /\.(png|webp)(\?.*)?$/i.test(src)
}

/** Returns a decoded image if already cached. */
export function getCachedScreenshot(src: string): HTMLImageElement | undefined {
  return decoded.get(src)
}

/** Decode and cache a PNG/WebP screenshot (deduped in-flight). */
export async function preloadScreenshot(src: string): Promise<HTMLImageElement | null> {
  if (!isPortfolioScreenshot(src)) return null

  const hit = decoded.get(src)
  if (hit && hit.naturalWidth > 0) return hit

  const pending = inflight.get(src)
  if (pending) return pending

  const promise = (async () => {
    const img = new Image()
    img.decoding = "async"
    img.src = src
    try {
      await img.decode()
    } catch {
      await new Promise<void>((resolve) => {
        if (img.complete) return resolve()
        img.onload = () => resolve()
        img.onerror = () => resolve()
      })
    }
    if (img.naturalWidth === 0) return null
    decoded.set(src, img)
    return img
  })()

  inflight.set(src, promise)
  try {
    return await promise
  } finally {
    inflight.delete(src)
  }
}

export async function preloadProjectScreenshots(urls: string[]): Promise<void> {
  await Promise.all(urls.map((u) => preloadScreenshot(u)))
}

/** Prefetch the WebGL chunk so the hero does not wait on first paint. */
export function warmPhoneCanvasChunk(): void {
  void import("@/components/portfolio/hero-webgl-canvas")
}
