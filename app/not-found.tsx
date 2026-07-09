"use client"

import React from "react"
import Link from "next/link"
import { Sprout } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-5 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-sage-ultra text-sage flex items-center justify-center shadow-sm">
          <Sprout className="h-9 w-9 animate-bounce" />
        </div>
        <div>
          <h1 className="font-syne text-3xl font-extrabold text-text mb-2">404 — Lost in the Woods</h1>
          <p className="text-xs text-text-3 leading-relaxed">
            The page you are looking for has either been moved or does not exist in this ecosystem. Let's return back to your dashboard.
          </p>
        </div>
        <Link href="/dashboard" className="w-full">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
