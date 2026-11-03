"use client"

import { create } from "zustand"

/** Resumes auto-cycling this long after the last manual selection. */
const AUTO_CYCLE_RESUME_MS = 20000

let resumeTimer: ReturnType<typeof setTimeout> | null = null

/** Accept a plain id OR a project-like object — normalize to the id string. */
function normalizeId(id: string | { id?: string }): string {
  return typeof id === "string" ? id : ((id as { id?: string }).id ?? "")
}

type PortfolioState = {
  activeProjectId: string
  autoCycle: boolean
  /** Manually select a project — pauses auto-cycling, resumes after idle. */
  selectProject: (id: string | { id?: string }) => void
  setActiveProject: (id: string | { id?: string }) => void
  setAutoCycle: (v: boolean) => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activeProjectId: "psp",
  autoCycle: true,
  selectProject: (id) => {
    set({ activeProjectId: normalizeId(id), autoCycle: false })
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      resumeTimer = null
      set({ autoCycle: true })
    }, AUTO_CYCLE_RESUME_MS)
  },
  setActiveProject: (id) => set({ activeProjectId: normalizeId(id) }),
  setAutoCycle: (v) => set({ autoCycle: v }),
}))
