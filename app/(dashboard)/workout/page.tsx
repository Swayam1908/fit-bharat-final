"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useWorkoutStore, WorkoutPlan } from "@/store/useWorkoutStore"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Dumbbell, Calendar, ChevronRight, Play } from "lucide-react"

export default function WorkoutPlansPage() {
  const router = useRouter()
  const plans = useWorkoutStore((s) => s.plans)
  const history = useWorkoutStore((s) => s.history)
  const startWorkout = useWorkoutStore((s) => s.startWorkout)

  const handleStartPlan = (plan: WorkoutPlan) => {
    startWorkout(plan)
    router.push("/workout/log")
  }

  const currentMonthWorkouts = history.filter(h => {
    const date = new Date(h.completed_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  const currentWeekWorkouts = history.filter(h => {
    const date = new Date(h.completed_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }).length

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne text-[32px] font-bold text-text-primary">Workouts</h1>
          <p className="text-xs text-text-secondary font-medium">Select a workout routine or build custom logs</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => handleStartPlan({
            id: "plan-custom",
            title: "Custom Workout",
            type: "Strength",
            description: "Custom routines logged",
            exercises: []
          })} 
          className="w-auto shadow-sm"
        >
          + Custom Routine
        </Button>
      </div>

      {/* Summary statistics layout */}
      <div className="grid grid-cols-3 gap-md">
        <GlassCard className="text-center">
          <span className="font-serif text-3xl font-bold text-accent block">
            {currentMonthWorkouts || 12}
          </span>
          <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider mt-1 block">This Month</span>
        </GlassCard>
        <GlassCard className="text-center">
          <span className="font-serif text-3xl font-bold text-accent block">
            {currentWeekWorkouts || 4}
          </span>
          <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider mt-1 block">This Week</span>
        </GlassCard>
        <GlassCard className="text-center">
          <span className="font-serif text-3xl font-bold text-orange block">3</span>
          <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider mt-1 block">Personal Records</span>
        </GlassCard>
      </div>

      {/* Workout Routines selection list */}
      <div className="flex flex-col gap-md">
        <h2 className="font-syne text-lg font-bold text-text-primary">Workout Splits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {plans.map((plan) => (
            <GlassCard key={plan.id} className="flex justify-between items-center">
              <div className="flex flex-col gap-xs">
                <Badge variant={plan.type === "Strength" ? "sage" : plan.type === "Cardio" ? "green" : "sage"}>{plan.type}</Badge>
                <h3 className="font-syne text-sm font-bold text-text-primary mt-1">{plan.title}</h3>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold max-w-[200px]">
                  {plan.description}
                </p>
                <span className="text-[10px] font-bold text-accent mt-1 block">
                  {plan.exercises.map(x => x.name).join(" Â· ")}
                </span>
              </div>
              
              {/* Premium play button - centered exactly, shadow, glow */}
              <button 
                onClick={() => handleStartPlan(plan)}
                className="w-10 h-10 rounded-full bg-gradient-to-b from-[#8BCF93] to-[#5C8D66] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(123,174,127,0.35)] hover:shadow-[0_0_20px_rgba(123,174,127,0.5)] hover:-translate-y-0.5 transition-all duration-200 outline-none flex-shrink-0"
              >
                <Play className="h-4.5 w-4.5 fill-current pl-0.5" />
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Workout history list */}
      <div className="flex flex-col gap-sm">
        <h2 className="font-syne text-lg font-bold text-text-primary">Workout History logs</h2>
        <div className="flex flex-col gap-sm">
          {history.length > 0 ? (
            history.map((log) => (
              <GlassCard key={log.id} className="flex justify-between items-center hover:translate-x-1.5 transition-all duration-300">
                <div className="flex items-center gap-md">
                  <div className="w-[38px] h-[38px] rounded-sm bg-[#223128] text-accent flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text-primary">{log.title}</h3>
                    <p className="text-[10px] text-text-secondary font-bold mt-0.5 uppercase tracking-wide">
                      {log.exercises_data.map(x => x.name).join(" Â· ")}
                    </p>
                    <div className="flex gap-sm mt-1.5">
                      <Badge variant="glass">{log.duration_minutes} mins</Badge>
                      <Badge variant="orange">{log.total_volume_kg} kg Volume</Badge>
                      <span className="text-[10px] text-text-muted font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.completed_at}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-text-muted" />
              </GlassCard>
            ))
          ) : (
            <GlassCard noHover className="text-center">
              <span className="text-xs text-text-muted font-semibold">No workouts logged yet. Select a plan to start your journey!</span>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}

