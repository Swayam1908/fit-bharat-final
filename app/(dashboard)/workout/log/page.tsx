"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useUserStore } from "@/store/useUserStore"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Trash2, Search, Dumbbell } from "lucide-react"

export default function WorkoutLoggerPage() {
  const router = useRouter()
  const profile = useUserStore((s) => s.profile)
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout)
  const addExercise = useWorkoutStore((s) => s.addExerciseToActive)
  const addSet = useWorkoutStore((s) => s.addSetToExercise)
  const updateSet = useWorkoutStore((s) => s.updateSetDetails)
  const deleteSet = useWorkoutStore((s) => s.deleteSet)
  const saveWorkout = useWorkoutStore((s) => s.saveWorkout)
  const cancelWorkout = useWorkoutStore((s) => s.cancelWorkout)

  const [timerString, setTimerString] = useState("00:00")
  const [searchQuery, setSearchQuery] = useState("")

  // Predefined standard exercise database for search adding
  const EXERCISE_LIBRARY = [
    { name: "Bench Press", category: "Chest" },
    { name: "Incline Dumbbell Press", category: "Chest" },
    { name: "Shoulder Press", category: "Shoulders" },
    { name: "Tricep Dips", category: "Triceps" },
    { name: "Deadlift", category: "Back" },
    { name: "Pull-ups", category: "Back" },
    { name: "Barbell Rows", category: "Back" },
    { name: "Bicep Curls", category: "Biceps" },
    { name: "Squats", category: "Legs" },
    { name: "Leg Press", category: "Legs" },
    { name: "Lying Leg Curls", category: "Legs" },
    { name: "Plank Hold", category: "Core" }
  ]

  useEffect(() => {
    if (!activeWorkout || !activeWorkout.startTime) return

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - activeWorkout.startTime!) / 1000)
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      setTimerString(
        `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [activeWorkout])

  if (!activeWorkout) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-sm text-center">
        <Dumbbell className="h-10 w-10 text-accent animate-bounce" />
        <div>
          <h2 className="font-syne text-sm font-bold text-text-primary mb-1">No Active Workout Session</h2>
          <p className="text-xs text-text-muted font-bold">Select a split plan or create custom routine logs</p>
        </div>
        <Button onClick={() => router.push("/workout")} className="w-auto shadow-sm">
          Select Workout Splits
        </Button>
      </div>
    )
  }

  const handleSave = async () => {
    if (!profile?.id) return
    const log = await saveWorkout(profile.id)
    if (log) {
      router.push("/workout")
    }
  }

  const filteredExercises = EXERCISE_LIBRARY.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-lg">
      {/* Logger Active Headers */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne text-2xl font-bold text-text-primary">{activeWorkout.title}</h1>
          <div className="flex gap-sm items-center mt-1">
            <Badge variant="orange">{activeWorkout.type}</Badge>
            <span className="font-serif text-sm font-extrabold text-accent">{timerString}</span>
          </div>
        </div>
        <div className="flex gap-sm">
          <Button variant="outline" size="sm" onClick={cancelWorkout} className="w-auto border-red/40 text-red hover:bg-red/5">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="w-auto shadow-sm">
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left pane: lists active exercises & sets */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          {activeWorkout.exercises.map((ex) => (
            <GlassCard key={ex.id} className="flex flex-col gap-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <div>
                  <h3 className="text-xs font-bold text-text-primary">{ex.name}</h3>
                  <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">{ex.category}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addSet(ex.id)}
                  className="w-auto text-[10px] py-1.5 px-3 border-accent/30 text-accent-light"
                >
                  + Add Set
                </Button>
              </div>

              {/* Set headers */}
              <div className="grid grid-cols-4 gap-sm text-center text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
                <span>Set</span>
                <span>Reps</span>
                <span>Weight (kg)</span>
                <span>Delete</span>
              </div>

              {/* Set logging items */}
              <div className="flex flex-col gap-xs">
                {ex.sets.map((set, index) => (
                  <div key={set.id} className="grid grid-cols-4 gap-xs items-center">
                    <span className="text-center text-xs font-extrabold text-accent bg-[#223128] py-2.5 rounded-sm border border-border">
                      {index + 1}
                    </span>
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(ex.id, set.id, Number(e.target.value), set.weight)}
                      className="text-center py-2 h-[40px]"
                      required
                    />
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(ex.id, set.id, set.reps, Number(e.target.value))}
                      className="text-center py-2 h-[40px]"
                      required
                    />
                    <button
                      onClick={() => deleteSet(ex.id, set.id)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-sm transition-all mx-auto outline-none"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Right pane: Exercise library Search adding */}
        <div className="flex flex-col gap-md">
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary">Add Exercise</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search Bench Press, Squats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-secondary/80 border border-border rounded-sm pl-9 pr-4 py-2.5 text-xs text-text-primary outline-none focus:border-accent focus:shadow-glow transition-all"
              />
            </div>

            <div className="flex flex-col gap-xs max-h-96 overflow-y-auto pr-1">
              {filteredExercises.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-sm rounded-sm border border-border bg-bg-secondary/80 hover:border-accent transition-all">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">{item.name}</span>
                    <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">{item.category}</span>
                  </div>
                  <button 
                    onClick={() => addExercise(item)}
                    className="p-1.5 rounded-lg bg-accent text-white shadow-sm hover:shadow-[0_2px_8px_rgba(123,174,127,0.35)] transition-all outline-none"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

