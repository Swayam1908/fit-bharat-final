"use client"

import React, { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import { useUserStore } from "@/store/useUserStore"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useNutritionStore } from "@/store/useNutritionStore"
import { useGardenStore } from "@/store/useGardenStore"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const fetchProfile = useUserStore((s) => s.fetchProfile)
  const fetchHistory = useWorkoutStore((s) => s.fetchHistory)
  const fetchMeals = useNutritionStore((s) => s.fetchMeals)
  const fetchLifestyle = useNutritionStore((s) => s.fetchLifestyle)
  const fetchGarden = useGardenStore((s) => s.fetchGardenState)

  useEffect(() => {
    const userId = session?.user && (session.user as any).id 
      ? (session.user as any).id 
      : "c7066f3f-a96e-4dda-9de8-914a6232fee7" 

    if (status === "authenticated" || status === "unauthenticated") {
      fetchProfile(userId)
      fetchHistory(userId)
      fetchMeals(userId)
      fetchLifestyle(userId)
      fetchGarden(userId)
    }
  }, [session, status, fetchProfile, fetchHistory, fetchMeals, fetchLifestyle, fetchGarden])

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      {/* Permanent sidebar for Desktop / large screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        
        {/* Scrollable Container with Smooth Scroll styling */}
        <main className="flex-1 p-lg overflow-y-auto max-w-7xl mx-auto w-full scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Mobile View Navigation Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-secondary backdrop-blur-md border-t border-border flex items-center justify-around z-40 px-4">
          <a href="/dashboard" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${pathname === "/dashboard" ? "text-accent animate-pulse" : "text-text-secondary"}`}>
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Home</span>
          </a>
          <a href="/workout" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${pathname === "/workout" ? "text-accent animate-pulse" : "text-text-secondary"}`}>
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 4v6a6 6 0 0012 0V4" />
              <line x1="12" y1="4" x2="12" y2="2" />
            </svg>
            <span>Workout</span>
          </a>
          <a href="/nutrition" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${pathname === "/nutrition" ? "text-accent animate-pulse" : "text-text-secondary"}`}>
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 8h1a4 4 0 010 8h-1" />
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
            </svg>
            <span>Meals</span>
          </a>
          <a href="/garden" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${pathname === "/garden" ? "text-accent animate-pulse" : "text-text-secondary"}`}>
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
            </svg>
            <span>Garden</span>
          </a>
          <a href="/profile" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${pathname === "/profile" ? "text-accent animate-pulse" : "text-text-secondary"}`}>
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}

