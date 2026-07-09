import { create } from "zustand"
import { supabase, offlineDb } from "@/lib/supabase"

export interface PlantInstance {
  id: string
  plantId: string
  name: string
  stage: number // 0-4
  x: number // percent on garden grid (0-100)
  y: number
  unlockedAt: string
}

interface GardenState {
  growthStage: number // 0-4
  consistencyScore: number // 0-100
  waterLevel: number // 0-100
  sunlightLevel: number // 0-100
  plants: PlantInstance[]
  isLoading: boolean
  calculateConsistencyScore: (totals: { calories: number; target: number }, lifestyle: { water: number; targetWater: number; steps: number; sleep: number; targetSleep: number; workoutCompleted: boolean }) => number
  fetchGardenState: (userId: string) => Promise<void>
  updateGardenState: (userId: string, updates: { growthStage?: number; waterLevel?: number; sunlightLevel?: number; plants?: PlantInstance[]; consistencyScore?: number }) => Promise<void>
  unlockNewPlant: (userId: string, plantId: string, name: string) => Promise<void>
}

const PLANT_TEMPLATES = [
  { id: "plant-sage", name: "Sage Shrub" },
  { id: "plant-fern", name: "Forest Fern" },
  { id: "plant-marigold", name: "Golden Marigold" },
  { id: "plant-aloe", name: "Medicinal Aloe" },
  { id: "plant-rose", name: "Wild Rose" }
]

export const useGardenStore = create<GardenState>((set, get) => ({
  growthStage: 0,
  consistencyScore: 70,
  waterLevel: 50,
  sunlightLevel: 50,
  plants: [],
  isLoading: false,

  calculateConsistencyScore: (nutrition, lifestyle) => {
    let score = 0
    
    // 1. Workout completed (30 pts)
    if (lifestyle.workoutCompleted) {
      score += 30
    }

    // 2. Calories on target (30 pts)
    // Within +/- 15% of calorie target is considered hitting the target
    const calDiff = Math.abs(nutrition.calories - nutrition.target)
    const calThreshold = nutrition.target * 0.15
    if (nutrition.calories > 0 && calDiff <= calThreshold) {
      score += 30
    } else if (nutrition.calories > 0 && calDiff <= calThreshold * 2) {
      score += 15 // Partial credit
    }

    // 3. Water goal met (15 pts)
    if (lifestyle.water >= lifestyle.targetWater) {
      score += 15
    } else if (lifestyle.water > 0) {
      score += Math.round((lifestyle.water / lifestyle.targetWater) * 15)
    }

    // 4. Steps goal met (15 pts)
    // Target 8000 steps
    if (lifestyle.steps >= 8000) {
      score += 15
    } else if (lifestyle.steps > 0) {
      score += Math.round((lifestyle.steps / 8000) * 15)
    }

    // 5. Sleep consistency (10 pts)
    if (lifestyle.sleep >= lifestyle.targetSleep) {
      score += 10
    } else if (lifestyle.sleep >= lifestyle.targetSleep - 1) {
      score += 5
    }

    return Math.min(100, score)
  },

  fetchGardenState: async (userId) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from("garden_states")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (!error && data) {
        set({
          growthStage: data.growth_stage,
          waterLevel: data.water_level,
          sunlightLevel: data.sunlight_level,
          plants: Array.isArray(data.plants_unlocked) ? data.plants_unlocked : [],
          isLoading: false
        })
        offlineDb.update("garden_states", userId, data)
        return
      }
    } catch (e) {
      console.warn("Fetching garden state offline.")
    }

    // Load offline
    const localGardens = offlineDb.getAll("garden_states")
    const userGarden = localGardens.find((x) => x.user_id === userId)
    if (userGarden) {
      set({
        growthStage: userGarden.growth_stage || 0,
        waterLevel: userGarden.water_level || 50,
        sunlightLevel: userGarden.sunlight_level || 50,
        plants: Array.isArray(userGarden.plants_unlocked) ? userGarden.plants_unlocked : [],
        isLoading: false
      })
    } else {
      // Initialize default garden state
      const initialPlants: PlantInstance[] = [
        {
          id: "p-init-1",
          plantId: "plant-sage",
          name: "Sage Shrub",
          stage: 2,
          x: 30,
          y: 40,
          unlockedAt: new Date().toISOString()
        },
        {
          id: "p-init-2",
          plantId: "plant-fern",
          name: "Forest Fern",
          stage: 1,
          x: 70,
          y: 60,
          unlockedAt: new Date().toISOString()
        }
      ]
      const defaultState = {
        user_id: userId,
        growth_stage: 1,
        water_level: 60,
        sunlight_level: 80,
        plants_unlocked: initialPlants,
        consistency_score: 84
      }
      offlineDb.insert("garden_states", defaultState)
      set({
        growthStage: 1,
        waterLevel: 60,
        sunlightLevel: 80,
        plants: initialPlants,
        consistencyScore: 84,
        isLoading: false
      })
    }
  },

  updateGardenState: async (userId, updates) => {
    // Translate state keys to database fields
    const dbUpdates: any = {}
    if (updates.growthStage !== undefined) dbUpdates.growth_stage = updates.growthStage
    if (updates.waterLevel !== undefined) dbUpdates.water_level = updates.waterLevel
    if (updates.sunlightLevel !== undefined) dbUpdates.sunlight_level = updates.sunlightLevel
    if (updates.plants !== undefined) dbUpdates.plants_unlocked = updates.plants
    if (updates.consistencyScore !== undefined) dbUpdates.consistency_score = updates.consistencyScore

    try {
      await supabase
        .from("garden_states")
        .update(dbUpdates)
        .eq("user_id", userId)
    } catch (e) {
      console.warn("Updating garden state offline.")
    }

    offlineDb.update("garden_states", userId, dbUpdates)
    set((state) => ({
      growthStage: updates.growthStage !== undefined ? updates.growthStage : state.growthStage,
      waterLevel: updates.waterLevel !== undefined ? updates.waterLevel : state.waterLevel,
      sunlightLevel: updates.sunlightLevel !== undefined ? updates.sunlightLevel : state.sunlightLevel,
      plants: updates.plants !== undefined ? updates.plants : state.plants,
      consistencyScore: updates.consistencyScore !== undefined ? updates.consistencyScore : state.consistencyScore,
    }))
  },

  unlockNewPlant: async (userId, plantId, name) => {
    const currentPlants = get().plants
    const newPlant: PlantInstance = {
      id: `p-unlock-${Date.now()}`,
      plantId,
      name,
      stage: 1,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      unlockedAt: new Date().toISOString()
    }
    const updatedPlants = [...currentPlants, newPlant]
    await get().updateGardenState(userId, { plants: updatedPlants })
  }
}))
