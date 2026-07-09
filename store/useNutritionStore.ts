import { create } from "zustand"
import { supabase, offlineDb } from "@/lib/supabase"

export interface MealLog {
  id: string
  user_id: string
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  logged_at: string // YYYY-MM-DD
}

export interface LifestyleLog {
  id: string
  user_id: string
  log_date: string // YYYY-MM-DD
  water_liters: number
  sleep_hours: number
  steps_count: number
  mood_rating?: number // 1-5
  energy_rating?: number // 1-5
  stress_rating?: 'Low' | 'Medium' | 'High'
}

interface NutritionState {
  meals: MealLog[]
  lifestyle: LifestyleLog[]
  isLoading: boolean
  addMeal: (meal: Omit<MealLog, "id" | "logged_at">, date?: string) => Promise<void>
  deleteMeal: (mealId: string) => Promise<void>
  logLifestyle: (userId: string, updates: Partial<Omit<LifestyleLog, "id" | "user_id" | "log_date">>, date?: string) => Promise<void>
  fetchMeals: (userId: string) => Promise<void>
  fetchLifestyle: (userId: string) => Promise<void>
  getTotalsForDate: (date: string) => { calories: number; protein: number; carbs: number; fat: number }
  getLifestyleForDate: (date: string) => LifestyleLog | null
}

const getTodayDateString = () => new Date().toISOString().split("T")[0]

export const useNutritionStore = create<NutritionState>((set, get) => ({
  meals: [],
  lifestyle: [],
  isLoading: false,

  addMeal: async (mealData, date) => {
    set({ isLoading: true })
    const targetDate = date || getTodayDateString()
    const newMeal: MealLog = {
      id: crypto.randomUUID(),
      logged_at: targetDate,
      ...mealData
    }

    try {
      const { error } = await supabase.from("meal_logs").insert([newMeal])
      if (error) console.error("Supabase Save Meal Error:", error)
    } catch (e) {
      console.warn("Saving meal log offline.")
    }

    offlineDb.insert("meal_logs", newMeal)
    set((state) => ({
      meals: [...state.meals, newMeal],
      isLoading: false
    }))
  },

  deleteMeal: async (mealId) => {
    set({ isLoading: true })
    try {
      await supabase.from("meal_logs").delete().eq("id", mealId)
    } catch (e) {
      console.warn("Deleting meal log offline.")
    }

    // Delete locally
    const localMeals = offlineDb.getAll("meal_logs")
    const updatedMeals = localMeals.filter((x) => x.id !== mealId)
    offlineDb.saveAll("meal_logs", updatedMeals)

    set((state) => ({
      meals: state.meals.filter((m) => m.id !== mealId),
      isLoading: false
    }))
  },

  logLifestyle: async (userId, updates, date) => {
    const targetDate = date || getTodayDateString()
    const currentLogs = get().lifestyle
    const existingIndex = currentLogs.findIndex((l) => l.log_date === targetDate)

    let updatedLog: LifestyleLog

    if (existingIndex !== -1) {
      updatedLog = { ...currentLogs[existingIndex], ...updates }
    } else {
      updatedLog = {
        id: crypto.randomUUID(),
        user_id: userId,
        log_date: targetDate,
        water_liters: updates.water_liters || 0,
        sleep_hours: updates.sleep_hours || 0,
        steps_count: updates.steps_count || 0,
        mood_rating: updates.mood_rating,
        energy_rating: updates.energy_rating,
        stress_rating: updates.stress_rating,
      }
    }

    try {
      const { error } = await supabase
        .from("daily_lifestyle_logs")
        .upsert([updatedLog], { onConflict: "user_id,log_date" })
      
      if (error) console.error("Supabase Upsert Lifestyle Error:", error)
    } catch (e) {
      console.warn("Logging lifestyle offline.")
    }

    // Offline update
    const allLogs = offlineDb.getAll("daily_lifestyle_logs")
    const idx = allLogs.findIndex((x) => x.user_id === userId && x.log_date === targetDate)
    if (idx !== -1) {
      allLogs[idx] = { ...allLogs[idx], ...updates }
      offlineDb.saveAll("daily_lifestyle_logs", allLogs)
    } else {
      offlineDb.insert("daily_lifestyle_logs", updatedLog)
    }

    set((state) => {
      const newList = [...state.lifestyle]
      if (existingIndex !== -1) {
        newList[existingIndex] = updatedLog
      } else {
        newList.push(updatedLog)
      }
      return { lifestyle: newList }
    })
  },

  fetchMeals: async (userId) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", userId)

      if (!error && data) {
        set({ meals: data, isLoading: false })
        data.forEach((m) => offlineDb.update("meal_logs", m.id, m))
        return
      }
    } catch (e) {
      console.warn("Fetching meals offline.")
    }

    // Load offline
    const localMeals = offlineDb.getAll("meal_logs")
    const userMeals = localMeals.filter((x) => x.user_id === userId)
    
    // Add default initial meals if none logged yet, matching prototype data
    if (userMeals.length === 0) {
      const defaultMeals: MealLog[] = [
        {
          id: "meal-default-1",
          user_id: userId,
          meal_type: "Breakfast",
          food_name: "Dal + Roti + Ghee",
          calories: 480,
          protein: 18,
          carbs: 52,
          fat: 12,
          logged_at: getTodayDateString()
        },
        {
          id: "meal-default-2",
          user_id: userId,
          meal_type: "Lunch",
          food_name: "Rice + Rajma",
          calories: 620,
          protein: 24,
          carbs: 98,
          fat: 6,
          logged_at: getTodayDateString()
        }
      ]
      defaultMeals.forEach((m) => offlineDb.insert("meal_logs", m))
      set({ meals: defaultMeals, isLoading: false })
    } else {
      set({ meals: userMeals, isLoading: false })
    }
  },

  fetchLifestyle: async (userId) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from("daily_lifestyle_logs")
        .select("*")
        .eq("user_id", userId)

      if (!error && data) {
        set({ lifestyle: data, isLoading: false })
        data.forEach((l) => offlineDb.update("daily_lifestyle_logs", l.id, l))
        return
      }
    } catch (e) {
      console.warn("Fetching lifestyle logs offline.")
    }

    // Load offline
    const localLogs = offlineDb.getAll("daily_lifestyle_logs")
    let userLogs = localLogs.filter((x) => x.user_id === userId)

    // Setup initial lifestyle list matching prototype data if empty
    if (userLogs.length === 0) {
      const today = getTodayDateString()
      const defaultLogs: LifestyleLog[] = [
        {
          id: "ls-1",
          user_id: userId,
          log_date: today,
          water_liters: 2.2,
          sleep_hours: 7.5,
          steps_count: 5200,
          mood_rating: 3,
          energy_rating: 4,
          stress_rating: "Low"
        }
      ]
      // Populate previous week sleep log as well for analytics (matches sleep view in HTML prototype)
      const weekDates = Array.from({ length: 5 }).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (i + 1))
        return d.toISOString().split("T")[0]
      })
      const sleepHours = [7.5, 7.0, 5.0, 8.0, 7.5] // Fri, Thu, Wed, Tue, Mon
      weekDates.forEach((date, index) => {
        defaultLogs.push({
          id: `ls-week-${index}`,
          user_id: userId,
          log_date: date,
          water_liters: 2.8,
          sleep_hours: sleepHours[index],
          steps_count: 8000,
          mood_rating: 4,
          energy_rating: 4,
          stress_rating: "Low"
        })
      })

      defaultLogs.forEach((l) => offlineDb.insert("daily_lifestyle_logs", l))
      set({ lifestyle: defaultLogs, isLoading: false })
    } else {
      set({ lifestyle: userLogs, isLoading: false })
    }
  },

  getTotalsForDate: (date) => {
    const dayMeals = get().meals.filter((m) => m.logged_at === date)
    return dayMeals.reduce(
      (totals, meal) => {
        totals.calories += Number(meal.calories)
        totals.protein += Number(meal.protein)
        totals.carbs += Number(meal.carbs)
        totals.fat += Number(meal.fat)
        return totals
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  },

  getLifestyleForDate: (date) => {
    return get().lifestyle.find((l) => l.log_date === date) || null
  }
}))
