import { prisma } from "@/lib/prisma"
import { SafeUser } from "@/types/database.types"

// Strip password hash before returning to any caller
function toSafeUser(user: any): SafeUser {
  const { passwordHash, ...safe } = user
  return safe
}

export const userRepository = {
  // ─── Create ────────────────────────────────
  async create(data: {
    email: string
    passwordHash: string
    fullName: string
  }): Promise<SafeUser> {
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        fullName: data.fullName.trim(),
      },
    })
    return toSafeUser(user)
  },

  // ─── Find by ID ────────────────────────────
  async findById(id: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? toSafeUser(user) : null
  },

  // ─── Find by Email (includes hash for auth) ─
  async findByEmailWithHash(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })
  },

  // ─── Find with Profile ─────────────────────
  async findWithProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true, settings: true },
    })
    if (!user) return null
    const { passwordHash, ...safe } = user
    return safe
  },

  // ─── Update ────────────────────────────────
  async update(id: string, data: Partial<{
    fullName: string
    phone: string
    gender: string
    dateOfBirth: Date
    avatarUrl: string
    emailVerified: boolean
    isActive: boolean
    lastLogin: Date
  }>): Promise<SafeUser> {
    const user = await prisma.user.update({ where: { id }, data })
    return toSafeUser(user)
  },

  // ─── Update password hash ──────────────────
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { passwordHash } })
  },

  // ─── Check email exists ─────────────────────
  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email.toLowerCase().trim() },
    })
    return count > 0
  },

  // ─── Soft delete (deactivate) ──────────────
  async deactivate(id: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { isActive: false } })
  },
}
