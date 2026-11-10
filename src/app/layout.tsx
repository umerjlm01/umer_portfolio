import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syed Muhammad Umer · Mobile Application Developer",
  description:
    "Mobile Application Developer with 2+ years shipping Flutter and React Native apps for Android and iOS. Auth, payments, Twilio, Cloudflare, Google Cloud, and AWS on production work including networking, e-commerce, chat, and subscriptions.",
  keywords: [
    "Mobile Application Developer",
    "Flutter",
    "React Native",
    "Next.js",
    "Syed Muhammad Umer",
    "Dart",
    "Supabase",
    "Firebase",
    "PayPal",
    "Stripe",
    "Twilio",
    "Cloudflare",
    "AWS",
    "Google Cloud",
    "Facebook Sign-In",
    "Portfolio",
  ],
  authors: [{ name: "Syed Muhammad Umer" }],
  icons: {
    icon: "/portfolio/favicon.svg",
  },
  openGraph: {
    title: "Syed Muhammad Umer · Mobile Application Developer",
    description:
      "Mobile Application Developer with 2+ years shipping Flutter apps for Android and iOS — payments, OAuth, Twilio, and cloud infra. Interactive 3D portfolio.",
    siteName: "Syed Muhammad Umer",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#08080a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
