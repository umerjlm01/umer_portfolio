"use client"

import { useEffect, useState } from "react"

/**
 * Tracks which section is currently in view so the nav (bottom tabs on phone,
 * sidebar on iPad) can highlight the active item. The scroll root is the
 * #phone-content container (the device screen scrolls, not the body).
 */
export function useScrollSpy(ids: readonly string[], rootId: string | null): string {
  const [active, setActive] = useState(ids[0] ?? "")

  useEffect(() => {
    const root = rootId ? document.getElementById(rootId) : null

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      {
        root,
        rootMargin: "-15% 0px -65% 0px",
        threshold: [0, 0.2, 0.5, 1],
      }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids, rootId])

  return active
}
