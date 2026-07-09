import { gardenRepository } from "@/repositories/garden.repository"
import { workoutRepository } from "@/repositories/workout.repository"
import { nutritionRepository } from "@/repositories/nutrition.repository"
import { profileRepository } from "@/repositories/profile.repository"
import { prisma } from "@/lib/prisma"

// ─────────────────────────────────────────────
// GARDEN BUSINESS LOGIC
// The garden grows based on the user's daily
// activity: workouts, hydration, nutrition,
// sleep, and consistency streak.
// ─────────────────────────────────────────────

export const gardenService = {
  /**
   * Recalculate garden scores after any user activity.
   * Called after: workout log, nutrition log, challenge completion.
   */
  async recalculateGarden(userId: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0]

    // Gather signals in parallel
    const [profile, workoutsThisWeek, todayNutrition, garden] = await Promise.all([
      profileRepository.findByUserId(userId),
      workoutRepository.getLogsThisWeek(userId),
      nutritionRepository.getDailyTotals(userId, today),
      gardenRepository.findByUserId(userId),
    ])

    if (!profile) return

    // ── Hydration score (0-100) ──────────────
    // Estimate water from nutrition context (ideally tracked separately)
    // For now, derive from today's calorie completion as a proxy
    const calorieTarget = profile.dailyCalories ?? 2000
    const calorieCompletion = Math.min(
      (todayNutrition.calories / calorieTarget) * 100,
      100
    )

    // ── Consistency score (0-100) ────────────
    // Workouts this week: target 5. Each workout = 20 points
    const consistencyScore = Math.min(workoutsThisWeek * 20, 100)

    // ── Sunlight score (0-100) ───────────────
    // Based on protein target completion
    const proteinTarget = profile.dailyProtein ?? 150
    const sunlightLevel = Math.min(
      (todayNutrition.protein / proteinTarget) * 100,
      100
    )

    // ── Hydration level proxy ────────────────
    const hydrationLevel = Math.min(Math.round(calorieCompletion), 100)

    // ── Growth stage (0-4) ───────────────────
    const overallScore = (consistencyScore + sunlightLevel + hydrationLevel) / 3
    let growthStage = 0
    if (overallScore >= 80) growthStage = 4  // Full tree
    else if (overallScore >= 60) growthStage = 3  // Mature plant
    else if (overallScore >= 40) growthStage = 2  // Growing plant
    else if (overallScore >= 20) growthStage = 1  // Sprout
    else growthStage = 0  // Seed

    await gardenRepository.update(userId, {
      hydrationLevel: Math.round(hydrationLevel),
      consistencyScore: Math.round(consistencyScore),
      sunlightLevel: Math.round(sunlightLevel),
      growthStage,
      lastUpdated: new Date(),
    })

    // ── Award achievements if growth unlocks ─
    if (growthStage === 4) {
      const existing = await prisma.achievement.findFirst({
        where: { userId, title: "Full Bloom" },
      })
      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId,
            title: "Full Bloom",
            description: "Your garden reached full growth! Outstanding consistency.",
            iconKey: "tree",
          },
        })
      }
    }
  },

  async getGarden(userId: string) {
    const garden = await gardenRepository.findByUserId(userId)
    if (!garden) {
      return gardenRepository.createDefault(userId)
    }
    return garden
  },
}
