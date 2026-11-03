"use client"

import { motion } from "framer-motion"
import { Mail, Phone, Send } from "lucide-react"
import { useState, type FormEvent } from "react"
import { profile } from "@/lib/portfolio-data"

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
      "",
      `— Sent from ${profile.name}'s portfolio`,
    ].join("\n")

    const gmailUrl =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(profile.email)}` +
      `&su=${encodeURIComponent(subject || `Portfolio enquiry from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`

    const win = window.open(gmailUrl, "_blank")
    if (win) {
      win.opener = null
      return
    }

    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject || `Portfolio enquiry from ${name}`
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="contact" className="contact-section">
      <p className="eyeball">Let&apos;s build</p>
      <h2 className="section-title">Have an app idea?</h2>
      <div className="chrome-divider section-divider" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="contact-card"
      >
        <div className="crimson-glow contact-glow" aria-hidden />
        <div className="contact-card-inner">
          <p className="contact-text">
            I&apos;m taking on select freelance mobile projects. Tell me about
            yours — I usually reply within a day.
          </p>

          <div className="contact-direct">
            <a href={`mailto:${profile.email}`} className="contact-direct-link">
              <Mail className="contact-direct-icon" aria-hidden />
              {profile.email}
            </a>
            <a href={`tel:${profile.phoneHref}`} className="contact-direct-link">
              <Phone className="contact-direct-icon" aria-hidden />
              {profile.phone}
            </a>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <label className="contact-field">
                <span className="contact-field-label">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="contact-input"
                  autoComplete="name"
                />
              </label>
              <label className="contact-field">
                <span className="contact-field-label">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="contact-input"
                  autoComplete="email"
                />
              </label>
            </div>
            <label className="contact-field">
              <span className="contact-field-label">Subject</span>
              <input
                type="text"
                name="subject"
                placeholder="What&apos;s this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="contact-input"
              />
            </label>
            <label className="contact-field">
              <span className="contact-field-label">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="A few words about your project, timeline, and scope…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="contact-input contact-textarea"
              />
            </label>
            <button type="submit" className="btn-primary contact-submit">
              <Send className="btn-icon" aria-hidden />
              Open in Gmail
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
