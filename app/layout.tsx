import type { Metadata } from "next"
import { DM_Sans, Syne, Playfair_Display } from "next/font/google"
import { NextAuthProvider } from "@/providers/NextAuthProvider"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
})

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair-display",
})

export const metadata: Metadata = {
  title: "FitBharat — Gamified Transformation Fitness App",
  description: "Track workouts, count calories, and grow your digital transformation garden.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${syne.variable} ${playfairDisplay.variable} font-sans`}
      >
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}

