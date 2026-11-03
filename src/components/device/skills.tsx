"use client"

import { motion } from "framer-motion"
import type { IconType } from "react-icons"
import {
  FaBell,
  FaBroadcastTower,
  FaCloud,
  FaCreditCard,
  FaCubes,
  FaExchangeAlt,
  FaLink,
  FaSitemap,
  FaSlack,
  FaStream,
  FaTachometerAlt,
  FaVideo,
} from "react-icons/fa"
import {
  SiApple,
  SiDart,
  SiFirebase,
  SiFlutter,
  SiGoogle,
  SiGoogleanalytics,
  SiGoogleplay,
  SiJira,
  SiPhp,
  SiPython,
  SiStripe,
  SiSupabase,
} from "react-icons/si"
import { TbApi, TbBrandReactNative } from "react-icons/tb"
import { Bell, ChevronDown, Code2, CreditCard, Database, Wrench } from "lucide-react"
import { skillGroups, skillUsedInProjects } from "@/lib/portfolio-data"
import type { LucideIcon } from "lucide-react"
import { useDeviceMode } from "@/hooks/use-device-mode"

const SKILL_ICON: Record<string, { icon: IconType; color: string }> = {
  Dart: { icon: SiDart, color: "#0175C2" },
  Flutter: { icon: SiFlutter, color: "#02569B" },
  "React Native": { icon: TbBrandReactNative, color: "#61DAFB" },
  Python: { icon: SiPython, color: "#3776AB" },
  PHP: { icon: SiPhp, color: "#777BB4" },
  "REST API": { icon: TbApi, color: "#22D3EE" },
  Firebase: { icon: SiFirebase, color: "#FFCA28" },
  Supabase: { icon: SiSupabase, color: "#3FCF8E" },
  Dio: { icon: FaExchangeAlt, color: "#54C5F8" },
  ZegoCloud: { icon: FaVideo, color: "#5B8CFF" },
  "Firebase Analytics": { icon: SiFirebase, color: "#FFCA28" },
  "Google Analytics": { icon: SiGoogleanalytics, color: "#E37400" },
  FCM: { icon: FaBell, color: "#FF6D00" },
  "Deep Linking": { icon: FaLink, color: "#A78BFA" },
  "RevenueCat (IAP / Subscriptions)": { icon: FaCreditCard, color: "#F45B69" },
  "Google Sign-In": { icon: SiGoogle, color: "#4285F4" },
  "Sign in with Apple": { icon: SiApple, color: "#A2AAAD" },
  "Payment Gateways": { icon: SiStripe, color: "#635BFF" },
  StoreKit: { icon: SiApple, color: "#A2AAAD" },
  "Google Play Billing": { icon: SiGoogleplay, color: "#34A853" },
  Bloc: { icon: FaCubes, color: "#1473E6" },
  Streams: { icon: FaStream, color: "#38BDF8" },
  RxDart: { icon: FaBroadcastTower, color: "#B388FF" },
  Jira: { icon: SiJira, color: "#0052CC" },
  Slack: { icon: FaSlack, color: "#E01E5A" },
  "Clean Architecture": { icon: FaSitemap, color: "#94A3B8" },
  "Performance Optimization": { icon: FaTachometerAlt, color: "#FBBF24" },
}

const GROUP_ICON: Record<string, LucideIcon> = {
  code: Code2,
  database: Database,
  bell: Bell,
  card: CreditCard,
  wrench: Wrench,
}

export function Skills() {
  const { mode } = useDeviceMode()
  const collapsible = mode === "phone"

  return (
    <section id="skills" className="skills-section">
      <p className="eyeball">Toolbox</p>
      <h2 className="section-title">Skills</h2>
      <div className="chrome-divider section-divider" />

      {skillGroups.map((group, gi) => {
        const GroupIcon = GROUP_ICON[group.icon] ?? Code2
        const defaultOpen = !collapsible || gi === 0

        const body = (
          <div className="skills-grid">
            {group.skills.map((s, i) => {
              const meta = SKILL_ICON[s]
              const Icon = meta?.icon
              const usedIn = skillUsedInProjects[s]
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (gi * 2 + i) * 0.03 }}
                  className="skill-chip"
                >
                  {Icon ? (
                    <Icon
                      className="skill-icon"
                      style={{ color: meta?.color }}
                      aria-label={s}
                    />
                  ) : (
                    <FaCloud
                      className="skill-icon"
                      style={{ color: "#D41514" }}
                      aria-hidden
                    />
                  )}
                  <span className="skill-chip-text">
                    <span className="skill-label">{s}</span>
                    {/* {usedIn && usedIn.length > 0 && (
                      <span className="skill-used-in">
                        Used in {usedIn.join(", ")}
                      </span>
                    )} */}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )

        if (!collapsible) {
          return (
            <div className="skills-group" key={group.title}>
              <p className="skills-group-title">
                <GroupIcon aria-hidden />
                {group.title}
              </p>
              {body}
            </div>
          )
        }

        return (
          <details key={group.title} className="skills-group skills-details" open={defaultOpen}>
            <summary className="skills-group-title skills-summary">
              <GroupIcon aria-hidden />
              {group.title}
              <ChevronDown className="skills-chevron" aria-hidden />
            </summary>
            {body}
          </details>
        )
      })}
    </section>
  )
}
