"use client"

import React from "react"
import { motion } from "framer-motion"

interface GlassCardProps {
  children: React.ReactNode
  variant?: "standard" | "dark" | "sage"
  className?: string
  noHover?: boolean
  onClick?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = "standard",
  className = "",
  noHover = false,
  onClick
}) => {
  // All variants now use semantic CSS tokens so they respond to [data-theme="light"]
  const styles = {
    standard: "bg-bg-secondary border border-border shadow-md text-text-primary",
    dark:     "bg-bg-primary border border-border shadow-md text-text-primary",
    sage:     "bg-gradient-to-br from-accent/10 to-accent-light/15 border border-accent/20 text-text-primary"
  }

  const rounded = "rounded-lg"
  const padding = "p-lg"

  if (noHover || onClick) {
    return (
      <motion.div
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
        className={`${styles[variant]} ${rounded} ${padding} ${onClick ? "cursor-pointer" : ""} ${className}`}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${styles[variant]} ${rounded} ${padding} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}
export default GlassCard

