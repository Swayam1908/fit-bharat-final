export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { dashboardService } from "@/services/dashboard.service"
import { success, unauthorized, serverError } from "@/lib/response"

// â”€â”€â”€ GET /api/dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const stats = await dashboardService.getStats(token.sub)
    return success(stats)
  } catch (err) {
    console.error("[GET /api/dashboard]", err)
    return serverError()
  }
}

