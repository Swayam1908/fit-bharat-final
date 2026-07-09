export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { gardenService } from "@/services/garden.service"
import { success, unauthorized, serverError } from "@/lib/response"

// â”€â”€â”€ GET /api/garden â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const garden = await gardenService.getGarden(token.sub)
    return success(garden)
  } catch (err) {
    console.error("[GET /api/garden]", err)
    return serverError()
  }
}

// â”€â”€â”€ PATCH /api/garden â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Manually trigger a garden recalculation (called after challenge completion etc.)
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    await gardenService.recalculateGarden(token.sub)
    const garden = await gardenService.getGarden(token.sub)
    return success(garden, "Garden updated")
  } catch (err) {
    console.error("[PATCH /api/garden]", err)
    return serverError()
  }
}

