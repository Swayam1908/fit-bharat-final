"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function RegisterPage() {
  const router = useRouter()
  
  // Input fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  
  // UI & usability states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Real-time Validation States
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean; confirmPassword?: boolean }>({})
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; colorClass: string }>({ score: 0, label: "Very Weak", colorClass: "bg-danger" })

  // Caps Lock helper
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockActive(true)
    } else {
      setCapsLockActive(false)
    }
  }

  // Calculate Password Strength in real-time
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "None", colorClass: "bg-white/10" })
      return
    }
    
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 10) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    let label = "Very Weak"
    let colorClass = "bg-danger"

    if (score >= 4) {
      label = "Strong"
      colorClass = "bg-success"
    } else if (score >= 2) {
      label = "Medium"
      colorClass = "bg-warning"
    }

    setPasswordStrength({ score, label, colorClass })
  }, [password])

  // Real-time Field Validation
  useEffect(() => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}

    if (touched.name && !name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (touched.email) {
      if (!email) {
        newErrors.email = "Email address is required"
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Invalid email format"
      }
    }

    if (touched.password) {
      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    }

    if (touched.confirmPassword) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
  }, [name, email, password, confirmPassword, touched])

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setTouched({ name: true, email: true, password: true, confirmPassword: true })

    const hasErrors = 
      !name.trim() ||
      !email || 
      !/\S+@\S+\.\S+/.test(email) || 
      !password || 
      password.length < 6 || 
      password !== confirmPassword || 
      !acceptTerms

    if (hasErrors) {
      if (!acceptTerms) {
        setError("You must accept the Terms and Conditions to continue.")
      }
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Direct signup handler via route action
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          confirmPassword,
          acceptTerms,
        }),
      })

      const data = await signupRes.json()

      if (!signupRes.ok) {
        setError(data.error || "An error occurred during account creation.")
        setIsLoading(false)
        return
      }

      // Auto login after successful signup
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (loginRes?.error) {
        router.push("/login")
      } else {
        router.push("/onboarding")
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.")
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
              <h1 className="font-syne text-[28px] font-bold tracking-tight text-white leading-none">Create Account</h1>
              <p className="text-[10px] font-semibold text-[#8BCF93] uppercase tracking-[0.15em] mt-2">
                Step 1 of 2 — Join Us
              </p>
            </div>
          </div>

          {/* Form Alert Message */}
          {error && (
            <div className="mb-md p-sm rounded-[12px] bg-danger/10 border border-danger/25 text-danger text-xs font-semibold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-md">
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="e.g. Swayam Gurjar"
              error={errors.name}
              required
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="e.g. you@example.com"
              error={errors.email}
              required
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5 relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="Minimum 6 characters"
                error={errors.password}
                required
                className="pr-12"
              />
              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[38px] text-[#7A9583] hover:text-[#E7F3EC] focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-1 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#7A9583]">
                    <span>Password Strength:</span>
                    <span className="uppercase">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${passwordStrength.colorClass} transition-all duration-300`} 
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {capsLockActive && (
                <div className="text-[11px] text-warning font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5 relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                required
                className="pr-12"
              />
              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-[38px] text-[#7A9583] hover:text-[#E7F3EC] focus:outline-none transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Terms and Conditions Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-[#7A9583] hover:text-[#E7F3EC] transition-colors mt-xs leading-relaxed">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="rounded bg-[#141E18]/80 border-white/10 text-accent focus:ring-accent/15 focus:ring-2 h-4 w-4 mt-0.5"
                required
              />
              <span>I accept the Terms of Service and Privacy Policy</span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="mt-sm rounded-[16px] h-[52px]"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Footer */}
          <div className="text-center mt-xl flex flex-col gap-1 items-center">
            <span className="text-xs text-[#7A9583] font-medium">Already have an account?</span>
            <Link 
              href="/login" 
              className="text-xs font-semibold text-[#8BCF93] hover:text-[#9ADF9E] flex items-center gap-1 group transition-colors duration-200 mt-1"
            >
              <span>Sign In</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
