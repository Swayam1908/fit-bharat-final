export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { resetPasswordSchema } from "@/lib/schemas/auth.schema"
import { success, badRequest, serverError, unprocessable, parseZodErrors } from "@/lib/response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    await authService.resetPassword(parsed.data.token, parsed.data.password)
    return success({}, "Password reset successfully. You can now log in.")
  } catch (err: any) {
    if (err.message === "INVALID_TOKEN") return badRequest("Invalid or expired reset token")
    if (err.message === "TOKEN_USED") return badRequest("This reset link has already been used")
    if (err.message === "TOKEN_EXPIRED") return badRequest("This reset link has expired. Please request a new one.")
    console.error("[POST /api/auth/reset-password]", err)
    return serverError()
  }
}

