export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { workoutRepository } from "@/repositories/workout.repository"
import { success, unauthorized, serverError } from "@/lib/response"

// â”€â”€â”€ GET /api/workouts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category") ?? undefined

    const workouts = await workoutRepository.getAll({ category })
    return success(workouts)
  } catch (err) {
    console.error("[GET /api/workouts]", err)
    return serverError()
  }
}

