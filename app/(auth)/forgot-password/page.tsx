"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Send, AlertTriangle } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [touched, setTouched] = useState(false)

  // Real-time validation
  useEffect(() => {
    if (touched) {
      if (!email) {
        setEmailError("Email address is required")
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError("Invalid email format")
      } else {
        setEmailError(undefined)
      }
    }
  }, [email, touched])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || "An error occurred. Please try again.")
      }
    } catch (err) {
      setError("Connection error. Please check your internet connectivity.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1512] flex items-center justify-center p-md relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8BCF93]/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <GlassCard variant="standard" noHover className="p-xl rounded-[24px]">
          {/* Header */}
          <div className="flex flex-col items-center gap-sm mb-lg">
            <div className="w-14 h-14 rounded-[16px] bg-gradient-to-b from-[#8BCF93] to-[#5C8D66] shadow-[0_8px_20px_rgba(79,128,90,0.25)] flex items-center justify-center text-white">
              <Heart className="h-7 w-7 fill-current" />
            </div>
            <div className="text-center mt-2">
              <h1 className="font-syne text-[28px] font-bold tracking-tight text-white leading-none">Reset Password</h1>
              <p className="text-[10px] font-semibold text-[#8BCF93] uppercase tracking-[0.15em] mt-2">
                Get a recovery link
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-md p-sm rounded-[12px] bg-danger/10 border border-danger/25 text-danger text-xs font-semibold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center flex flex-col gap-md py-md">
              <div className="w-12 h-12 rounded-full bg-green/10 text-[#8BCF93] flex items-center justify-center mx-auto">
                <Send className="h-5 w-5" />
              </div>
              <div className="my-2">
                <h3 className="text-sm font-bold text-white mb-1">Check Your Email</h3>
                <p className="text-xs text-[#7A9583] leading-relaxed">
                  If an account exists for <strong className="text-[#E7F3EC]">{email}</strong>, we sent a password reset link there.
                </p>
              </div>
              <Link 
                href="/login" 
                className="text-xs font-semibold text-[#8BCF93] hover:text-[#9ADF9E] flex items-center justify-center gap-1 group transition-colors duration-200 mt-2"
              >
                <span>Back to Login</span>
                <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Enter your email address"
                error={emailError}
                required
                autoFocus
              />
              
              <Button 
                type="submit" 
                size="lg" 
                isLoading={isLoading}
                className="mt-sm rounded-[16px] h-[52px]"
              >
                Send Recovery Link
              </Button>
              
              <div className="text-center mt-md">
                <Link 
                  href="/login" 
                  className="text-xs text-[#7A9583] hover:text-[#8BCF93] transition-colors duration-200 group relative inline-block"
                >
                  <span>Back to Login</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#8BCF93] transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
