import { z } from "zod"

export const nutritionLogSchema = z.object({
  foodName: z.string().min(1, "Food name is required").max(300),
  calories: z.number().int().min(0).max(10000),
  protein: z.number().min(0).max(1000).default(0),
  carbs: z.number().min(0).max(1000).default(0),
  fat: z.number().min(0).max(1000).default(0),
  fiber: z.number().min(0).max(200).default(0),
  mealType: z
    .enum(["Breakfast", "Lunch", "Dinner", "Snack"])
    .default("Breakfast"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
})

export const parseMealSchema = z.object({
  prompt: z
    .string()
    .min(3, "Please describe your meal")
    .max(1000, "Description is too long"),
})

export type NutritionLogInput = z.infer<typeof nutritionLogSchema>
export type ParseMealInput = z.infer<typeof parseMealSchema>
