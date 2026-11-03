"use client"

import type { CSSProperties } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Smartphone } from "lucide-react"
import { projects, type Project } from "@/lib/portfolio-data"
import { ProjectLinks } from "./project-links"

interface ProjectsProps {
  activeProject: Project
  onSelectProject: (p: Project) => void
}

export function Projects({ activeProject, onSelectProject }: ProjectsProps) {
  const stopProp = (e: { stopPropagation: () => void }) => e.stopPropagation()

  return (
    <section id="projects" className="projects-section">
      <div className="section-head">
        <div>
          <p className="eyeball">Selected work</p>
          <h2 className="section-title">Projects</h2>
        </div>
        <span className="section-count">{projects.length} apps</span>
      </div>
      <div className="chrome-divider section-divider" />

      <div className="projects-grid">
        {projects.map((p) => {
          const isActive = p.id === activeProject.id
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              onClick={() => onSelectProject(p)}
              className={isActive ? "project-card active" : "project-card"}
              style={
                isActive
                  ? ({
                      borderColor: `${p.accent}99`,
                      boxShadow: `0 0 0 1px ${p.accent}80, 0 0 26px -6px ${p.accent}55`,
                    } as CSSProperties)
                  : undefined
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
                  {isActive && (
                    <span
                      className="project-thumb-ring"
                      style={{ boxShadow: `inset 0 0 0 2px ${p.accent}` }}
                    />
                  )}
                </div>
                <div className="project-card-body">
                  <div className="project-title-row">
                    <h3 className="project-title">{p.shortName}</h3>
                    {isActive && <span className="project-featured">On screen</span>}
                  </div>
                  <div className="project-platforms">
                    <span className="project-platform">
                      <Smartphone className="project-platform-icon" aria-hidden />
                      {p.category}
                    </span>
                  </div>
                  <div className="project-tech">
                    {p.stack.slice(0, 3).map((t) => (
                      <span key={t} className="project-tech-chip">
                        {t}
                      </span>
                    ))}
                    {p.stack.length > 3 && (
                      <span className="project-tech-more">+{p.stack.length - 3}</span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={isActive ? "project-chev active" : "project-chev"}
                  aria-hidden
                />
              </div>
              <p className="project-desc">{p.description}</p>

              {p.architectureLine && (
                <p className="project-architecture">{p.architectureLine}</p>
              )}

              <ProjectLinks project={p} onLinkClick={stopProp} compact />

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="project-expanded"
                  >
                    <ul
                      className="experience-points"
                      style={{ marginTop: 0, paddingLeft: "1rem" }}
                    >
                      {p.highlights.slice(0, 3).map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    <span className="project-showing">
                      Showing on screen
                      <span className="project-showing-dot" />
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
