import { workoutRepository } from "@/repositories/workout.repository"
import { nutritionRepository } from "@/repositories/nutrition.repository"
import { profileRepository } from "@/repositories/profile.repository"
import { gardenRepository } from "@/repositories/garden.repository"
import { DashboardStats } from "@/types/api.types"

export const dashboardService = {
  async getStats(userId: string): Promise<DashboardStats> {
    const today = new Date().toISOString().split("T")[0]

    const [
      profile,
      dailyNutrition,
      recentLogs,
      recentMeals,
      workoutsThisWeek,
      workoutsThisMonth,
      garden,
    ] = await Promise.all([
      profileRepository.findByUserId(userId),
      nutritionRepository.getDailyTotals(userId, today),
      workoutRepository.getLogsByUser(userId, 5),
      nutritionRepository.getByDate(userId, today),
      workoutRepository.getLogsThisWeek(userId),
      workoutRepository.getLogsThisMonth(userId),
      gardenRepository.findByUserId(userId),
    ])

    const calorieTarget = profile?.dailyCalories ?? 2000
    const proteinTarget = profile?.dailyProtein ?? 150
    const waterTarget = profile?.dailyWater ?? 2.5

    // Derive carb/fat targets from calorie budget (40/30/30 default macro split)
    const carbTarget = Math.round((calorieTarget * 0.4) / 4)
    const fatTarget = Math.round((calorieTarget * 0.3) / 9)

    // Calculate current streak (consecutive days with at least one workout)
    const currentStreak = await calculateStreak(userId)

    return {
      calories: {
        consumed: dailyNutrition.calories,
        target: calorieTarget,
        percentage: Math.min(Math.round((dailyNutrition.calories / calorieTarget) * 100), 100),
      },
      protein: {
        consumed: Math.round(dailyNutrition.protein),
        target: proteinTarget,
        percentage: Math.min(Math.round((dailyNutrition.protein / proteinTarget) * 100), 100),
      },
      carbs: {
        consumed: Math.round(dailyNutrition.carbs),
        target: carbTarget,
        percentage: Math.min(Math.round((dailyNutrition.carbs / carbTarget) * 100), 100),
      },
      fat: {
        consumed: Math.round(dailyNutrition.fat),
        target: fatTarget,
        percentage: Math.min(Math.round((dailyNutrition.fat / fatTarget) * 100), 100),
      },
      water: {
        consumed: 0, // tracked separately
        target: waterTarget,
        percentage: 0,
      },
      workoutsThisWeek,
      workoutsThisMonth,
      currentStreak,
      gardenScore: garden?.consistencyScore ?? 0,
      gardenStage: garden?.growthStage ?? 0,
      recentWorkouts: recentLogs.map((log) => ({
        id: log.id,
        title: log.title,
        durationMins: log.durationMins,
        caloriesBurned: log.caloriesBurned,
        completedAt: log.completedAt.toISOString(),
      })),
      recentMeals: recentMeals.slice(0, 5).map((meal) => ({
        id: meal.id,
        foodName: meal.foodName,
        calories: meal.calories,
        mealType: meal.mealType,
        date: meal.date,
      })),
    }
  },
}

// ── Calculate workout streak ──────────────────
async function calculateStreak(userId: string): Promise<number> {
  const { prisma } = await import("@/lib/prisma")
  const logs = await prisma.workoutLog.findMany({
    where: { userId },
    select: { completedAt: true },
    orderBy: { completedAt: "desc" },
    take: 90,
  })

  if (logs.length === 0) return 0

  const days = new Set(
    logs.map((l) => l.completedAt.toISOString().split("T")[0])
  )

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 90; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    if (days.has(dateStr)) {
      streak++
    } else if (i > 0) {
      // Gap in streak — stop counting
      break
    }
  }

  return streak
}
