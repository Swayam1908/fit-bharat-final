"use client"

import React from "react"
import { motion } from "framer-motion"

interface TabOption {
  id: string
  label: string
}

interface TabsProps {
  options: TabOption[]
  activeTab: string
  onChange: (id: string) => void
  variant?: "pill" | "underline" | "segment"
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeTab,
  onChange,
  variant = "pill",
  className = ""
}) => {
  if (variant === "segment") {
    return (
      <div className={`flex bg-sage-light/10 p-1 rounded-xl ${className}`}>
        {options.map((opt) => {
          const isActive = opt.id === activeTab
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all relative ${
                isActive ? "text-sage-dark" : "text-text-3 hover:text-text-2"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="segment-bg"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === "underline") {
    return (
      <div className={`flex border-b border-sage-light/20 ${className}`}>
        {options.map((opt) => {
          const isActive = opt.id === activeTab
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`px-4 py-2.5 text-xs font-bold transition-all relative border-b-2 ${
                isActive ? "border-sage text-sage-dark" : "border-transparent text-text-3 hover:text-text-2"
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const isActive = opt.id === activeTab
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-4.5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
              isActive
                ? "bg-sage text-white shadow-[0_4px_16px_rgba(123,174,127,0.35)]"
                : "bg-white/80 border border-sage-light/25 text-text-3 hover:bg-sage hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

