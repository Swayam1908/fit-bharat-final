import React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "sage" | "green" | "orange" | "red" | "white" | "glass"
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "sage",
  className = ""
}) => {
  const styles = {
    sage:   "bg-accent/15 text-accent border border-accent/25",
    green:  "bg-success/15 text-success border border-success/25",
    orange: "bg-warning/15 text-warning border border-warning/25",
    red:    "bg-danger/15 text-danger border border-danger/25",
    white:  "bg-white/10 text-white border border-white/20",
    // glass no longer looks like a plain HTML box â€” matches the design surface color
    glass:  "bg-bg-hover text-text-secondary border border-border",
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-4 rounded-full text-[10px] font-semibold font-sans h-[28px] tracking-wide leading-none flex-shrink-0 select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
export default Badge

