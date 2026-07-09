import { prisma } from "@/lib/prisma"

export const nutritionRepository = {
  async create(data: {
    userId: string
    foodName: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    mealType: string
    date: string
  }) {
    return prisma.nutritionLog.create({ data })
  },

  // Get all logs for a user on a specific date (YYYY-MM-DD)
  async getByDate(userId: string, date: string) {
    return prisma.nutritionLog.findMany({
      where: { userId, date },
      orderBy: { createdAt: "asc" },
    })
  },

  // Get aggregated daily totals for today
  async getDailyTotals(userId: string, date: string) {
    const logs = await this.getByDate(userId, date)
    return logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
        fiber: acc.fiber + log.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    )
  },

  async delete(id: string, userId: string) {
    return prisma.nutritionLog.deleteMany({ where: { id, userId } })
  },
}
