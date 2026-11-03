"use client"

import { motion } from "framer-motion"
import { Briefcase, Check } from "lucide-react"
import { experience } from "@/lib/portfolio-data"

export function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="section-head">
        <div>
          <p className="eyeball">Career</p>
          <h2 className="section-title">Experience</h2>
        </div>
        <span className="section-count">{experience.length} roles</span>
      </div>
      <div className="chrome-divider section-divider" />

      <div className="experience-list">
        {experience.map((job, i) => {
          const monogram = job.company.charAt(0).toUpperCase()
          return (
            <motion.article
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={
                job.current
                  ? "experience-card experience-current"
                  : "experience-card"
              }
            >
              {/* Timeline rail — glowing dot + vertical line */}
              <div className="experience-rail" aria-hidden>
                <span className="experience-rail-dot" />
                <span className="experience-rail-line" />
              </div>

              <div className="experience-card-body">
                <div className="experience-head">
                  <div className="experience-head-left">
                    <span className="experience-monogram" aria-hidden>
                      {monogram}
                    </span>
                    <div className="experience-head-text">
                      <h3 className="experience-role">
                        {job.role}
                        {job.current && (
                          <span className="experience-badge">
                            <span className="experience-badge-dot" />
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="experience-company">
                        <Briefcase className="experience-company-icon" aria-hidden />
                        {job.company}
                        <span className="experience-company-sep" aria-hidden>·</span>
                        <span className="experience-location">{job.location}</span>
                      </p>
                    </div>
                  </div>
                  <span className="experience-period">{job.period}</span>
                </div>

                <ul className="experience-points">
                  {job.points.map((pt) => (
                    <li key={pt}>
                      <span className="experience-point-marker" aria-hidden>
                        <Check className="experience-point-check" aria-hidden />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
