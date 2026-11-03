export const profile = {
  name: "Syed Muhammad Umer",
  shortName: "Umer",
  role: "Mobile Application Developer",
  tagline: "Flutter Developer",
  location: "Lahore, Punjab, Pakistan",
  phone: "+92 334-5558580",
  phoneHref: "+923345558580",
  email: "umerjlm01@gmail.com",
  linkedin: "https://www.linkedin.com/in/syed-muhammad-umer-94b63a299",
  linkedinLabel: "syed-muhammad-umer",
  github: "https://github.com/umerjlm01",
  githubLabel: "umerjlm01",
  cvUrl: "/portfolio/resume.pdf",
  summary:
    "Flutter developer with 1+ years of experience shipping cross-platform apps for Android and iOS — professional networking, e-commerce, real-time chat, lottery operations, and AI styling with subscriptions.",
  summaryExtra:
    "Comfortable across the stack: Bloc and Clean Architecture on the client, Firebase and Supabase on the backend, plus RevenueCat, payment gateways, FCM, deep linking, and ZegoCloud for calls. I own features end-to-end, from UI polish to API integration and store releases.",
}

export const stats = [
  { value: "1+", label: "Year Flutter Experience" },
  { value: "2", label: "Apps on Google Play" },
  { value: "4", label: "Featured Apps" },
  { value: "4+", label: "Payment & IAP Integrations" },
]

export type ProjectLinks = {
  /** Omit or undefined = no App Store link. "coming-soon" shows a non-clickable badge. */
  appStore?: string | "coming-soon"
  playStore?: string
  github?: string
  demo?: string
}

export type Project = {
  id: string
  name: string
  shortName: string
  category: string
  tagline: string
  description: string
  highlights: string[]
  stack: string[]
  screenshot: string
  accent: string
  architectureLine?: string
  links?: ProjectLinks
}

export const projects: Project[] = [
  {
    id: "psp",
    name: "Pantsuit Professionals (PSP)",
    shortName: "Pantsuit Pro",
    category: "Professional Networking",
    tagline: "Cross-platform professional networking app",
    description:
      "A professional networking platform built and maintained in Flutter, with secure authentication, payments, and content publishing across mobile and web.",
    highlights: [
      "Secure auth with email/OTP plus Google, Facebook & Apple OAuth",
      "Deep linking for membership, payment and content flows",
      "Payment gateways for in-app memberships & subscriptions",
      "Firebase in-app notifications, Analytics & Google Analytics",
      "Content publishing (jobs / events / articles) + compliance features",
    ],
    stack: ["Flutter", "Firebase", "OAuth", "Deep Linking", "Payments", "Analytics"],
    screenshot: "/portfolio/screens/pantsuit-professionals.png",
    accent: "#e0a84f",
    architectureLine:
      "Flutter + Firebase auth/analytics with OAuth, deep-linked membership flows, and gateway-backed subscriptions.",
    links: {
      appStore: "coming-soon",
      playStore:
        "https://play.google.com/store/apps/details?id=com.pantsuitprofessionals.app&pcampaignid=web_share",
    },
  },
  {
    id: "lottio",
    name: "CNP Lottio",
    shortName: "Lottio",
    category: "Lottery & Payments",
    tagline: "Lottery app built from scratch",
    description:
      "A lottery mobile application developed from scratch in Flutter — sortitions, play validation, full ticket lifecycle management, and prepaid bill payments.",
    highlights: [
      "Dynamic sortition system with play validations",
      "Full ticket lifecycle: create, delete, duplicate & monitor",
      "Prepaid bill payments alongside existing payment workflows",
      "Real-time API sync with the web platform",
      "Core architecture & business logic designed for scale",
    ],
    stack: ["Flutter", "REST API", "Payments", "Clean Architecture", "Dio"],
    screenshot: "/portfolio/screens/cnp-lottio.png",
    accent: "#f5c451",
    architectureLine:
      "Clean Architecture with Dio REST sync, ticket lifecycle domain logic, and shared payment rails with the web platform.",
  },
  {
    id: "agile",
    name: "Color Match (Agile Styling)",
    shortName: "Agile Styling",
    category: "AI Styling & Subscriptions",
    tagline: "Photo-based styling with in-app purchases",
    description:
      "An AI styling app that matches outfits from photos, monetized through RevenueCat subscriptions and consumable match packs.",
    highlights: [
      "RevenueCat IAP: Silver / Gold / Platinum / Diamond tiers, monthly–annual",
      "Consumable match packs with coupon & referral discounts",
      "FCM + local notifications, deep-link referrals",
      "Photo-based matching & in-store overlay match UI",
      "Account and plan management flows",
    ],
    stack: ["Flutter", "RevenueCat", "IAP", "FCM", "Deep Linking", "StoreKit"],
    screenshot: "/portfolio/screens/agile-styling.png",
    accent: "#c96f4a",
    architectureLine:
      "Bloc-driven UI with RevenueCat subscription tiers, referral deep links, and FCM for retention.",
    links: {
      appStore:
        "https://apps.apple.com/us/app/color-match-shop-your-palette/id6745172966",
      playStore:
        "https://play.google.com/store/apps/details?id=com.Rev9.AgileStylingApp&pcampaignid=web_share",
    },
  },
  {
    id: "wardrobe",
    name: "Wardrobe Chat",
    shortName: "Wardrobe",
    category: "E-commerce & Real-time Chat",
    tagline: "Clothing e-commerce with live chat",
    description:
      "A cross-platform clothing e-commerce app with order management and real-time chat featuring Google Maps locations, voice/video calls and rich attachments.",
    highlights: [
      "Auth, product browsing, detail views & dynamic cart",
      "Dio + Supabase backend with order management",
      "Real-time chat with Google Maps locations",
      "Voice / video calls via ZegoCloud, WhatsApp-style attachments",
      "Bloc + Streams state, FCM with Supabase Edge Functions",
    ],
    stack: ["Flutter", "Supabase", "Dio", "ZegoCloud", "Bloc", "FCM"],
    screenshot: "/portfolio/screens/wardrobe-chat.png",
    accent: "#3ad08f",
    architectureLine:
      "Bloc + Streams over Supabase and Dio, ZegoCloud for calls, and Edge Functions for push.",
  },
]

/** True when the project should show any store / external link UI. */
export function projectHasPublicLinks(p: Project): boolean {
  const l = p.links
  if (!l) return false
  return !!(l.playStore || l.github || l.demo || l.appStore)
}

export const services = [
  {
    title: "Cross-platform Flutter apps",
    description:
      "Production Android & iOS builds with responsive UI, animations, and store-ready release flows.",
  },
  {
    title: "Auth, payments & subscriptions",
    description:
      "OAuth, RevenueCat and gateway integrations, memberships, and consumable IAP — tested on real devices.",
  },
  {
    title: "Realtime & backend integration",
    description:
      "REST, Firebase, Supabase, FCM, deep linking, and live features like chat and voice/video (ZegoCloud).",
  },
  {
    title: "Maintainable architecture",
    description:
      "Bloc, Clean Architecture, and performance work — caching, async pipelines, and clear module boundaries.",
  },
]

export const experience = [
  {
    role: "Flutter Developer",
    company: "Rev9 Solutions",
    period: "11/2025 — Present",
    location: "Jhelum, Punjab",
    current: true,
    points: [
      "Ship and maintain Flutter features for production apps (networking, styling, lottery) used by real customers on Google Play and internal deployments.",
      "Integrate REST APIs, payments, and analytics end-to-end — fewer handoffs between UI, business logic, and backend contracts.",
      "Improve reliability and performance by tightening async flows, fixing integration edge cases, and keeping architecture easy to extend.",
    ],
  },
  {
    role: "Flutter Intern",
    company: "Rev9 Solutions",
    period: "08/2025 — 10/2025",
    location: "Jhelum, Punjab",
    current: false,
    points: [
      "Delivered cross-platform modules with Dio and Supabase, including order flows and authenticated browsing for e-commerce clients.",
      "Added real-time engagement: FCM notifications, Supabase Edge Functions, and ZegoCloud voice/video in a WhatsApp-style chat experience.",
      "Built animated UI with Bloc and Streams on Clean Architecture; cut perceived load time via caching and smarter network usage.",
    ],
  },
]

export const skillGroups = [
  {
    title: "Languages & Frameworks",
    icon: "code",
    skills: ["Dart", "Flutter", "React Native", "Python", "PHP"],
  },
  {
    title: "Backend & Integration",
    icon: "database",
    skills: ["REST API", "Firebase", "Supabase", "Dio", "ZegoCloud"],
  },
  {
    title: "Analytics & Notifications",
    icon: "bell",
    skills: ["Firebase Analytics", "Google Analytics", "FCM", "Deep Linking"],
  },
  {
    title: "Payments & Auth",
    icon: "card",
    skills: [
      "RevenueCat (IAP / Subscriptions)",
      "Google Sign-In",
      "Sign in with Apple",
      "Payment Gateways",
      "StoreKit",
      "Google Play Billing",
    ],
  },
  {
    title: "Tools & Practices",
    icon: "wrench",
    skills: [
      "Bloc",
      "Streams",
      "RxDart",
      "Jira",
      "Slack",
      "Clean Architecture",
      "Performance Optimization",
    ],
  },
]

/** Maps skill label → project short names where the skill was used in production work. */
export const skillUsedInProjects: Record<string, string[]> = {
  Dart: ["Pantsuit Pro", "Lottio", "Agile Styling", "Wardrobe"],
  Flutter: ["Pantsuit Pro", "Lottio", "Agile Styling", "Wardrobe"],
  "REST API": ["Lottio", "Wardrobe"],
  Firebase: ["Pantsuit Pro"],
  Supabase: ["Wardrobe"],
  Dio: ["Lottio", "Wardrobe"],
  ZegoCloud: ["Wardrobe"],
  "Firebase Analytics": ["Pantsuit Pro"],
  "Google Analytics": ["Pantsuit Pro"],
  FCM: ["Pantsuit Pro", "Agile Styling", "Wardrobe"],
  "Deep Linking": ["Pantsuit Pro", "Agile Styling"],
  "RevenueCat (IAP / Subscriptions)": ["Agile Styling"],
  "Google Sign-In": ["Pantsuit Pro"],
  "Sign in with Apple": ["Pantsuit Pro"],
  "Payment Gateways": ["Pantsuit Pro", "Lottio"],
  StoreKit: ["Agile Styling"],
  "Google Play Billing": ["Agile Styling", "Pantsuit Pro"],
  Bloc: ["Wardrobe", "Agile Styling"],
  Streams: ["Wardrobe"],
  RxDart: ["Agile Styling"],
  "Clean Architecture": ["Lottio", "Wardrobe"],
  "Performance Optimization": ["Lottio", "Wardrobe"],
}

export const education = [
  {
    school: "Riphah International University",
    detail: "Bachelor of Science in Computer Science",
    location: "Lahore, Punjab",
  },
  {
    school: "Army Public School and College",
    detail: "Intermediate in Pre-Engineering",
    location: "Jhelum, Punjab",
  },
]
