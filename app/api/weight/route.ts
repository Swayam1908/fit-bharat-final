export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { workoutRepository } from "@/repositories/workout.repository"
import { weightLogSchema } from "@/lib/schemas/workout.schema"
import { success, created, unauthorized, serverError, unprocessable, parseZodErrors } from "@/lib/response"

// â”€â”€â”€ GET /api/weight â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") ?? "90")

    const history = await workoutRepository.getWeightHistory(token.sub, days)
    return success(history)
  } catch (err) {
    console.error("[GET /api/weight]", err)
    return serverError()
  }
}

// â”€â”€â”€ POST /api/weight â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const body = await req.json()
    const parsed = weightLogSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    const entry = await workoutRepository.createWeight({
      userId: token.sub,
      ...parsed.data,
    })

    return created(entry, "Weight logged successfully")
  } catch (err) {
    console.error("[POST /api/weight]", err)
    return serverError()
  }
}

