export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { authService } from "@/services/auth.service"
import { signupSchema } from "@/lib/schemas/auth.schema"
import { created, conflict, serverError, unprocessable, badRequest, parseZodErrors } from "@/lib/response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return unprocessable(parseZodErrors(parsed.error))
    }

    const result = await authService.signup(parsed.data)
    return created(result, "Account created successfully")
  } catch (err: any) {
    if (err.message === "EMAIL_TAKEN") {
      return conflict("An account with this email already exists")
    }
    console.error("[POST /api/auth/signup]", err)
    return serverError()
  }
}

