import { SafeUser } from "./database.types"

// ─────────────────────────────────────────────
// AUTH SESSION (stored in NextAuth JWT)
// ─────────────────────────────────────────────
export interface AuthSession {
  user: SafeUser
  accessToken: string
  expiresAt: number
}

// ─────────────────────────────────────────────
// AUTH CONTEXT
// ─────────────────────────────────────────────
export interface AuthContext {
  userId: string
  email: string
  fullName: string
}

// ─────────────────────────────────────────────
// SIGNUP RESULT
// ─────────────────────────────────────────────
export interface SignupResult {
  user: SafeUser
  requiresEmailVerification: boolean
}

// ─────────────────────────────────────────────
// LOGIN RESULT
// ─────────────────────────────────────────────
export interface LoginResult {
  user: SafeUser
  token: string
  expiresAt: Date
}
