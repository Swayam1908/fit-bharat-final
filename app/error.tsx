"use client"

import React, { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-5 p-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-red/10 text-red flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <h2 className="font-syne text-sm font-bold text-text mb-1">Something Went Wrong</h2>
        <p className="text-[10px] text-text-3 leading-relaxed">
          An unexpected error occurred while syncing your habits or rendering the garden canvas.
        </p>
      </div>
      <div className="flex gap-2.5 w-full">
        <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
          Refresh Page
        </Button>
        <Button onClick={reset} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  )
}
