import { prisma } from "@/lib/prisma"
import { hashPassword, comparePassword } from "@/lib/password"
import { userRepository } from "@/repositories/user.repository"
import { profileRepository } from "@/repositories/profile.repository"
import { gardenRepository } from "@/repositories/garden.repository"
import { SignupResult, LoginResult } from "@/types/auth.types"
import { SignupInput, LoginInput } from "@/lib/schemas/auth.schema"
import crypto from "crypto"

export const authService = {
  // ─────────────────────────────────────────────
  // SIGN UP
  // ─────────────────────────────────────────────
  async signup(input: SignupInput): Promise<SignupResult> {
    const emailExists = await userRepository.emailExists(input.email)
    if (emailExists) {
      throw new Error("EMAIL_TAKEN")
    }

    const passwordHash = await hashPassword(input.password)

    // Create user + auto-initialize all related records in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: input.email.toLowerCase().trim(),
          passwordHash,
          fullName: input.fullName.trim(),
        },
      })

      // Auto-create profile with sensible defaults
      await tx.profile.create({
        data: {
          userId: newUser.id,
          dailyCalories: 2000,
          dailyProtein: 150,
          dailyWater: 2.5,
          dailySleep: 8,
        },
      })

      // Auto-create medical profile
      await tx.medicalProfile.create({
        data: {
          userId: newUser.id,
          healthConditions: [],
          injuries: [],
          medications: [],
          dietaryPreferences: [],
        },
      })

      // Auto-create garden
      await tx.garden.create({
        data: {
          userId: newUser.id,
          growthStage: 0,
          hydrationLevel: 0,
          consistencyScore: 0,
          sunlightLevel: 0,
          plantsUnlocked: [],
        },
      })

      // Auto-create settings
      await tx.userSettings.create({
        data: {
          userId: newUser.id,
          theme: "dark",
          language: "en",
          timezone: "Asia/Kolkata",
          notifications: true,
        },
      })

      // Welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          title: "Welcome to FitBharat! 🌱",
          message: "Your transformation journey starts today. Set your goals to get personalized recommendations.",
          type: "success",
        },
      })

      return newUser
    })

    const { passwordHash: _, ...safeUser } = user
    return { user: safeUser as any, requiresEmailVerification: false }
  },

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  async login(input: LoginInput): Promise<{ user: any }> {
    const user = await userRepository.findByEmailWithHash(input.email)

    if (!user) throw new Error("INVALID_CREDENTIALS")
    if (!user.isActive) throw new Error("ACCOUNT_INACTIVE")

    const passwordValid = await comparePassword(input.password, user.passwordHash)
    if (!passwordValid) throw new Error("INVALID_CREDENTIALS")

    // Update last login timestamp
    await userRepository.update(user.id, { lastLogin: new Date() })

    const { passwordHash, ...safeUser } = user
    return { user: safeUser }
  },

  // ─────────────────────────────────────────────
  // FORGOT PASSWORD — generate token
  // ─────────────────────────────────────────────
  async forgotPassword(email: string): Promise<{ token: string } | null> {
    const user = await userRepository.findByEmailWithHash(email)
    if (!user) return null // Don't reveal if email exists

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    })

    return { token }
  },

  // ─────────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetRecord) throw new Error("INVALID_TOKEN")
    if (resetRecord.used) throw new Error("TOKEN_USED")
    if (resetRecord.expiresAt < new Date()) throw new Error("TOKEN_EXPIRED")

    const passwordHash = await hashPassword(newPassword)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ])
  },

  // ─────────────────────────────────────────────
  // CHANGE PASSWORD (authenticated)
  // ─────────────────────────────────────────────
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findByEmailWithHash(
      (await userRepository.findById(userId))!.email
    )
    if (!user) throw new Error("USER_NOT_FOUND")

    const valid = await comparePassword(currentPassword, user.passwordHash)
    if (!valid) throw new Error("INVALID_CREDENTIALS")

    const passwordHash = await hashPassword(newPassword)
    await userRepository.updatePassword(userId, passwordHash)
  },
}
