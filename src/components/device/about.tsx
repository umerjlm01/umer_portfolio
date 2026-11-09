"use client"

import { motion } from "framer-motion"
import { Heart, Quote, Users } from "lucide-react"
import { about } from "@/lib/portfolio-data"

export function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-head">
        <div>
          <p className="eyeball">A bit more human</p>
          <h2 className="section-title">About me</h2>
        </div>
      </div>
      <div className="chrome-divider section-divider" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="about-grid"
      >
        <div className="about-card">
          <h3 className="about-card-title">
            <Heart className="about-card-icon" aria-hidden />
            How I&apos;d describe myself
          </h3>
          {about.self.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="about-card">
          <h3 className="about-card-title">
            <Quote className="about-card-icon" aria-hidden />
            How others describe me
          </h3>
          <p>{about.others}</p>
        </div>

        <div className="about-card">
          <h3 className="about-card-title">
            <Users className="about-card-icon" aria-hidden />
            Volunteer
          </h3>
          <p>{about.volunteer}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="about-hobbies"
      >
        <p className="skills-group-title">Hobbies</p>
        <ul className="about-hobby-list">
          {about.hobbies.map((h) => (
            <li key={h} className="about-hobby-chip">
              {h}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}
