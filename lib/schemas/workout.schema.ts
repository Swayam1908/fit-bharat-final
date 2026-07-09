import { z } from "zod"

export const workoutLogSchema = z.object({
  workoutId: z.string().optional(),
  title: z.string().min(1, "Workout title is required").max(200),
  durationMins: z.number().int().min(1).max(600).optional(),
  caloriesBurned: z.number().int().min(0).max(5000).optional(),
  totalVolumeKg: z.number().min(0).optional(),
  exercisesData: z.array(z.any()).optional(),
})

export const exerciseSchema = z.object({
  workoutId: z.string().min(1),
  name: z.string().min(1).max(200),
  sets: z.number().int().min(1).max(100).default(3),
  reps: z.number().int().min(1).max(1000).default(12),
  restSeconds: z.number().int().min(0).max(600).default(60),
  instructions: z.string().max(1000).optional(),
  muscleGroup: z.string().max(100).optional(),
  order: z.number().int().min(0).default(0),
})

export const weightLogSchema = z.object({
  weight: z.number().min(20).max(500),
  bodyFat: z.number().min(1).max(70).optional(),
  muscleMass: z.number().min(0).max(200).optional(),
})

export type WorkoutLogInput = z.infer<typeof workoutLogSchema>
export type ExerciseInput = z.infer<typeof exerciseSchema>
export type WeightLogInput = z.infer<typeof weightLogSchema>
