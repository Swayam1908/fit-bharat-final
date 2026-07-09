export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { loginSchema } from "@/lib/schemas/auth.schema"
import { success, unauthorized, serverError, unprocessable, parseZodErrors } from "@/lib/response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    const result = await authService.login(parsed.data)
    return success(result, "Login successful")
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      return unauthorized("Invalid email or password")
    }
    if (err.message === "ACCOUNT_INACTIVE") {
      return unauthorized("Your account has been deactivated. Please contact support.")
    }
    console.error("[POST /api/auth/login]", err)
    return serverError()
  }
}

