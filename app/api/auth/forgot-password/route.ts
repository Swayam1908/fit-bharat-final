export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { forgotPasswordSchema } from "@/lib/schemas/auth.schema"
import { success, serverError, unprocessable, parseZodErrors } from "@/lib/response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    // Always return success even if email not found â€” prevents email enumeration
    const result = await authService.forgotPassword(parsed.data.email)

    return success(
      { sent: true },
      "If an account with that email exists, a password reset link has been sent."
    )
  } catch (err: any) {
    console.error("[POST /api/auth/forgot-password]", err)
    return serverError()
  }
}

