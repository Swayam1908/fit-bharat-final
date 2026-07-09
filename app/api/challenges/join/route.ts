export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { gardenService } from "@/services/garden.service"
import { success, created, unauthorized, serverError, conflict, notFound, badRequest } from "@/lib/response"
import { z } from "zod"

const joinSchema = z.object({ challengeId: z.string().min(1) })
const claimSchema = z.object({ challengeId: z.string().min(1) })

// â”€â”€â”€ POST /api/challenges/join â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const body = await req.json()
    const { action } = body

    if (action === "claim") {
      const parsed = claimSchema.safeParse(body)
      if (!parsed.success) return badRequest("challengeId is required")

      const uc = await prisma.userChallenge.findUnique({
        where: { userId_challengeId: { userId: token.sub, challengeId: parsed.data.challengeId } },
      })

      if (!uc) return notFound("You have not joined this challenge")
      if (!uc.completed) return badRequest("Challenge not completed yet")
      if (uc.rewardClaimed) return conflict("Reward already claimed")

      const updated = await prisma.userChallenge.update({
        where: { id: uc.id },
        data: { rewardClaimed: true },
      })

      // Boost garden after claiming reward
      await gardenService.recalculateGarden(token.sub).catch(console.error)
      return success(updated, "Reward claimed!")
    }

    // Default: join a challenge
    const parsed = joinSchema.safeParse(body)
    if (!parsed.success) return badRequest("challengeId is required")

    const challenge = await prisma.challenge.findUnique({ where: { id: parsed.data.challengeId } })
    if (!challenge) return notFound("Challenge not found")

    const existing = await prisma.userChallenge.findUnique({
      where: { userId_challengeId: { userId: token.sub, challengeId: parsed.data.challengeId } },
    })
    if (existing) return conflict("You have already joined this challenge")

    const userChallenge = await prisma.userChallenge.create({
      data: { userId: token.sub, challengeId: parsed.data.challengeId },
    })

    return created(userChallenge, "Challenge joined!")
  } catch (err) {
    console.error("[POST /api/challenges/join]", err)
    return serverError()
  }
}

