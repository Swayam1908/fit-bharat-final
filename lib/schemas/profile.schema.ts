import { z } from "zod"

export const profileUpdateSchema = z.object({
  height: z.number().min(50).max(280).optional(),
  weight: z.number().min(20).max(500).optional(),
  goalWeight: z.number().min(20).max(500).optional(),
  goalType: z
    .enum(["Lose Weight", "Gain Muscle", "Maintain", "Endurance"])
    .optional(),
  activityLevel: z
    .enum(["Sedentary", "Light", "Moderate", "Active", "Very Active"])
    .optional(),
  dailyCalories: z.number().int().min(500).max(8000).optional(),
  dailyProtein: z.number().int().min(10).max(600).optional(),
  dailyWater: z.number().min(0.5).max(10).optional(),
  dailySleep: z.number().min(1).max(24).optional(),
})

export const medicalProfileSchema = z.object({
  healthConditions: z.array(z.string()).optional().default([]),
  injuries: z.array(z.string()).optional().default([]),
  medications: z.array(z.string()).optional().default([]),
  dietaryPreferences: z.array(z.string()).optional().default([]),
  lifestyle: z.enum(["Sedentary", "Active"]).optional(),
  profession: z.string().max(100).optional(),
  recoveryMode: z.boolean().optional().default(false),
})

export const userUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number").optional(),
  gender: z.enum(["Male", "Female", "Non-binary", "Prefer not to say"]).optional(),
  dateOfBirth: z.string().optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type MedicalProfileInput = z.infer<typeof medicalProfileSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
