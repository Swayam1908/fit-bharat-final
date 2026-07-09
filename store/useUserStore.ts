import { create } from "zustand"
import { supabase, offlineDb } from "@/lib/supabase"

interface Profile {
  id: string
  name: string
  email: string
  age?: number
  gender?: string
  height?: number
  weight?: number
  target_weight?: number
  goal_type?: string
  activity_level?: string
  avatar_url?: string
  diet_style?: string
  water_target?: number
  sleep_target?: number
}

interface UserState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  fetchProfile: (userId: string) => Promise<void>
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<boolean>
  createProfile: (profile: Profile) => Promise<boolean>
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (!error && data) {
        set({ profile: data, isLoading: false })
        offlineDb.update("profiles", userId, data) // Sync to local storage
        return
      }
    } catch (e) {
      console.warn("Failed to fetch profile from Supabase, loading from offline database.")
    }

    // Load from local storage fallback
    const offlineProfiles = offlineDb.getAll("profiles")
    const localProfile = offlineProfiles.find((x) => x.id === userId)
    if (localProfile) {
      set({ profile: localProfile, isLoading: false })
    } else {
      // Set default guest profile if not found
      const defaultProfile: Profile = {
        id: userId,
        name: "Swayam Gurjar",
        email: "swayam@gmail.com",
        age: 20,
        gender: "Male",
        height: 175,
        weight: 68.5,
        target_weight: 63,
        goal_type: "Gain Muscle",
        activity_level: "Moderately Active",
        diet_style: "Vegetarian",
        water_target: 3.0,
        sleep_target: 8.0,
      }
      offlineDb.insert("profiles", defaultProfile)
      set({ profile: defaultProfile, isLoading: false })
    }
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    set({ isLoading: true })
    let success = false
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
      
      if (!error) success = true
    } catch (e) {
      console.warn("Failed to update profile on Supabase, writing offline.")
    }

    // Update locally regardless to ensure zero-lag interface
    const updated = offlineDb.update("profiles", userId, updates)
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : (updated as Profile),
      isLoading: false,
    }))
    return true
  },

  createProfile: async (profile: Profile) => {
    set({ isLoading: true })
    try {
      const { error } = await supabase
        .from("profiles")
        .insert([profile])
      
      if (error) console.error(error)
    } catch (e) {
      console.warn("Failed to create profile on Supabase, writing offline.")
    }

    offlineDb.insert("profiles", profile)
    set({ profile, isLoading: false })
    return true
  },
}))
