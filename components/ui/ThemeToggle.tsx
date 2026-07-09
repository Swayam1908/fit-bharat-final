"use client"

import React, { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark") // Default to premium dark

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || "dark"
    setTheme(initialTheme)
    document.documentElement.setAttribute("data-theme", initialTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)
    document.documentElement.setAttribute("data-theme", nextTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-sm bg-bg-secondary/80 border border-border hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all outline-none flex items-center justify-center h-[38px] w-[38px]"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
    </button>
  )
}
export default ThemeToggle

