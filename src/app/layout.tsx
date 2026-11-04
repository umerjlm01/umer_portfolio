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
    "Mobile Application Developer with 1+ years of experience shipping cross-platform apps for Android and iOS with Flutter: networking, e-commerce, realtime chat, and subscription products.",
  keywords: [
    "Mobile Application Developer",
    "Flutter",
    "Syed Muhammad Umer",
    "Dart",
    "Supabase",
    "Firebase",
    "Portfolio",
  ],
  authors: [{ name: "Syed Muhammad Umer" }],
  icons: {
    icon: "/portfolio/favicon.svg",
  },
  openGraph: {
    title: "Syed Muhammad Umer · Mobile Application Developer",
    description:
      "Mobile Application Developer shipping cross-platform apps for Android and iOS with Flutter. Interactive 3D portfolio showcase.",
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
