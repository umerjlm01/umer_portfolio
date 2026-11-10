export const profile = {
  name: "Syed Muhammad Umer",
  shortName: "Umer",
  role: "Mobile Application Developer",
  tagline: "Mobile Application Developer",
  heroTagline:
    "I build and ship mobile apps for Android and iOS: networking, e-commerce, realtime chat, and subscriptions.",
  location: "Lahore, Punjab, Pakistan",
  phone: "+92 334-5558580",
  phoneHref: "+923345558580",
  email: "umerjlm01@gmail.com",
  linkedin: "https://www.linkedin.com/in/syed-muhammad-umer-94b63a299",
  linkedinLabel: "syed-muhammad-umer",
  github: "https://github.com/umerjlm01",
  githubLabel: "umerjlm01",
  cvUrl:
    "/portfolio/Syed%20Muhammad%20Umer%20Mobile%20Application%20Dev%20CV.pdf",
  summary:
    "Mobile Application Developer with 2+ years of experience shipping cross-platform Android and iOS apps with Flutter, Bloc, GetX, and React Native. Work spans networking, e-commerce, real-time chat, lottery operations, and AI styling with subscriptions, including 3 apps on the Play Store / App Store and 4+ payment / in-app purchase integrations.",
  summaryExtra:
    "Experienced with Firebase and Supabase backends, PayPal, Stripe and other payment gateways, RevenueCat, FCM, deep linking, and ZegoCloud voice/video. On production apps I have also shipped Facebook Sign-In, Twilio messaging, and infra with Cloudflare, Google Cloud, and AWS. I own features end to end: architecture, UI/UX, APIs, authentication, payments, push notifications, testing, store listings, and Google Play / App Store release. Day to day I build with Claude, Cursor, Gemini, and Google Antigravity.",
}

export const about = {
  self: [
    "I write code for a living, treat pizza like a food group, and watch football until the last minute of extra time. Dark humor is my default setting; if the room goes quiet, that was probably me.",
    "I do not talk much unless I am with the people I actually care about. Then good luck getting a word in. Between matches I disappear into TV shows and a soundtrack that runs from Pink Floyd and Led Zeppelin to Coldplay.",
  ],
  others:
    "People who know me say I know my boundaries and I read the room: I meet people where they are and keep the energy accordingly. Quiet until it counts, then I show up.",
  hobbies: [
    "Football",
    "TV shows",
    "Music: Pink Floyd, Led Zeppelin, Coldplay",
    "Pizza, obviously",
  ],
  volunteer:
    "I helped teach computer topics to students at the government school where my mother teaches, covering the basics so her classes had extra hands when they needed them.",
}

export const stats = [
  { value: "2+", label: "Years Mobile Application Experience" },
  { value: "3", label: "Apps on Play Store / App Store" },
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
      "A professional networking platform built and maintained in Flutter, with secure authentication, payments, and content publishing across mobile and web. Store release coming soon on the App Store; live on Google Play.",
    highlights: [
      "Delivered end to end: architecture, UI/UX, APIs, authentication, and store-ready release",
      "Implemented email/OTP sign-in plus Google, Facebook Sign-In, and Apple OAuth",
      "Integrated Twilio messaging alongside Firebase notifications and analytics",
      "Built deep linking for membership, payment, and content flows",
      "Integrated PayPal, Stripe, and payment gateways for memberships and subscriptions",
      "Used Cloudflare, Google Cloud, and AWS for delivery/infra; tracked web presence with Google Search Console",
      "Content publishing (jobs / events / articles) with Play Store privacy and compliance",
    ],
    stack: [
      "Flutter",
      "Firebase",
      "Facebook Sign-In",
      "Twilio",
      "Cloudflare",
      "Google Cloud",
      "AWS",
      "PayPal",
      "Stripe",
    ],
    screenshot: "/portfolio/screens/pantsuit-professionals.png",
    accent: "#dda0b5",
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
      "Lottery app built from scratch covering sortitions, tickets, and prepaid bill payments.",
    highlights: [
      "Built from scratch in Flutter with Clean Architecture through testing and deployment",
      "Dynamic sortition system with play validations",
      "Full ticket lifecycle: create, delete, duplicate & monitor",
      "Added prepaid payments with PayPal and Stripe, sharing payment workflows with existing transactions",
      "Synchronized with the web platform through real-time API integration",
      "Core domain logic designed for scale and maintainable releases",
    ],
    stack: ["Flutter", "REST API", "PayPal", "Stripe", "Clean Architecture", "Dio"],
    screenshot: "/portfolio/screens/cnp-lottio.png",
    accent: "#5da8e8",
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
      "Photo-based AI styling app with in-app purchases, shipped on Google Play and the App Store.",
    highlights: [
      "Managed store listings, TestFlight and Play testing, and in-app purchase compliance for both stores",
      "RevenueCat IAP: Silver / Gold / Platinum / Diamond tiers, monthly and annual",
      "Consumable match packs with coupon and referral discounts",
      "Added FCM push and local notifications with deep-link referrals",
      "Delivered photo-based AI matching with an overlay match UI",
      "Account and plan management on real devices via TestFlight and Play",
    ],
    stack: [
      "Flutter",
      "RevenueCat",
      "IAP",
      "FCM",
      "Deep Linking",
      "StoreKit",
      "App Store",
      "Google Play",
    ],
    screenshot: "/portfolio/screens/agile-styling.png",
    accent: "#ef8fab",
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
      "Clothing e-commerce app with live chat, maps, and voice/video calling.",
    highlights: [
      "Built end to end: authentication, product catalog, cart, chat, calls, and push notifications",
      "Integrated Dio for APIs and Supabase for backend services, including order management",
      "Implemented real-time chat with Google Maps locations, ZegoCloud voice/video calls, and WhatsApp-style attachments",
      "Managed state with Bloc and Streams; delivered FCM notifications via Supabase Edge Functions",
    ],
    stack: ["Flutter", "Supabase", "Dio", "ZegoCloud", "Bloc", "FCM"],
    screenshot: "/portfolio/screens/wardrobe-chat.png",
    accent: "#c9ad8a",
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
      "OAuth, RevenueCat, PayPal, Stripe and other payment gateways, memberships, and consumable IAP tested on real devices.",
  },
  {
    title: "Realtime & backend integration",
    description:
      "REST, Firebase, Supabase, FCM, deep linking, and live features like chat and voice/video (ZegoCloud).",
  },
  {
    title: "Maintainable architecture",
    description:
      "Bloc, GetX, Clean Architecture, and performance work: caching, async pipelines, and clear module boundaries.",
  },
]

export const experience = [
  {
    role: "Flutter Developer",
    company: "Rev9 Solutions",
    period: "Nov 2024 to Present",
    location: "Jhelum, Punjab",
    current: true,
    points: [
      "Ship and maintain Flutter features for production apps (networking, styling, lottery) used by real customers on Google Play and internal deployments.",
      "Integrate REST APIs, payment gateways, and analytics end to end, from architecture and UI through to store release.",
      "Improve reliability and performance by handling async flows and integration edge cases within a maintainable, Clean Architecture codebase.",
      "Collaborate with cross-functional and backend teams on API contracts, feature delivery, and testing.",
    ],
  },
  {
    role: "Flutter Intern",
    company: "Rev9 Solutions",
    period: "Aug 2024 to Oct 2024",
    location: "Jhelum, Punjab",
    current: false,
    points: [
      "Built cross-platform mobile modules with Flutter, Dart, Dio, and Supabase, including orders and authenticated e-commerce browsing.",
      "Implemented real-time engagement features: push notifications via FCM and Supabase Edge Functions, and voice/video chat with ZegoCloud.",
      "Built responsive UI with Bloc and Streams on Clean Architecture; improved performance through caching and network optimization.",
    ],
  },
]

export const skillGroups = [
  {
    title: "Languages & Frameworks",
    icon: "code",
    skills: ["Dart", "Flutter", "React Native", "Next.js", "Python", "PHP"],
  },
  {
    title: "AI & Assistants",
    icon: "sparkles",
    skills: ["Claude", "Cursor", "Gemini", "Google Antigravity"],
  },
  {
    title: "Backend & Integration",
    icon: "database",
    skills: [
      "REST API",
      "Firebase",
      "Supabase",
      "Dio",
      "ZegoCloud",
      "Twilio",
      "Cloudflare",
      "Google Cloud",
      "AWS",
    ],
  },
  {
    title: "Analytics & Notifications",
    icon: "bell",
    skills: [
      "Firebase Analytics",
      "Google Analytics",
      "Google Search Console",
      "FCM",
      "Deep Linking",
    ],
  },
  {
    title: "Payments & Auth",
    icon: "card",
    skills: [
      "PayPal",
      "Stripe",
      "Payment Gateways",
      "RevenueCat (IAP / Subscriptions)",
      "Google Sign-In",
      "Facebook Sign-In",
      "Sign in with Apple",
      "StoreKit",
      "Google Play Billing",
    ],
  },
  {
    title: "Stores & Delivery",
    icon: "store",
    skills: [
      "Google Play",
      "App Store",
      "TestFlight",
      "UI/UX",
      "Responsive Testing",
    ],
  },
  {
    title: "Tools & Practices",
    icon: "wrench",
    skills: [
      "Git",
      "Bloc",
      "GetX",
      "Streams",
      "RxDart",
      "Redux / Redux Toolkit",
      "Context API",
      "Hooks",
      "React Navigation",
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
  "Facebook Sign-In": ["Pantsuit Pro"],
  "Sign in with Apple": ["Pantsuit Pro"],
  Twilio: ["Pantsuit Pro"],
  Cloudflare: ["Pantsuit Pro"],
  "Google Cloud": ["Pantsuit Pro"],
  AWS: ["Pantsuit Pro"],
  "Google Search Console": ["Pantsuit Pro"],
  Git: ["Pantsuit Pro", "Lottio", "Agile Styling", "Wardrobe"],
  PayPal: ["Pantsuit Pro", "Lottio"],
  Stripe: ["Pantsuit Pro", "Lottio"],
  "Payment Gateways": ["Pantsuit Pro", "Lottio"],
  StoreKit: ["Agile Styling"],
  "Google Play Billing": ["Agile Styling", "Pantsuit Pro"],
  "Google Play": ["Pantsuit Pro", "Agile Styling"],
  "App Store": ["Agile Styling"],
  TestFlight: ["Agile Styling"],
  "UI/UX": ["Pantsuit Pro", "Lottio", "Agile Styling", "Wardrobe"],
  "Responsive Testing": ["Pantsuit Pro", "Lottio", "Agile Styling", "Wardrobe"],
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
