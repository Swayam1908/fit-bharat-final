"use client"

import React, { useState } from "react"
import { useUserStore } from "@/store/useUserStore"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useNutritionStore } from "@/store/useNutritionStore"
import { useGardenStore } from "@/store/useGardenStore"
import { ProgressRing } from "@/components/ui/ProgressRing"
import { GardenWidget } from "@/components/garden/GardenWidget"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { 
  Flame, 
  Trophy, 
  Plus, 
  Droplet, 
  Moon, 
  Footprints, 
  ArrowRight,
  BrainCircuit
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

export default function DashboardPage() {
  const profile = useUserStore((s) => s.profile)
  const history = useWorkoutStore((s) => s.history)
  
  const getTotalsForDate = useNutritionStore((s) => s.getTotalsForDate)
  const logLifestyle = useNutritionStore((s) => s.logLifestyle)
  
  const gardenStage = useGardenStore((s) => s.growthStage)
  const plants = useGardenStore((s) => s.plants)
  const consistencyScore = useGardenStore((s) => s.consistencyScore)
  const calculateScore = useGardenStore((s) => s.calculateConsistencyScore)
  const updateGardenState = useGardenStore((s) => s.updateGardenState)

  const [waterLoggedToday, setWaterLoggedToday] = useState(2.2)
  const [stepsLoggedToday, setStepsLoggedToday] = useState(5200)
  const [sleepLoggedToday, setSleepLoggedToday] = useState(7.5)

  const todayStr = new Date().toISOString().split("T")[0]
  const totals = getTotalsForDate(todayStr)
  const targetCalories = profile?.goal_type === "Gain Muscle" ? 2200 : 1800

  // Calculate dynamic consistency score
  const hasWorkoutToday = history.some((x) => x.completed_at === todayStr)
  
  const handleWaterAdd = () => {
    const nextWater = Number((waterLoggedToday + 0.25).toFixed(2))
    setWaterLoggedToday(nextWater)
    if (profile?.id) {
      logLifestyle(profile.id, { water_liters: nextWater })
      updateConsistencyScore(nextWater, stepsLoggedToday, sleepLoggedToday, hasWorkoutToday)
    }
  }

  const handleStepsAdd = () => {
    const nextSteps = stepsLoggedToday + 1000
    setStepsLoggedToday(nextSteps)
    if (profile?.id) {
      logLifestyle(profile.id, { steps_count: nextSteps })
      updateConsistencyScore(waterLoggedToday, nextSteps, sleepLoggedToday, hasWorkoutToday)
    }
  }

  const handleSleepAdd = () => {
    const nextSleep = Number((sleepLoggedToday + 0.5).toFixed(1))
    setSleepLoggedToday(nextSleep)
    if (profile?.id) {
      logLifestyle(profile.id, { sleep_hours: nextSleep })
      updateConsistencyScore(waterLoggedToday, stepsLoggedToday, nextSleep, hasWorkoutToday)
    }
  }

  const updateConsistencyScore = (water: number, steps: number, sleep: number, workout: boolean) => {
    if (!profile?.id) return
    const score = calculateScore(
      { calories: totals.calories, target: targetCalories },
      { 
        water, 
        targetWater: profile.water_target || 3.0, 
        steps, 
        sleep, 
        targetSleep: profile.sleep_target || 8.0, 
        workoutCompleted: workout 
      }
    )
    updateGardenState(profile.id, { consistencyScore: score })
  }

  // Weight history Recharts list mapping
  const weightData = [
    { name: "Mon", weight: 69.5 },
    { name: "Tue", weight: 69.1 },
    { name: "Wed", weight: 68.8 },
    { name: "Thu", weight: 68.5 },
    { name: "Fri", weight: 68.7 },
    { name: "Sat", weight: 68.4 },
    { name: "Sun", weight: 68.5 }
  ]

  return (
    <div className="flex flex-col gap-lg">
      {/* Welcome Hero Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-md">
        <GlassCard variant="sage" className="lg:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col gap-sm relative z-10">
            <Badge variant="white" className="w-fit">FitBharat Dashboard</Badge>
            <h1 className="font-syne text-[32px] font-extrabold tracking-tight text-text-primary">Welcome back, Swayam!</h1>
            <p className="text-sm text-text-secondary leading-relaxed font-semibold max-w-lg">
              Your consistency is currently at <strong className="text-accent-dark dark:text-accent font-bold">{consistencyScore}%</strong> today. Keep completing your habits to grow your digital transformation garden.
            </p>
            <div className="flex gap-md mt-1">
              <div className="flex items-center gap-xs">
                <Flame className="h-4.5 w-4.5 text-orange fill-current" />
                <span className="text-xs font-bold text-text-primary">5 Day Streak</span>
              </div>
              <div className="flex items-center gap-xs">
                <Trophy className="h-4.5 w-4.5 text-orange fill-current" />
                <span className="text-xs font-bold text-text-primary">3 Achievements Unlocked</span>
              </div>
            </div>
          </div>
          {/* Action Trigger */}
          <div className="mt-md md:mt-0 flex gap-xs relative z-10">
            <Link href="/workout/log">
              <Button size="sm" className="shadow-sm w-auto">Log Workout</Button>
            </Link>
          </div>
        </GlassCard>

        {/* Consistency progress ring center block */}
        <GlassCard className="flex items-center justify-center h-full">
          <ProgressRing score={consistencyScore} />
        </GlassCard>
      </div>

      {/* Responsive Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Transformation Garden mini view */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-syne text-lg font-bold text-text-primary">Ecosystem Status</h3>
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">Active transformation garden preview</p>
            </div>
            <Link href="/garden" className="text-[11px] font-bold text-accent hover:underline flex items-center gap-0.5">
              <span>Full Garden</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <GardenWidget 
            growthStage={gardenStage} 
            consistencyScore={consistencyScore} 
            waterLevel={Math.round((waterLoggedToday / 3) * 100)} 
            plants={plants} 
          />
        </GlassCard>

        {/* Daily Nutrition values */}
        <GlassCard className="flex flex-col gap-sm justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-extrabold text-accent uppercase tracking-wider block">Today's Calories</span>
                <span className="font-serif text-3xl font-extrabold text-text-primary mt-1 block">
                  {totals.calories || 1840}
                </span>
                <span className="text-[11px] text-text-muted font-bold block mt-0.5">of {targetCalories} kcal</span>
              </div>
              <Badge variant="orange">{Math.round(((totals.calories || 1840) / targetCalories) * 100)}%</Badge>
            </div>

            {/* Protein, Carbs, Fats breakdowns */}
            <div className="flex flex-col gap-sm mt-md">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                  <span>Protein ({totals.protein || 142}g)</span>
                  <span className="text-text-muted">160g</span>
                </div>
                <div className="h-1.5 bg-[#223128] rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: "88%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                  <span>Carbs ({totals.carbs || 210}g)</span>
                  <span className="text-text-muted">220g</span>
                </div>
                <div className="h-1.5 bg-[#223128] rounded-full overflow-hidden">
                  <div className="h-full bg-accent-light" style={{ width: "95%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                  <span>Fat ({totals.fat || 58}g)</span>
                  <span className="text-text-muted">65g</span>
                </div>
                <div className="h-1.5 bg-[#223128] rounded-full overflow-hidden">
                  <div className="h-full bg-orange" style={{ width: "89%" }} />
                </div>
              </div>
            </div>
          </div>
          <Link href="/nutrition">
            <Button variant="outline" size="sm" className="mt-sm">Log Meal details</Button>
          </Link>
        </GlassCard>

        {/* Daily Dials inputs */}
        <GlassCard className="flex flex-col gap-sm">
          <h3 className="font-syne text-lg font-bold text-text-primary">Quick Logs</h3>
          
          <div className="flex flex-col gap-xs">
            {/* Water Log */}
            <div className="flex justify-between items-center p-sm rounded-sm bg-bg-secondary/80 border border-border shadow-sm">
              <div className="flex items-center gap-xs">
                <div className="w-[32px] h-[32px] rounded-xs bg-blue/10 flex items-center justify-center text-blue">
                  <Droplet className="h-4.5 w-4.5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-primary block">Water</span>
                  <span className="text-[10px] text-text-muted font-semibold">{waterLoggedToday} / 3.0L</span>
                </div>
              </div>
              <button onClick={handleWaterAdd} className="p-1 rounded-sm bg-bg-hover text-accent hover:bg-accent hover:text-white transition-all outline-none flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Steps Log */}
            <div className="flex justify-between items-center p-sm rounded-sm bg-bg-secondary/80 border border-border shadow-sm">
              <div className="flex items-center gap-xs">
                <div className="w-[32px] h-[32px] rounded-xs bg-accent/10 flex items-center justify-center text-accent">
                  <Footprints className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-primary block">Steps</span>
                  <span className="text-[10px] text-text-muted font-semibold">{stepsLoggedToday} / 8,000</span>
                </div>
              </div>
              <button onClick={handleStepsAdd} className="p-1 rounded-sm bg-bg-hover text-accent hover:bg-accent hover:text-white transition-all outline-none flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Sleep Log */}
            <div className="flex justify-between items-center p-sm rounded-sm bg-bg-secondary/80 border border-border shadow-sm">
              <div className="flex items-center gap-xs">
                <div className="w-[32px] h-[32px] rounded-xs bg-orange/10 flex items-center justify-center text-orange">
                  <Moon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-primary block">Sleep</span>
                  <span className="text-[10px] text-text-muted font-semibold">{sleepLoggedToday} / 8.0 hrs</span>
                </div>
              </div>
              <button onClick={handleSleepAdd} className="p-1 rounded-sm bg-bg-hover text-accent hover:bg-accent hover:text-white transition-all outline-none flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Double column Weight chart vs recommendations block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Weight graph Recharts container */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-syne text-lg font-bold text-text-primary">Weight Analysis</h3>
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">Weekly body weight progress logs (kg)</p>
            </div>
            <div>
              <span className="text-xs font-bold text-accent bg-[#223128] px-2.5 py-1 rounded-sm border border-white/5">Target: 63 kg</span>
            </div>
          </div>
          <div className="w-full h-56 mt-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="name" stroke="#7A9583" fontSize={10} tickLine={false} />
                <YAxis domain={[60, 72]} stroke="#7A9583" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '11px' }} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--success)" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: "var(--accent)", strokeWidth: 2, fill: "white" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Recommendations panel */}
        <GlassCard className="flex flex-col gap-sm">
          <div className="flex items-center gap-xs">
            <BrainCircuit className="h-5 w-5 text-orange" />
            <h3 className="font-syne text-lg font-bold text-text-primary">AI recommendations</h3>
          </div>
          <div className="flex flex-col gap-sm">
            {/* Exercise advice */}
            <div className="p-sm rounded-sm bg-orange/5 border-l-4 border-orange flex flex-col gap-xs">
              <span className="text-[10px] font-extrabold text-orange uppercase tracking-wider">Today's Routine Recommendation</span>
              <span className="text-xs font-bold text-text-primary">Pull Day â€” Back & Biceps</span>
              <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                Based on your last 7 days metrics and your knee recovery restrictions, today is the optimal time for upper body strength exercises.
              </p>
            </div>

            {/* Anti aging wellness note */}
            <div className="p-sm rounded-sm bg-accent/5 border-l-4 border-accent flex flex-col gap-xs">
              <span className="text-[10px] font-extrabold text-accent-light uppercase tracking-wider">Longevity & Recovery</span>
              <span className="text-xs font-bold text-text-primary">Reduce Cortisol Cellular aging</span>
              <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                Your 7.5hr average sleep log this week decreases biological cell stressors. Keep sleep above 7.0hrs.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

