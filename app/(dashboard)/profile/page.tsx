"use client"

import React from "react"
import Link from "next/link"
import { useUserStore } from "@/store/useUserStore"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Activity, ArrowRight, Edit3, Dumbbell } from "lucide-react"

export default function ProfilePage() {
  const profile = useUserStore((s) => s.profile)

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section with cover background */}
      <div className="relative rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-accent/90 to-accent-dark/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(74,122,90,0.2)] p-lg min-h-[180px] flex items-center">
        {/* Soft radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full z-10 gap-md">
          {/* Avatar and User Info Group */}
          <div className="flex flex-col md:flex-row items-center gap-md text-center md:text-left">
            {/* Styled Circular Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-light to-accent text-white font-serif font-bold text-3xl flex items-center justify-center border border-white/20 shadow-md flex-shrink-0">
              {profile?.name ? profile.name[0].toUpperCase() : "S"}
            </div>
            
            {/* User Info */}
            <div className="flex flex-col items-center md:items-start gap-xs">
              <h1 className="font-syne text-[24px] font-bold text-white leading-tight">
                {profile?.name || "Swayam Gurjar"}
              </h1>
              <span className="text-xs text-white/80 font-medium">
                {profile?.email || "swayam@gmail.com"}
              </span>
              
              {/* Badges with equal height and proper contrast */}
              <div className="flex items-center gap-xs mt-sm">
                <Badge variant="glass" className="h-[24px] px-2.5 font-bold uppercase">
                  {profile?.goal_type || "Gain Muscle"}
                </Badge>
                <Badge variant="white" className="h-[24px] px-2.5 text-accent-dark border-transparent font-bold">
                  Normal BMI (22.4)
                </Badge>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Link href="/settings" className="w-auto flex-shrink-0">
            <Button variant="white" className="py-2.5 px-4 w-auto flex items-center gap-xs text-xs rounded-sm">
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid statistics summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Core Body Stats details */}
        <GlassCard className="flex flex-col gap-sm">
          <h3 className="font-syne text-sm font-bold text-text-primary">Body Statistics</h3>
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Height</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">{profile?.height || 175} cm</span>
            </div>
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Weight</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">{profile?.weight || 68.5} kg</span>
            </div>
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Goal Weight</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">{profile?.target_weight || 63} kg</span>
            </div>
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Activity Level</span>
              <span className="text-[10px] font-extrabold text-text-primary mt-2 block truncate">{profile?.activity_level || "Active"}</span>
            </div>
          </div>
        </GlassCard>

        {/* Dynamic target indexes details */}
        <GlassCard className="flex flex-col gap-sm">
          <h3 className="font-syne text-sm font-bold text-text-primary">Daily Targets</h3>
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Calorie target</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">
                {profile?.goal_type === "Gain Muscle" ? 2200 : 1800} kcal
              </span>
            </div>
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Protein Target</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">160g</span>
            </div>
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Water goal</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">{profile?.water_target || 3.0} Liters</span>
            </div>
            <div className="bg-bg-secondary/60 p-3 rounded-sm border border-border text-center">
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Sleep Goal</span>
              <span className="text-base font-extrabold text-text-primary mt-1 block">{profile?.sleep_target || 8.0} Hours</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Navigation Card shortcuts */}
      <div className="flex flex-col gap-sm">
        {/* Health Profile Link Card */}
        <Link href="/settings/health" className="block">
          <div className="flex justify-between items-center bg-bg-secondary/60 p-4.5 rounded-sm border border-border shadow-sm hover:translate-x-1.5 transition-all">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-sm bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-text-primary block">Medical & Diet Profile</span>
                <span className="text-[9px] text-text-muted font-bold block mt-0.5">Conditions, injuries, and dietary styles</span>
              </div>
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-text-muted" />
          </div>
        </Link>

        {/* Workout Plan splits Link Card */}
        <Link href="/workout" className="block">
          <div className="flex justify-between items-center bg-bg-secondary/60 p-4.5 rounded-sm border border-border shadow-sm hover:translate-x-1.5 transition-all">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-sm bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-text-primary block">Workout Splits catalog</span>
                <span className="text-[9px] text-text-muted font-bold block mt-0.5">Start or change active splits</span>
              </div>
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-text-muted" />
          </div>
        </Link>
      </div>
    </div>
  )
}

