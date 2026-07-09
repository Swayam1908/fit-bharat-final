"use client"

import React from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { useNutritionStore } from "@/store/useNutritionStore"
import { BrainCircuit } from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts"

export default function AnalyticsPage() {
  const lifestyle = useNutritionStore((s) => s.lifestyle)

  // Calorie averages data
  const calorieTrendData = [
    { name: "Mon", consumed: 1720, target: 2200 },
    { name: "Tue", consumed: 1950, target: 2200 },
    { name: "Wed", consumed: 1680, target: 2200 },
    { name: "Thu", consumed: 1840, target: 2200 },
    { name: "Fri", consumed: 2100, target: 2200 },
    { name: "Sat", consumed: 2250, target: 2200 },
    { name: "Sun", consumed: 1840, target: 2200 }
  ]

  // Sleep hours weekly mapping
  const sleepTrendData = lifestyle.map(x => ({
    name: x.log_date.split("-")[2],
    hours: x.sleep_hours
  })).slice(0, 7).reverse()

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div>
        <h1 className="font-syne text-[32px] font-bold text-text-primary">Analytics & Longevity</h1>
        <p className="text-xs text-text-secondary font-medium">AI-powered longevity analysis and physical statistics</p>
      </div>

      {/* Double column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Anti-aging Biological age card */}
        <GlassCard variant="sage" className="lg:col-span-1 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-sm relative z-10">
            <span className="text-[9px] font-extrabold text-accent-dark dark:text-accent-light uppercase tracking-wider block">Biological Age Index</span>
            <span className="font-serif text-6xl font-extrabold text-text-primary block mt-1">18</span>
            <span className="text-xs font-bold text-text-secondary">vs Chronological Age 20</span>
          </div>

          <div className="p-3.5 rounded-sm bg-white/60 dark:bg-white/5 border border-border-primary/20 mt-4 relative z-10">
            <span className="text-[9px] font-extrabold text-accent-dark dark:text-accent-light uppercase tracking-wider mb-1 block">AI Analysis</span>
            <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
              Your consistent sleep patterns and high protein vegetarian diet have decreased your biological cellular stress scores.
            </p>
          </div>
        </GlassCard>

        {/* Calorie Trend graph */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-sm">
          <div>
            <h3 className="font-syne text-sm font-bold text-text-primary">Calorie Intake Trends</h3>
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">Weekly calorie logging vs daily target</p>
          </div>
          <div className="w-full h-44 mt-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calorieTrendData}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#7A9B7E" fontSize={10} tickLine={false} />
                <YAxis stroke="#7A9B7E" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '11px' }} />
                <Area type="monotone" dataKey="consumed" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorCal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Sleep stats chart */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-sm">
          <div>
            <h3 className="font-syne text-sm font-bold text-text-primary">Sleep Quality logs</h3>
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">Hours slept per night</p>
          </div>
          <div className="w-full h-44 mt-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepTrendData.length > 0 ? sleepTrendData : [{ name: "Mon", hours: 7.5 }, { name: "Tue", hours: 8 }, { name: "Wed", hours: 5 }, { name: "Thu", hours: 7 }, { name: "Fri", hours: 7.5 }]}>
                <XAxis dataKey="name" stroke="#7A9B7E" fontSize={10} tickLine={false} />
                <YAxis stroke="#7A9B7E" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '11px' }} />
                <Bar dataKey="hours" fill="var(--warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Anti-aging advice & list */}
        <GlassCard className="flex flex-col gap-sm">
          <div className="flex items-center gap-xs">
            <BrainCircuit className="h-5 w-5 text-orange" />
            <h3 className="font-syne text-sm font-bold text-text-primary">Longevity Foods</h3>
          </div>
          <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
            Incorporate anti-inflammatory Indian superfoods into your diet splits to accelerate knee tissue recovery.
          </p>

          <div className="flex flex-wrap gap-xs">
            <Badge variant="sage">Amla (Vitamin C)</Badge>
            <Badge variant="glass">Haldi (Curcumin)</Badge>
            <Badge variant="sage">Moringa powder</Badge>
            <Badge variant="glass">Ghee (Moderate)</Badge>
            <Badge variant="sage">Methi seeds</Badge>
            <Badge variant="glass">Almonds</Badge>
          </div>

          <div className="p-3.5 rounded-sm bg-orange/5 border border-orange/20 mt-2">
            <span className="text-[9px] font-extrabold text-orange uppercase tracking-wider block mb-1">Longevity Hack</span>
            <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
              Drink warm water mixed with organic ginger and haldi every morning before having your regular chai tea.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

