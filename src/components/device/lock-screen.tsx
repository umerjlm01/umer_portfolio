"use client"

import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react"
import { ChevronRight, Lock } from "lucide-react"
import { useClock } from "@/hooks/use-clock"
import { useDeviceMode } from "@/hooks/use-device-mode"
import { profile } from "@/lib/portfolio-data"

interface LockScreenProps {
  onUnlock: () => void
}

/**
 * iOS-style lock screen with a slide-to-unlock interaction.
 *  - Big real-time clock + date at the top
 *  - Owner name + "slide to unlock" track at the bottom
 *  - Drag the knob RIGHTWARD across the track to unlock
 *  - Once past the threshold, the knob slides to the end, the screen lifts
 *    away, and onUnlock fires
 *  - Keyboard fallback: focus the knob and press Enter/Space (a11y)
 */
export function LockScreen({ onUnlock }: LockScreenProps) {
  const clock = useClock()
  const { mode } = useDeviceMode()
  const x = useMotionValue(0)
  const unlockedRef = useRef(false)

  // The lock screen translates up as the unlock completes.
  const y = useMotionValue(0)
  const liftOpacity = useTransform(y, [0, -200], [1, 0])

  // Threshold: knob must travel ~75% of the track width to unlock.
  const threshold = mode === "phone" ? 180 : 280

  const knobX = useTransform(x, [0, threshold], [0, threshold])
  const trackFill = useTransform(x, [0, threshold], ["0%", "100%"])

  useEffect(() => {
    const unsub = x.on("change", (latest) => {
      if (latest >= threshold && !unlockedRef.current) {
        unlockedRef.current = true
        // Snap knob to the end, then lift the whole screen away.
        animate(x, threshold, { duration: 0.15, ease: "easeOut" })
        animate(y, -window.innerHeight, {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          onComplete: () => onUnlock(),
        })
      }
    })
    return () => unsub()
  }, [x, y, threshold, onUnlock])

  const fireUnlock = () => {
    if (unlockedRef.current) return
    unlockedRef.current = true
    animate(y, -window.innerHeight, {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => onUnlock(),
    })
  }

  // Pointer drag on the knob
  const startX = useRef<number | null>(null)

  const onPointerDown = (e: ReactPointerEvent) => {
    startX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (startX.current === null) return
    const delta = e.clientX - startX.current
    if (delta > 0) {
      x.set(Math.min(threshold, delta))
    }
  }
  const onPointerUp = () => {
    startX.current = null
    if (!unlockedRef.current) {
      // Spring back if not past threshold.
      animate(x, 0, { type: "spring", stiffness: 350, damping: 30 })
    }
  }

  return (
    <motion.div
      className="lock-screen"
      style={{ y, opacity: liftOpacity }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient crimson glow */}
      <div className="lock-glow" aria-hidden />

      {/* Lock icon + real-time clock + date */}
      <div className="lock-top">
        <div className="lock-icon-row">
          <Lock className="lock-icon" aria-hidden />
        </div>
        <motion.div
          className="lock-clock"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="lock-time">{clock.time}</span>
          <span className="lock-period">{clock.period}</span>
        </motion.div>
        <motion.p
          className="lock-date"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {clock.date}
        </motion.p>
      </div>

      {/* Owner / branding */}
      <div className="lock-middle">
        <motion.p
          className="lock-owner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {profile.name}
        </motion.p>
        <motion.p
          className="lock-owner-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {profile.role}
        </motion.p>
      </div>

      {/* Slide-to-unlock track */}
      <div className="lock-slide-track-wrap">
        <motion.div
          className="lock-hint"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronRight className="lock-hint-icon" aria-hidden />
          <span className="lock-hint-text">Slide to unlock</span>
        </motion.div>
        <div
          className="lock-slide-track"
          role="slider"
          aria-label="Slide to unlock the portfolio"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={threshold}
          tabIndex={-1}
        >
          <motion.div className="lock-slide-fill" style={{ width: trackFill }} />
          <motion.button
            className="lock-slide-knob"
            style={{ x: knobX }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fireUnlock()
            }}
            aria-label="Slide to unlock"
          >
            <ChevronRight className="lock-slide-knob-icon" aria-hidden />
          </motion.button>
        </div>
        <button className="lock-unlock-fallback" onClick={fireUnlock} type="button">
          or press here to enter
        </button>
      </div>
    </motion.div>
  )
}
