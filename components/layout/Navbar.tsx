"use client"

import React, { useState } from "react"
import { Bell, Search } from "lucide-react"
import { ThemeToggle } from "../ui/ThemeToggle"

export const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: "Workout Reminder", desc: "Don't miss your Leg Day routine today!", time: "1 hour ago", unread: true },
    { id: 2, title: "Garden Milestone", desc: "Consistency score is above 80%! Your tree grew.", time: "4 hours ago", unread: false },
    { id: 3, title: "Streak Warning", desc: "Log a meal or workout to save your 5-day streak!", time: "8 hours ago", unread: true }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="h-16 border-b border-border bg-bg-primary backdrop-blur-xl px-lg flex items-center justify-between sticky top-0 z-30">
      {/* Search Input bar (Left aligned - Solid color to avoid hex variable opacity fallback) */}
      <div className="relative w-64 max-w-xs hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search workouts, meals, logs..."
          className="w-full bg-bg-secondary border border-border rounded-[16px] pl-11 pr-4 h-[44px] text-xs font-sans text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:shadow-glow transition-all"
        />
      </div>
      <div className="sm:hidden font-syne font-bold text-sm text-text-primary">FitBharat</div>

      {/* Utilities (Right aligned with equal spacing) */}
      <div className="flex items-center gap-md">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative flex items-center">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-sm bg-bg-secondary border border-border hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all relative outline-none flex items-center justify-center h-[38px] w-[38px]"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-warning animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-bg-secondary border border-border shadow-lg rounded-sm p-4 z-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-syne text-xs font-extrabold text-text-primary">Recent Notifications</h4>
                {unreadCount > 0 && <span className="text-[9px] font-extrabold text-warning uppercase tracking-wider">{unreadCount} Unread</span>}
              </div>
              <div className="flex flex-col gap-2.5">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 rounded-sm border transition-all ${n.unread ? "bg-accent/10 border-accent/20" : "bg-transparent border-transparent"}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-sans text-xs font-bold text-text-primary block">{n.title}</span>
                      <span className="text-[8px] text-text-muted">{n.time}</span>
                    </div>
                    <span className="text-[10px] text-text-secondary block font-medium leading-relaxed">{n.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Navbar

