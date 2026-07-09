import { prisma } from "@/lib/prisma"

export const workoutRepository = {
  // ─── Workouts (master plans) ───────────────
  async getAll({ category }: { category?: string } = {}) {
    return prisma.workout.findMany({
      where: {
        isPublic: true,
        ...(category ? { category } : {}),
      },
      include: { exercises: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    })
  },

  async findById(id: string) {
    return prisma.workout.findUnique({
      where: { id },
      include: { exercises: { orderBy: { order: "asc" } } },
    })
  },

  // ─── Workout Logs ──────────────────────────
  async createLog(data: {
    userId: string
    workoutId?: string
    title: string
    durationMins?: number
    caloriesBurned?: number
    totalVolumeKg?: number
    exercisesData?: any[]
  }) {
    return prisma.workoutLog.create({ data })
  },

  async getLogsByUser(userId: string, limit = 20, offset = 0) {
    return prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: limit,
      skip: offset,
    })
  },

  async getLogsThisWeek(userId: string): Promise<number> {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    return prisma.workoutLog.count({
      where: { userId, completedAt: { gte: weekStart } },
    })
  },

  async getLogsThisMonth(userId: string): Promise<number> {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    return prisma.workoutLog.count({
      where: { userId, completedAt: { gte: monthStart } },
    })
  },

  // ─── Weight History ────────────────────────
  async createWeight(data: {
    userId: string
    weight: number
    bodyFat?: number
    muscleMass?: number
  }) {
    return prisma.weightHistory.create({ data })
  },

  async getWeightHistory(userId: string, days = 90) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    return prisma.weightHistory.findMany({
      where: { userId, recordedAt: { gte: since } },
      orderBy: { recordedAt: "asc" },
    })
  },
}
