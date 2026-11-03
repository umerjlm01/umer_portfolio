"use client"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { NAV_IDS, NAV_ITEMS, scrollToSection } from "./bottom-tabs"

/** iPad-style left sidebar navigation (landscape tablet + desktop). */
export function Sidebar() {
  const active = useScrollSpy(NAV_IDS, "phone-content")

  return (
    <nav className="sidebar" aria-label="Section navigation">
      <div className="sidebar-brand">
        <span className="sidebar-brand-dot" />
      </div>
      <div className="sidebar-links">
        {NAV_ITEMS.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              className="sidebar-link"
              data-active={isActive}
              onClick={() => scrollToSection(t.id)}
              aria-label={t.label}
              aria-current={isActive ? "page" : undefined}
            >
              <t.icon className="sidebar-link-icon" strokeWidth={2} aria-hidden />
              <span className="sidebar-link-label">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
