export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { nutritionRepository } from "@/repositories/nutrition.repository"
import { gardenService } from "@/services/garden.service"
import { nutritionLogSchema } from "@/lib/schemas/nutrition.schema"
import { success, created, unauthorized, serverError, unprocessable, parseZodErrors } from "@/lib/response"

// â”€â”€â”€ GET /api/nutrition?date=YYYY-MM-DD â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0]

    const [logs, totals] = await Promise.all([
      nutritionRepository.getByDate(token.sub, date),
      nutritionRepository.getDailyTotals(token.sub, date),
    ])

    return success({ logs, totals, date })
  } catch (err) {
    console.error("[GET /api/nutrition]", err)
    return serverError()
  }
}

// â”€â”€â”€ POST /api/nutrition â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const body = await req.json()
    const parsed = nutritionLogSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    const log = await nutritionRepository.create({
      userId: token.sub,
      ...parsed.data,
    })

    // Trigger garden recalculation after meal log
    await gardenService.recalculateGarden(token.sub).catch(console.error)

    return created(log, "Meal logged successfully")
  } catch (err) {
    console.error("[POST /api/nutrition]", err)
    return serverError()
  }
}

