import { prisma } from "@/lib/prisma"

export const profileRepository = {
  // ─── Create default profile ────────────────
  async createDefault(userId: string) {
    return prisma.profile.create({
      data: {
        userId,
        dailyCalories: 2000,
        dailyProtein: 150,
        dailyWater: 2.5,
        dailySleep: 8,
      },
    })
  },

  // ─── Get by userId ─────────────────────────
  async findByUserId(userId: string) {
    return prisma.profile.findUnique({ where: { userId } })
  },

  // ─── Upsert ────────────────────────────────
  async upsert(userId: string, data: Partial<{
    height: number
    weight: number
    goalWeight: number
    goalType: string
    activityLevel: string
    dailyCalories: number
    dailyProtein: number
    dailyWater: number
    dailySleep: number
  }>) {
    return prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    })
  },

  // ─── Create or get medical profile ─────────
  async createDefaultMedical(userId: string) {
    return prisma.medicalProfile.create({
      data: { userId, healthConditions: [], injuries: [], medications: [], dietaryPreferences: [] },
    })
  },

  async findMedicalByUserId(userId: string) {
    return prisma.medicalProfile.findUnique({ where: { userId } })
  },

  async upsertMedical(userId: string, data: Partial<{
    healthConditions: string[]
    injuries: string[]
    medications: string[]
    dietaryPreferences: string[]
    lifestyle: string
    profession: string
    recoveryMode: boolean
  }>) {
    return prisma.medicalProfile.upsert({
      where: { userId },
      create: { userId, healthConditions: [], injuries: [], medications: [], dietaryPreferences: [], ...data },
      update: data,
    })
  },
}
