"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function SplashPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-between p-lg relative overflow-hidden">
      {/* Decorative Blob assets */}
      <div className="absolute w-[320px] h-[320px] rounded-full bg-white/5 blur-2xl top-[-80px] left-[-60px] pointer-events-none" />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-accent/5 blur-2xl bottom-[60px] right-[-40px] pointer-events-none" />

      {/* Spacer to center main group */}
      <div className="h-10" />

      {/* Logo & Slogan info */}
      <div className="flex flex-col items-center gap-md z-10 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-bg-secondary border border-border rounded-xl flex items-center justify-center shadow-md"
        >
          <Heart className="h-10 w-10 text-accent fill-current animate-pulse" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-xs"
        >
          <h1 className="font-syne text-[40px] font-extrabold tracking-tight text-text-primary">FitBharat</h1>
          <p className="font-serif text-lg text-text-secondary">Sage Green Â· Light UI Kit Â· Premium</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.4 }}
          className="max-w-xs text-xs font-bold text-text-muted leading-relaxed"
        >
          A gamified transformation ecosystem that grows and responds to your discipline, habits, and physical progress.
        </motion.p>
      </div>

      {/* Footer controls */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm flex flex-col gap-xs z-10 mb-lg"
      >
        <Button onClick={() => router.push("/login")}>
          Sign In
        </Button>
        <Button variant="secondary" onClick={() => router.push("/register")}>
          Create New Account
        </Button>
        <span className="text-[9px] font-extrabold text-text-muted text-center uppercase tracking-wider block mt-sm">
          FitBharat Fitness Platform v2.0
        </span>
      </motion.div>
    </div>
  )
}

