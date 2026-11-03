"use client"

import type { MouseEvent } from "react"
import { SiApple, SiGoogleplay } from "react-icons/si"
import type { Project } from "@/lib/portfolio-data"
import { projectHasPublicLinks } from "@/lib/portfolio-data"

type ProjectLinksProps = {
  project: Project
  /** Stop card click from firing when tapping a link */
  onLinkClick?: (e: MouseEvent) => void
  compact?: boolean
}

export function ProjectLinks({ project, onLinkClick, compact }: ProjectLinksProps) {
  const links = project.links
  if (!projectHasPublicLinks(project) || !links) return null

  return (
    <div
      className={compact ? "project-links project-links-compact" : "project-links"}
      onClick={onLinkClick}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      {links.playStore && (
        <a
          href={links.playStore}
          target="_blank"
          rel="noreferrer noopener"
          className="project-link-chip"
          onClick={onLinkClick}
        >
          <SiGoogleplay className="project-link-icon" aria-hidden />
          Google Play
        </a>
      )}
      {links.appStore === "coming-soon" && (
        <span className="project-link-chip project-link-chip-muted" title="App Store listing in progress">
          <SiApple className="project-link-icon" aria-hidden />
          App Store soon
        </span>
      )}
      {links.appStore && links.appStore !== "coming-soon" && (
        <a
          href={links.appStore}
          target="_blank"
          rel="noreferrer noopener"
          className="project-link-chip"
          onClick={onLinkClick}
        >
          <SiApple className="project-link-icon" aria-hidden />
          App Store
        </a>
      )}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer noopener"
          className="project-link-chip"
          onClick={onLinkClick}
        >
          GitHub
        </a>
      )}
      {links.demo && (
        <a
          href={links.demo}
          target="_blank"
          rel="noreferrer noopener"
          className="project-link-chip"
          onClick={onLinkClick}
        >
          Live demo
        </a>
      )}
    </div>
  )
}
