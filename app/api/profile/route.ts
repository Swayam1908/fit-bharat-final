export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { profileRepository } from "@/repositories/profile.repository"
import { userRepository } from "@/repositories/user.repository"
import { profileUpdateSchema, userUpdateSchema, medicalProfileSchema } from "@/lib/schemas/profile.schema"
import { success, unauthorized, serverError, unprocessable, parseZodErrors, notFound } from "@/lib/response"

// â”€â”€â”€ GET /api/profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const user = await userRepository.findWithProfile(token.sub)
    if (!user) return notFound("User not found")

    return success(user)
  } catch (err) {
    console.error("[GET /api/profile]", err)
    return serverError()
  }
}

// â”€â”€â”€ PATCH /api/profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.sub) return unauthorized()

    const body = await req.json()
    const { user: userFields, profile: profileFields, medical: medicalFields } = body

    // Validate and update user fields
    if (userFields) {
      const parsed = userUpdateSchema.safeParse(userFields)
      if (!parsed.success) return unprocessable(parseZodErrors(parsed.error))
      await userRepository.update(token.sub, parsed.data as any)
    }

    // Validate and update profile fields
    if (profileFields) {
      const parsed = profileUpdateSchema.safeParse(profileFields)
      if (!parsed.success) return unprocessable(parseZodErrors(parsed.error))
      await profileRepository.upsert(token.sub, parsed.data)
    }

    // Validate and update medical fields
    if (medicalFields) {
      const parsed = medicalProfileSchema.safeParse(medicalFields)
      if (!parsed.success) return unprocessable(parseZodErrors(parsed.error))
      await profileRepository.upsertMedical(token.sub, parsed.data)
    }

    const updated = await userRepository.findWithProfile(token.sub)
    return success(updated, "Profile updated successfully")
  } catch (err) {
    console.error("[PATCH /api/profile]", err)
    return serverError()
  }
}

