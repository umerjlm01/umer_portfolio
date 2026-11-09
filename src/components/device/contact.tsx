"use client"

import { motion } from "framer-motion"
import { Mail, Phone, Send } from "lucide-react"
import { useRef, useState, type FocusEvent, type FormEvent } from "react"
import { profile } from "@/lib/portfolio-data"

function openMailto(url: string) {
  const a = document.createElement("a")
  a.href = url
  a.rel = "noopener noreferrer"
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [mailHint, setMailHint] = useState(false)
  const scrollTimer = useRef<number | null>(null)

  const onFieldFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget
    const container = document.getElementById("phone-content")
    if (!container) return

    if (scrollTimer.current !== null) {
      window.clearTimeout(scrollTimer.current)
    }

    // Wait for mobile keyboard, then nudge only if the field is clipped.
    scrollTimer.current = window.setTimeout(() => {
      const headerPad = 72
      const dockPad = 120
      const cRect = container.getBoundingClientRect()
      const eRect = target.getBoundingClientRect()
      const topLimit = cRect.top + headerPad
      const bottomLimit = cRect.bottom - dockPad

      if (eRect.top >= topLimit && eRect.bottom <= bottomLimit) return

      const delta =
        eRect.bottom > bottomLimit
          ? eRect.bottom - bottomLimit
          : eRect.top - topLimit

      if (Math.abs(delta) < 24) return
      container.scrollBy({ top: delta, behavior: "auto" })
    }, 120)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
      "",
      `Sent from ${profile.name}'s portfolio`,
    ].join("\n")

    const subjectLine = subject || `Portfolio enquiry from ${name}`
    const mailtoUrl =
      `mailto:${profile.email}` +
      `?subject=${encodeURIComponent(subjectLine)}` +
      `&body=${encodeURIComponent(body)}`

    openMailto(mailtoUrl)
    // Many Windows laptops have no default mail app, so mailto does nothing.
    // Surface a Gmail web fallback after a beat.
    window.setTimeout(() => setMailHint(true), 600)
  }

  const gmailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(profile.email)}` +
    `&su=${encodeURIComponent(subject || `Portfolio enquiry from ${name}`)}` +
    `&body=${encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, "", message, "", `Sent from ${profile.name}'s portfolio`].join(
        "\n"
      )
    )}`

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
            yours. I usually reply within a day.
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
                  onFocus={onFieldFocus}
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
                  onFocus={onFieldFocus}
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
                onFocus={onFieldFocus}
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
                onFocus={onFieldFocus}
                className="contact-input contact-textarea"
              />
            </label>
            <button type="submit" className="btn-primary contact-submit">
              <Send className="btn-icon" aria-hidden />
              Open in your email
            </button>
            {mailHint && (
              <p className="contact-mail-hint">
                Nothing opened? Your laptop may not have a default mail app.{" "}
                <a href={gmailUrl} target="_blank" rel="noreferrer noopener">
                  Open in Gmail
                </a>{" "}
                or email me at{" "}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>.
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </section>
  )
}
