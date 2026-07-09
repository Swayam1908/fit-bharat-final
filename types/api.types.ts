// ─────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// ─────────────────────────────────────────────
// DASHBOARD TYPES
// ─────────────────────────────────────────────
export interface DashboardStats {
  calories: {
    consumed: number
    target: number
    percentage: number
  }
  protein: {
    consumed: number
    target: number
    percentage: number
  }
  carbs: {
    consumed: number
    target: number
    percentage: number
  }
  fat: {
    consumed: number
    target: number
    percentage: number
  }
  water: {
    consumed: number
    target: number
    percentage: number
  }
  workoutsThisWeek: number
  workoutsThisMonth: number
  currentStreak: number
  gardenScore: number
  gardenStage: number
  recentWorkouts: WorkoutLogItem[]
  recentMeals: MealItem[]
}

export interface WorkoutLogItem {
  id: string
  title: string
  durationMins: number | null
  caloriesBurned: number | null
  completedAt: string
}

export interface MealItem {
  id: string
  foodName: string
  calories: number
  mealType: string
  date: string
}

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
