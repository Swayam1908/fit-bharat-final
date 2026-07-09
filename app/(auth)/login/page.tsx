"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Heart, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const router = useRouter()
  
  // Form values
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  
  // UI & Usability States
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Errors & Validation
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})

  // Caps Lock detection helper
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockActive(true)
    } else {
      setCapsLockActive(false)
    }
  }

  // Real-time Zod-like field validation
  useEffect(() => {
    const newErrors: { email?: string; password?: string } = {}
    
    // Email Validation
    if (touched.email) {
      if (!email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Invalid email format"
      }
    }
    
    // Password Validation
    if (touched.password) {
      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    }

    setErrors(newErrors)
  }, [email, password, touched])

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all as touched to trigger any validation errors
    setTouched({ email: true, password: true })
    
    const hasErrors = !email || !/\S+@\S+\.\S+/.test(email) || !password || password.length < 6
    if (hasErrors) return

    setIsLoading(true)
    setSubmitError(null)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setSubmitError("Incorrect email address or password. Please try again.")
        setIsLoading(false)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setSubmitError("An unexpected connection error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen bg-[#0D1512] flex items-center justify-center p-md relative overflow-hidden font-sans">
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8BCF93]/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <GlassCard variant="standard" noHover className="p-xl rounded-[24px]">
          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center gap-sm mb-lg">
            <div className="w-14 h-14 rounded-[16px] bg-gradient-to-b from-[#8BCF93] to-[#5C8D66] shadow-[0_8px_20px_rgba(79,128,90,0.25)] flex items-center justify-center text-white">
              <Heart className="h-7 w-7 fill-current" />
            </div>
            <div className="text-center mt-2">
              <h1 className="font-syne text-[28px] font-bold tracking-tight text-white leading-none">FitBharat</h1>
              <p className="text-[10px] font-semibold text-[#8BCF93] uppercase tracking-[0.15em] mt-2">
                Transformation V2
              </p>
            </div>
          </div>

          {/* Form Submit Alert */}
          {submitError && (
            <div className="mb-md p-sm rounded-[12px] bg-danger/10 border border-danger/25 text-danger text-xs font-semibold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-md">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="Enter your email address"
              error={errors.email}
              autoFocus
              required
            />

            {/* Password Field Container */}
            <div className="flex flex-col gap-1.5 relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="Enter your password"
                error={errors.password}
                required
                className="pr-12"
              />
              
              {/* Show / Hide Toggle Button */}
              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[38px] text-[#7A9583] hover:text-[#E7F3EC] focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>

              {/* Caps Lock warning indicator */}
              {capsLockActive && (
                <div className="text-[11px] text-warning font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Remember Me and Forgot Password Group */}
            <div className="flex justify-between items-center mt-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#7A9583] hover:text-[#E7F3EC] transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#141E18]/80 border-white/10 text-accent focus:ring-accent/15 focus:ring-2 h-4 w-4"
                />
                <span>Remember Me</span>
              </label>

              <Link 
                href="/forgot-password" 
                className="text-xs text-[#7A9583] hover:text-[#8BCF93] transition-colors duration-200 group relative inline-block"
              >
                <span>Forgot Password?</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#8BCF93] transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="mt-sm rounded-[16px] h-[52px]"
            >
              Sign In
            </Button>
          </form>

          {/* Social login divider */}
          <div className="flex items-center gap-md my-lg">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span className="text-[10px] font-bold text-[#7A9583] uppercase tracking-[0.1em] whitespace-nowrap">
              Or Login With
            </span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-[52px] rounded-[16px] border border-white/10 hover:border-accent/40 bg-[#141E18]/80 hover:bg-[#141E18] text-[#E7F3EC] font-sans font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-sm disabled:opacity-60 active:scale-[0.98]"
          >
            {/* White Google logo */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.8-1.57 2.1l2.4 1.86c1.4-1.3 2.22-3.22 2.22-5.81z"
              />
              <path
                fill="currentColor"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-2.4-1.86c-.7.47-1.6.76-2.56.76-1.97 0-3.64-1.33-4.24-3.12l-2.48 1.92A11.96 11.96 0 0012 24z"
              />
              <path
                fill="currentColor"
                d="M7.76 13.87a7.17 7.17 0 010-2.26l-2.48-1.92a11.98 11.98 0 000 9.1l2.48-1.92c-.15-.45-.24-.92-.24-1.45z"
              />
              <path
                fill="currentColor"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.34 0 3.32 2.68 1.28 6.56l2.48 1.92c.6-1.79 2.27-3.12 4.24-3.12z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Section */}
          <div className="text-center mt-xl flex flex-col gap-1 items-center">
            <span className="text-xs text-[#7A9583] font-medium">Don't have an account?</span>
            <Link 
              href="/register" 
              className="text-xs font-semibold text-[#8BCF93] hover:text-[#9ADF9E] flex items-center gap-1 group transition-colors duration-200 mt-1"
            >
              <span>Create New Account</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
