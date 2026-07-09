export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { workoutRepository } from "@/repositories/workout.repository"
import { gardenService } from "@/services/garden.service"
import { workoutLogSchema } from "@/lib/schemas/workout.schema"
import { success, created, unauthorized, serverError, unprocessable, parseZodErrors } from "@/lib/response"

// â”€â”€â”€ GET /api/workout-logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100)
    const offset = parseInt(searchParams.get("offset") ?? "0")

    const logs = await workoutRepository.getLogsByUser(token.sub, limit, offset)
    return success(logs)
  } catch (err) {
    console.error("[GET /api/workout-logs]", err)
    return serverError()
  }
}

// â”€â”€â”€ POST /api/workout-logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const body = await req.json()
    const parsed = workoutLogSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    const log = await workoutRepository.createLog({
      userId: token.sub,
      ...parsed.data,
    })

    // Trigger garden recalculation after workout
    await gardenService.recalculateGarden(token.sub).catch(console.error)

    return created(log, "Workout logged successfully")
  } catch (err) {
    console.error("[POST /api/workout-logs]", err)
    return serverError()
  }
}

