"use client"

import { Briefcase, Cpu, Home, Layers, Mail } from "lucide-react"
import { useScrollSpy } from "@/hooks/use-scroll-spy"

export const NAV_ITEMS = [
  { id: "top", label: "Home", icon: Home },
  { id: "projects", label: "Work", icon: Layers },
  { id: "experience", label: "XP", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "contact", label: "Contact", icon: Mail },
] as const

export const NAV_IDS = NAV_ITEMS.map((t) => t.id)

/** Scroll a section into view inside the device screen. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const container = document.getElementById("phone-content")
  if (container) {
    const top = el.offsetTop - 8
    container.scrollTo({ top, behavior: "smooth" })
  } else {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

/** Phone bottom tab bar — absolute inside the device screen. */
export function BottomTabs() {
  const active = useScrollSpy(NAV_IDS, "phone-content")

  return (
    <nav className="tab-bar" aria-label="Section navigation">
      {NAV_ITEMS.map((t) => {
        const isActive = active === t.id
        return (
          <button
            key={t.id}
            className="tab-btn"
            data-active={isActive}
            onClick={() => scrollToSection(t.id)}
            aria-label={t.label}
            aria-current={isActive ? "page" : undefined}
          >
            <t.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
            <span>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
