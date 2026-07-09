import { prisma } from "@/lib/prisma"

export const gardenRepository = {
  async createDefault(userId: string) {
    return prisma.garden.create({
      data: {
        userId,
        growthStage: 0,
        hydrationLevel: 0,
        consistencyScore: 0,
        sunlightLevel: 0,
        plantsUnlocked: [],
      },
    })
  },

  async findByUserId(userId: string) {
    return prisma.garden.findUnique({ where: { userId } })
  },

  async update(userId: string, data: Partial<{
    growthStage: number
    hydrationLevel: number
    consistencyScore: number
    sunlightLevel: number
    plantsUnlocked: any[]
    lastUpdated: Date
  }>) {
    return prisma.garden.upsert({
      where: { userId },
      create: {
        userId,
        growthStage: 0,
        hydrationLevel: 0,
        consistencyScore: 0,
        sunlightLevel: 0,
        plantsUnlocked: [],
        ...data,
      },
      update: { ...data, lastUpdated: new Date() },
    })
  },
}
