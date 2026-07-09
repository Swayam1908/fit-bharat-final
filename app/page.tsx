"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function RootPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Splash Spinner */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage to-sage-dark animate-pulse shadow-[0_8px_32px_rgba(74,122,90,0.2)] flex items-center justify-center text-white">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle className="opacity-25" cx="12" cy="12" r="10" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <span className="font-syne text-xs font-bold text-sage-dark uppercase tracking-widest">FitBharat Loading...</span>
      </div>
    </div>
  )
}
