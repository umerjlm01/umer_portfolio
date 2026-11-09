"use client"

import { FaGithub, FaLinkedin } from "react-icons/fa"
import { profile } from "@/lib/portfolio-data"

export function Footer() {
  return (
    <footer className="footer">
      <div className="chrome-divider" style={{ marginBottom: "1rem" }} />
      <p className="footer-name">{profile.name}</p>
      <div className="footer-socials">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer noopener"
          className="footer-social"
          aria-label={`GitHub, ${profile.githubLabel}`}
        >
          <FaGithub className="footer-social-icon" aria-hidden />
          <span>{profile.githubLabel}</span>
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          className="footer-social"
          aria-label={`LinkedIn, ${profile.linkedinLabel}`}
        >
          <FaLinkedin className="footer-social-icon" aria-hidden />
          <span>{profile.linkedinLabel}</span>
        </a>
      </div>
    </footer>
  )
}
