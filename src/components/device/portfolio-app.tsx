"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react"
import { projects, type Project } from "@/lib/portfolio-data"
import { usePortfolioStore } from "@/lib/portfolio-store"
import { useDeviceMode } from "@/hooks/use-device-mode"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { LockScreen } from "./lock-screen"
import { Sidebar } from "./sidebar"
import { BottomTabs } from "./bottom-tabs"
import { LiveTime, StatusBar, StatusIconsOnly } from "./status-bar"
import { ScrollProgress } from "./scroll-progress"
import { Hero } from "./hero"
import { Projects } from "./projects"
import { Experience } from "./experience"
import { Skills } from "./skills"
import { Contact } from "./contact"
import { Footer } from "./footer"
import { preloadPhoneGltf } from "@/lib/portfolio-3d-preload"
import {
  preloadProjectScreenshots,
  warmPhoneCanvasChunk,
} from "@/lib/screenshot-cache"

/**
 * The DeviceShell fills the ENTIRE browser viewport (position:fixed; inset:0).
 * The ORIGINAL two-device concept:
 *  - phone (<768px)  → mobile phone frame, bottom tabs, single column
 *  - ipad  (≥768px)  → iPad frame
 *      · landscape → sidebar + single column (hero is 2-col, grids fill width)
 *      · portrait  → bottom tabs + single column
 *
 * The 3D phone now lives inside the Hero (where the 2D preview was). The
 * content scrolls INSIDE the screen area; the body never scrolls.
 *
 * On first load a lock screen is shown (real-time clock + swipe-to-unlock).
 * Swiping up unlocks and reveals the portfolio with a staggered animation.
 */
export default function PortfolioApp() {
  const { mode, orientation } = useDeviceMode()
  const reducedMotion = usePrefersReducedMotion()

  const activeProjectId = usePortfolioStore((s) => s.activeProjectId)
  const autoCycle = usePortfolioStore((s) => s.autoCycle)
  const selectProject = usePortfolioStore((s) => s.selectProject)

  const activeProject = useMemo<Project>(
    () => projects.find((p) => p.id === activeProjectId) ?? projects[0],
    [activeProjectId]
  )

  /* Child components hand over the full project object; the store action
     wants the project id — adapt here so the two stay in sync. */
  const handleSelectProject = useCallback(
    (p: Project) => selectProject(p.id),
    [selectProject]
  )

  /* Auto-cycle through the project screenshots. Paused while the user
     is inspecting a manually chosen project (resumes after idle). */
  useEffect(() => {
    if (!autoCycle || reducedMotion) return
    const id = window.setInterval(() => {
      const idx = projects.findIndex((p) => p.id === activeProject.id)
      const next = projects[(idx + 1) % projects.length]
      usePortfolioStore.getState().setActiveProject(next.id)
    }, 5000)
    return () => window.clearInterval(id)
  }, [activeProject.id, autoCycle, reducedMotion])

  /* GLB + decoded screenshots + WebGL chunk — early so the hero is stable after unlock. */
  useEffect(() => {
    preloadPhoneGltf()
    void preloadProjectScreenshots(projects.map((p) => p.screenshot))
    warmPhoneCanvasChunk()
  }, [])

  /* Lock screen — shown once per load. */
  const [locked, unlock] = useLockedState()

  /* SSR safety: the device-shell className depends on the live viewport, which
     differs between the server render and the first client render. Render a
     neutral placeholder (same dark backdrop) until mounted, then reveal the
     correct device frame. useSyncExternalStore returns false during SSR and the
     hydration render (matching the server), then true once hydrated — with no
     setState-in-effect. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Whether the layout uses a left sidebar (iPad landscape only).
  const useSidebar = mode === "ipad" && orientation === "landscape"

  const shellClass = `device-shell mode-${mode} orient-${orientation}`

  if (!mounted) {
    return <div className="device-shell-preload" aria-hidden />
  }

  return (
    <div className={shellClass}>
      {/* All modes: bezel ring + front-camera dot (phone shows it top-center too) */}
      <div className="device-bezel" aria-hidden />
      <div className="device-camera-dot" aria-hidden />

      {/* The screen area: sidebar (iPad landscape) + scrollable content */}
      <div className="device-screen" id="device-scroll">
        {useSidebar && <Sidebar />}

        <div className="device-main">
          {/* Top status bar inside the content (hidden on phone, which has its own) */}
          {mode !== "phone" && (
            <div className="device-topbar">
              <LiveTime />
              <div className="device-topbar-icons" aria-hidden>
                <StatusIconsOnly />
              </div>
              <ScrollProgress />
            </div>
          )}
          {mode === "phone" && (
            <div className="phone-header">
              <StatusBar />
              <ScrollProgress />
            </div>
          )}

          {/* Content reveal animation after unlock */}
          <motion.div
            className="device-content"
            id="phone-content"
            initial={false}
            animate={
              locked ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }
            }
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: locked ? 0 : 0.15,
            }}
            style={
              {
                "--project-accent": activeProject.accent,
              } as CSSProperties
            }
          >
            <Hero activeProject={activeProject} onSelectProject={handleSelectProject} />
            <Projects activeProject={activeProject} onSelectProject={handleSelectProject} />
            <Experience />
            <Skills />
            <Contact />
            <Footer />
          </motion.div>
        </div>

        {/* Phone + iPad portrait: bottom tab bar (absolute inside the screen) */}
        {!useSidebar && <BottomTabs />}

        {/* Lock screen overlay — inside the screen so the bezel stays visible */}
        <AnimatePresence>
          {locked && <LockScreen onUnlock={unlock} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** External "unlocked" store — survives re-mounts, shared per tab. */
const unlockedListeners = new Set<() => void>()

function subscribeUnlocked(cb: () => void) {
  unlockedListeners.add(cb)
  return () => {
    unlockedListeners.delete(cb)
  }
}

function getUnlockedSnapshot(): boolean {
  try {
    return sessionStorage.getItem("portfolio-unlocked") === "1"
  } catch {
    return false
  }
}

function getUnlockedServerSnapshot(): boolean {
  return false
}

/** Locked state: true until unlocked this session (survives reloads). */
function useLockedState(): [boolean, () => void] {
  const alreadyUnlocked = useSyncExternalStore(
    subscribeUnlocked,
    getUnlockedSnapshot,
    getUnlockedServerSnapshot
  )
  const [manualUnlock, setManualUnlock] = useState(false)

  const unlock = () => {
    setManualUnlock(true)
    try {
      sessionStorage.setItem("portfolio-unlocked", "1")
    } catch {
      /* ignore */
    }
    unlockedListeners.forEach((l) => l())
  }

  return [!manualUnlock && !alreadyUnlocked, unlock]
}
