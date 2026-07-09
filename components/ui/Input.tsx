"use client"

import React, { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, style, ...props }, ref) => {
    const inputId = id || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-semibold text-[#A8C5AA] uppercase tracking-[0.08em] font-sans"
          >
            {label}
          </label>
        ) : null}
        
        <input
          ref={ref}
          id={inputId}
          style={{
            background: "rgba(20, 30, 24, 0.85)",
            border: error ? "1px solid var(--danger)" : "1px solid rgba(255, 255, 255, 0.08)",
            ...style
          }}
          className={`w-full h-[56px] px-[18px] rounded-[16px] text-[#E7F3EC] font-sans font-medium text-sm placeholder:text-[#7A9583] placeholder:opacity-100 outline-none transition-all duration-200 focus:border-[#7BAE7F] focus:ring-4 focus:ring-[#7BAE7F]/15 ${className}`}
          {...props}
        />
        
        {error ? (
          <span className="text-[11px] text-danger font-semibold tracking-wide mt-0.5">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-[11px] text-text-muted font-medium mt-0.5">
            {helperText}
          </span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input
