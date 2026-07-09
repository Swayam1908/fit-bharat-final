"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutGrid, 
  Dumbbell, 
  Apple, 
  Sprout, 
  BarChart3, 
  Trophy, 
  Activity, 
  User, 
  Settings,
  Heart,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"

export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Workout Plans", href: "/workout", icon: Dumbbell },
    { name: "Nutrition Today", href: "/nutrition", icon: Apple },
    { name: "My Garden", href: "/garden", icon: Sprout },
    { name: "Analytics & Trends", href: "/analytics", icon: BarChart3 },
    { name: "Challenges", href: "/challenges", icon: Trophy },
    { name: "Health Profile", href: "/settings/health", icon: Activity },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <aside className="w-64 border-r border-border bg-bg-secondary h-screen sticky top-0 flex flex-col justify-between p-lg z-40">
      {/* Top Section */}
      <div className="flex flex-col gap-lg">
        {/* Brand Logo */}
        <div className="flex items-center gap-sm px-2">
          <div className="w-[36px] h-[36px] rounded-sm bg-gradient-to-br from-accent to-accent-dark shadow-sm flex items-center justify-center text-white">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="font-syne text-lg font-extrabold tracking-tight text-text-primary block">FitBharat</span>
            <span className="text-[11px] font-medium text-accent-light uppercase tracking-wider block -mt-1">Transformation v2</span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex flex-col gap-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="w-full block"
              >
                <div
                  className={`flex items-center gap-md px-4 rounded-[16px] text-[11px] font-bold transition-all duration-200 select-none h-[46px] ${
                    isActive
                      ? "bg-accent text-white shadow-[0_4px_12px_rgba(123,174,127,0.35)]"
                      : "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 stroke-[2.2px] flex-shrink-0 ${isActive ? "text-white" : "text-text-secondary"}`} />
                  <span className="leading-none">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Profile Footer (Fixed permanently to bottom-left) */}
      <div className="border-t border-border pt-md flex flex-col gap-sm px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-light to-accent text-white font-serif font-bold text-sm flex items-center justify-center border border-white/10 shadow-sm">
              S
            </div>
            <div className="truncate max-w-[120px]">
              <span className="font-syne text-[11px] font-bold text-text-primary block truncate">Swayam Gurjar</span>
              <span className="text-[10px] text-text-muted font-medium block truncate">swayam@gmail.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-all outline-none"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar

