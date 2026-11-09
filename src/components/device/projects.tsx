"use client"

import { useState, type CSSProperties, type KeyboardEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Smartphone } from "lucide-react"
import { projects, type Project } from "@/lib/portfolio-data"
import { ProjectLinks } from "./project-links"

interface ProjectsProps {
  activeProject: Project
  onSelectProject: (p: Project) => void
}

export function Projects({ activeProject, onSelectProject }: ProjectsProps) {
  /** Expanded details are tap-only — not driven by hero live preview. */
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const stopProp = (e: { stopPropagation: () => void }) => e.stopPropagation()

  const openProject = (p: Project) => {
    onSelectProject(p)
    setExpandedId((prev) => (prev === p.id ? null : p.id))
  }

  const onCardKeyDown = (e: KeyboardEvent<HTMLElement>, p: Project) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openProject(p)
    }
  }

  return (
    <section id="projects" className="projects-section">
      <div className="section-head">
        <div>
          <p className="eyeball">Selected work</p>
          <h2 className="section-title">Projects</h2>
          <p className="section-hint">Tap a card to expand and preview it on the hero.</p>
        </div>
        <span className="section-count">{projects.length} apps</span>
      </div>
      <div className="chrome-divider section-divider" />

      <div className="projects-grid">
        {projects.map((p) => {
          const onScreen = p.id === activeProject.id
          const isExpanded = p.id === expandedId
          const stacksShown = isExpanded ? p.stack : p.stack.slice(0, 4)

          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              onClick={() => openProject(p)}
              onKeyDown={(e) => onCardKeyDown(e, p)}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-label={`${p.shortName}. ${isExpanded ? "Expanded" : "Tap to expand"}`}
              className={
                isExpanded
                  ? "project-card active"
                  : onScreen
                    ? "project-card project-card-onscreen"
                    : "project-card"
              }
              style={
                {
                  ["--card-accent" as string]: p.accent,
                  ...(isExpanded
                    ? {
                        borderColor: `${p.accent}99`,
                        boxShadow: `0 0 0 1px ${p.accent}80, 0 0 26px -6px ${p.accent}55`,
                      }
                    : onScreen
                      ? {
                          borderColor: `${p.accent}55`,
                        }
                      : {}),
                } as CSSProperties
              }
            >
              <div className="project-card-top">
                <div className="project-thumb">
                  <img
                    src={p.screenshot}
                    alt={`${p.name} screenshot`}
                    loading="lazy"
                    className="project-thumb-img"
                  />
                  {onScreen && (
                    <span
                      className="project-thumb-ring"
                      style={{ boxShadow: `inset 0 0 0 2px ${p.accent}` }}
                    />
                  )}
                </div>
                <div className="project-card-body">
                  <div className="project-title-row">
                    <h3 className="project-title">{p.shortName}</h3>
                    {onScreen && <span className="project-featured">On screen</span>}
                  </div>
                  {!isExpanded && (
                    <p className="project-name-full">{p.name}</p>
                  )}
                  <div className="project-platforms">
                    <span className="project-platform">
                      <Smartphone className="project-platform-icon" aria-hidden />
                      {p.category}
                    </span>
                  </div>
                  <div className="project-tech">
                    {stacksShown.map((t) => (
                      <span key={t} className="project-tech-chip">
                        {t}
                      </span>
                    ))}
                    {!isExpanded && p.stack.length > 4 && (
                      <span className="project-tech-more">
                        +{p.stack.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={isExpanded ? "project-chev active" : "project-chev"}
                  aria-hidden
                />
              </div>

              {!isExpanded && (
                <p className="project-expand-hint">
                  Tap for details
                  <ChevronRight className="project-expand-hint-icon" aria-hidden />
                </p>
              )}

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="project-details"
                  >
                    <p className="project-tagline">{p.tagline}</p>
                    <p className="project-desc">{p.description}</p>

                    {p.architectureLine && (
                      <p className="project-architecture">{p.architectureLine}</p>
                    )}

                    <div className="project-highlights-wrap">
                      <p className="project-highlights-title">Highlights</p>
                      <ul className="experience-points project-highlights">
                        {p.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <ProjectLinks project={p} onLinkClick={stopProp} />

                    <span className="project-showing">
                      Showing on hero preview
                      <span
                        className="project-showing-dot"
                        style={{ background: p.accent }}
                      />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
