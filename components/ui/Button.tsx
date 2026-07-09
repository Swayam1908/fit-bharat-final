"use client"

import React from "react"
import { motion } from "framer-motion"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "white" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}) => {
  // Shared base â€” identical for every button
  const base =
    "relative inline-flex items-center justify-center font-sans font-semibold tracking-[0.2px] border rounded-[16px] outline-none select-none overflow-hidden transition-all duration-200"

  // Variant colors â€” only color rules, no sizing here
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-b from-[#8BCF93] to-[#5C8D66] text-white border-transparent shadow-[0_8px_20px_rgba(79,128,90,0.25)] hover:from-[#9ADF9E] hover:to-[#6C9E76]",
    secondary:
      "bg-bg-secondary text-text-primary border-border hover:bg-bg-hover",
    outline:
      "bg-transparent text-accent border-accent/40 hover:border-accent hover:bg-accent/5",
    destructive:
      "bg-danger text-white border-transparent shadow-[0_8px_20px_rgba(217,107,107,0.2)] hover:bg-danger/90",
    white:
      "bg-white text-[#0D1512] border-transparent shadow-sm hover:bg-white/90",
    ghost:
      "bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-hover",
  }

  // Sizes â€” all buttons of the same size will be exactly the same height
  const sizes: Record<string, string> = {
    sm: "h-[36px] px-4 text-[11px] gap-1.5",
    md: "h-[44px] px-6 text-xs gap-2 w-full",
    lg: "h-[52px] px-8 text-sm gap-2 w-full",
  }

  const disabled = isLoading || props.disabled

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {/* Shimmer sweep on hover â€” only visible on primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}

      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      <span className="relative z-10 flex items-center justify-center gap-1.5 leading-none">
        {children}
      </span>
    </motion.button>
  )
}
export default Button

