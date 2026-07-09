import { create } from "zustand"
import { supabase, offlineDb } from "@/lib/supabase"

export interface SetLog {
  id: string
  reps: number
  weight: number
  completed: boolean
}

export interface ExerciseLog {
  id: string
  name: string
  category: string
  sets: SetLog[]
}

export interface WorkoutLog {
  id: string
  user_id: string
  title: string
  duration_minutes: number
  total_volume_kg: number
  completed_at: string // YYYY-MM-DD
  exercises_data: ExerciseLog[]
}

export interface WorkoutPlan {
  id: string
  title: string
  type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga'
  description: string
  exercises: { name: string; category: string; targetSets: number }[]
}

interface WorkoutState {
  plans: WorkoutPlan[]
  history: WorkoutLog[]
  activeWorkout: {
    title: string
    type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga'
    startTime: number | null
    exercises: ExerciseLog[]
  } | null
  isLoading: boolean
  startWorkout: (plan: WorkoutPlan | { title: string; type: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga' }) => void
  addExerciseToActive: (exercise: { name: string; category: string }) => void
  addSetToExercise: (exerciseId: string) => void
  updateSetDetails: (exerciseId: string, setId: string, reps: number, weight: number) => void
  deleteSet: (exerciseId: string, setId: string) => void
  cancelWorkout: () => void
  saveWorkout: (userId: string) => Promise<WorkoutLog | null>
  fetchHistory: (userId: string) => Promise<void>
}

const DEFAULT_PLANS: WorkoutPlan[] = [
  {
    id: "plan-push",
    title: "Push Day",
    type: "Strength",
    description: "Train chest, shoulders, and triceps",
    exercises: [
      { name: "Bench Press", category: "Chest", targetSets: 3 },
      { name: "Shoulder Press", category: "Shoulders", targetSets: 3 },
      { name: "Tricep Dips", category: "Triceps", targetSets: 3 }
    ]
  },
  {
    id: "plan-pull",
    title: "Pull Day",
    type: "Strength",
    description: "Train back and biceps with pull movements",
    exercises: [
      { name: "Deadlift", category: "Back", targetSets: 3 },
      { name: "Pull-ups", category: "Back", targetSets: 3 },
      { name: "Bicep Curls", category: "Biceps", targetSets: 3 }
    ]
  },
  {
    id: "plan-legs",
    title: "Leg Day",
    type: "Strength",
    description: "Build leg power with knee-safe options",
    exercises: [
      { name: "Squats", category: "Legs", targetSets: 3 },
      { name: "Lying Leg Curls", category: "Legs", targetSets: 3 },
      { name: "Leg Press", category: "Legs", targetSets: 3 }
    ]
  },
  {
    id: "plan-cardio",
    title: "Cardio + Core",
    type: "Cardio",
    description: "Cardio endurance and abdominal strength",
    exercises: [
      { name: "Treadmill Run", category: "Cardio", targetSets: 1 },
      { name: "Plank Hold", category: "Core", targetSets: 3 },
      { name: "Crunches", category: "Core", targetSets: 3 }
    ]
  }
]

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  plans: DEFAULT_PLANS,
  history: [],
  activeWorkout: null,
  isLoading: false,

  startWorkout: (plan) => {
    const defaultExercises: ExerciseLog[] = 'exercises' in plan
      ? plan.exercises.map((ex, i) => ({
          id: `ex-${i}-${Date.now()}`,
          name: ex.name,
          category: ex.category,
          sets: Array.from({ length: ex.targetSets }).map((_, sIdx) => ({
            id: `set-${sIdx}-${Date.now()}`,
            reps: 10,
            weight: 0,
            completed: false
          }))
        }))
      : []

    set({
      activeWorkout: {
        title: plan.title,
        type: plan.type,
        startTime: Date.now(),
        exercises: defaultExercises
      }
    })
  },

  addExerciseToActive: (ex) => {
    set((state) => {
      if (!state.activeWorkout) return {}
      const newEx: ExerciseLog = {
        id: `ex-${Date.now()}`,
        name: ex.name,
        category: ex.category,
        sets: [{ id: `set-${Date.now()}`, reps: 10, weight: 0, completed: false }]
      }
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [...state.activeWorkout.exercises, newEx]
        }
      }
    })
  },

  addSetToExercise: (exerciseId) => {
    set((state) => {
      if (!state.activeWorkout) return {}
      const updated = state.activeWorkout.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex
        const lastSet = ex.sets[ex.sets.length - 1]
        const newSet: SetLog = {
          id: `set-${Date.now()}`,
          reps: lastSet ? lastSet.reps : 10,
          weight: lastSet ? lastSet.weight : 0,
          completed: false
        }
        return { ...ex, sets: [...ex.sets, newSet] }
      })
      return { activeWorkout: { ...state.activeWorkout, exercises: updated } }
    })
  },

  updateSetDetails: (exerciseId, setId, reps, weight) => {
    set((state) => {
      if (!state.activeWorkout) return {}
      const updated = state.activeWorkout.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex
        const updatedSets = ex.sets.map((set) =>
          set.id === setId ? { ...set, reps, weight, completed: true } : set
        )
        return { ...ex, sets: updatedSets }
      })
      return { activeWorkout: { ...state.activeWorkout, exercises: updated } }
    })
  },

  deleteSet: (exerciseId, setId) => {
    set((state) => {
      if (!state.activeWorkout) return {}
      const updated = state.activeWorkout.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
      })
      return { activeWorkout: { ...state.activeWorkout, exercises: updated } }
    })
  },

  cancelWorkout: () => {
    set({ activeWorkout: null })
  },

  saveWorkout: async (userId) => {
    const { activeWorkout } = get()
    if (!activeWorkout || !activeWorkout.startTime) return null

    const duration = Math.max(1, Math.round((Date.now() - activeWorkout.startTime) / 60000))
    let volume = 0
    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          volume += s.reps * s.weight
        }
      })
    })

    const newLog: WorkoutLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: activeWorkout.title,
      duration_minutes: duration,
      total_volume_kg: volume,
      completed_at: new Date().toISOString().split("T")[0],
      exercises_data: activeWorkout.exercises
    }

    set({ isLoading: true })

    try {
      const { error } = await supabase.from("workout_logs").insert([{
        user_id: userId,
        title: newLog.title,
        duration_minutes: newLog.duration_minutes,
        total_volume_kg: newLog.total_volume_kg,
        completed_at: newLog.completed_at,
        exercises_data: newLog.exercises_data
      }])
      if (error) console.error("Supabase Save Workout Error:", error)
    } catch (e) {
      console.warn("Saving workout offline due to network connection.")
    }

    // Save offline
    offlineDb.insert("workout_logs", newLog)

    set((state) => ({
      history: [newLog, ...state.history],
      activeWorkout: null,
      isLoading: false
    }))

    return newLog
  },

  fetchHistory: async (userId) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })

      if (!error && data) {
        set({ history: data, isLoading: false })
        data.forEach((log) => offlineDb.update("workout_logs", log.id, log))
        return
      }
    } catch (e) {
      console.warn("Fetching history offline.")
    }

    // Load offline
    const localLogs = offlineDb.getAll("workout_logs")
    const userLogs = localLogs.filter((x) => x.user_id === userId)
    set({
      history: userLogs.sort((a, b) => b.completed_at.localeCompare(a.completed_at)),
      isLoading: false
    })
  }
}))
