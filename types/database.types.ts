// Re-export Prisma generated types for convenience
export type {
  User,
  Profile,
  MedicalProfile,
  Workout,
  Exercise,
  WorkoutLog,
  NutritionLog,
  WeightHistory,
  Garden,
  Challenge,
  UserChallenge,
  Achievement,
  Notification,
  UserSettings,
  PasswordReset,
  EmailVerificationToken,
} from "@prisma/client"

// ─────────────────────────────────────────────
// SAFE USER (stripped of password hash)
// ─────────────────────────────────────────────
export interface SafeUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  gender: string | null
  dateOfBirth: Date | null
  avatarUrl: string | null
  emailVerified: boolean
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

// ─────────────────────────────────────────────
// USER WITH RELATIONS (for dashboard)
// ─────────────────────────────────────────────
export interface UserWithProfile extends SafeUser {
  profile: {
    id: string
    height: number | null
    weight: number | null
    goalWeight: number | null
    goalType: string | null
    activityLevel: string | null
    dailyCalories: number | null
    dailyProtein: number | null
    dailyWater: number | null
    dailySleep: number | null
  } | null
}
