export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { success, created, unauthorized, serverError, conflict, notFound } from "@/lib/response"

// â”€â”€â”€ GET /api/challenges â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const [challenges, userChallenges] = await Promise.all([
      prisma.challenge.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
      prisma.userChallenge.findMany({ where: { userId: token.sub } }),
    ])

    const merged = challenges.map((ch) => {
      const uc = userChallenges.find((u) => u.challengeId === ch.id)
      return { ...ch, userChallenge: uc ?? null }
    })

    return success(merged)
  } catch (err) {
    console.error("[GET /api/challenges]", err)
    return serverError()
  }
}

