"use client"

import type { CSSProperties } from "react"
import dynamic from "next/dynamic"
import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Download, GraduationCap, MapPin, Phone } from "lucide-react"
import {
  education,
  profile,
  projects,
  services,
  stats,
  type Project,
} from "@/lib/portfolio-data"
import { usePortfolioStore } from "@/lib/portfolio-store"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useWebGLAvailable } from "@/hooks/use-is-low-end-device"
import { HeroPhoneFallback } from "./hero-phone-fallback"

const HeroTechCanvas = dynamic(
  () => import("@/components/portfolio/hero-tech-canvas"),
  { ssr: false }
)
const HeroWebGLCanvas = dynamic(
  () => import("@/components/portfolio/hero-webgl-canvas"),
  { ssr: false }
)

interface HeroProps {
  activeProject: Project
  onSelectProject: (p: Project) => void
}

export function Hero({ activeProject, onSelectProject }: HeroProps) {
  const phoneFrameRef = useRef<HTMLDivElement>(null)
  const autoCycle = usePortfolioStore((s) => s.autoCycle)
  const reducedMotion = usePrefersReducedMotion()
  const webglOk = useWebGLAvailable()
  const showLiveBadge = autoCycle && !reducedMotion

  return (
    <section id="top" className="hero">
      <div className="hero-tech-bg" aria-hidden>
        {webglOk ? (
          <HeroTechCanvas
            reducedMotion={reducedMotion}
            accent={activeProject.accent}
          />
        ) : (
          <div className="hero-tech-fallback" />
        )}
        <div className="hero-tech-bg-fade" />
        <div className="hero-accent-wash" aria-hidden />
      </div>

      <div className="hero-content">
        <div className="hero-top">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hero-intro"
          >
            <p className="eyeball">{profile.role}</p>
            <h1 className="hero-name">{profile.name}</h1>
            <p className="hero-tagline">{profile.heroTagline}</p>
            <div className="hero-meta">
              <MapPin className="hero-meta-icon" aria-hidden />
              <span>{profile.location}</span>
              <span className="hero-meta-sep" aria-hidden>
                ·
              </span>
              <a href={`tel:${profile.phoneHref}`} className="hero-meta-link">
                <Phone className="hero-meta-icon" aria-hidden />
                {profile.phone}
              </a>
              <span className="hero-meta-sep" aria-hidden>
                ·
              </span>
              <span className="hero-meta-avail">
                <span className="avail-dot-wrap">
                  <span className="avail-dot-ping" />
                  <span className="avail-dot" />
                </span>
                Available
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="hero-preview"
          >
            <div className="hero-preview-head">
              <p className="hero-preview-label">
                <span
                  className="hero-preview-accent"
                  style={{ backgroundColor: activeProject.accent }}
                  aria-hidden
                />
                {activeProject.shortName}
              </p>
              {showLiveBadge && (
                <span className="hero-preview-live">
                  <span className="hero-preview-live-dot" aria-hidden />
                  Live preview
                </span>
              )}
            </div>
            <div ref={phoneFrameRef} className="hero-3d-frame hero-3d-frame-track">
              {webglOk ? (
                <HeroWebGLCanvas
                  imageSrc={activeProject.screenshot}
                  eventSource={phoneFrameRef}
                  reducedMotion={reducedMotion}
                />
              ) : (
                <HeroPhoneFallback
                  screenshot={activeProject.screenshot}
                  alt={`${activeProject.name} screenshot`}
                />
              )}
            </div>
            <div className="picker-dots">
              {projects.map((p) => {
                const isActive = p.id === activeProject.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProject(p)}
                    aria-label={`Show ${p.name}`}
                    aria-pressed={isActive}
                    className={isActive ? "picker-dot active" : "picker-dot"}
                    style={
                      { ["--picker-accent" as string]: p.accent } as CSSProperties
                    }
                  />
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hero-ctas"
        >
          <a href="#projects" className="btn-primary">
            View projects
            <ArrowRight className="btn-icon" aria-hidden />
          </a>
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-secondary"
          >
            <Download className="btn-icon" aria-hidden />
            Download CV
          </a>
        </motion.div>

        <div className="chrome-divider hero-about-divider" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="about-body"
        >
          <p>{profile.summary}</p>
          <p>{profile.summaryExtra}</p>
          <p className="about-note">
            Based in {profile.location}. Always happy to talk mobile architecture,
            design systems, or the perfect coffee-to-code ratio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.04 }}
          className="services-block"
        >
          <p className="skills-group-title services-title">
            What I build for clients
          </p>
          <ul className="services-grid">
            {services.map((s) => (
              <li key={s.title} className="services-card">
                <h3 className="services-card-title">{s.title}</h3>
                <p className="services-card-desc">{s.description}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="stats-row"
        >
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <p className="skills-group-title" style={{ marginBottom: "0.5rem" }}>
            <GraduationCap aria-hidden />
            Education
          </p>
          <div className="education-list">
            {education.map((e) => (
              <div className="education-card" key={e.school}>
                <div className="education-icon">
                  <GraduationCap aria-hidden />
                </div>
                <div>
                  <h3 className="education-school">{e.school}</h3>
                  <p className="education-detail">{e.detail}</p>
                  <p className="education-location">{e.location}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
