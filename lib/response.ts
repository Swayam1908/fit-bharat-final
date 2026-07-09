import { NextResponse } from "next/server"

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  errors?: Record<string, string[]>
}

// 200 OK
export function success<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({ success: true, data, message }, { status: 200 })
}

// 201 Created
export function created<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({ success: true, data, message }, { status: 201 })
}

// 400 Bad Request
export function badRequest(error: string, errors?: Record<string, string[]>): NextResponse {
  return NextResponse.json({ success: false, error, errors }, { status: 400 })
}

// 401 Unauthorized
export function unauthorized(error = "Authentication required"): NextResponse {
  return NextResponse.json({ success: false, error }, { status: 401 })
}

// 403 Forbidden
export function forbidden(error = "Access denied"): NextResponse {
  return NextResponse.json({ success: false, error }, { status: 403 })
}

// 404 Not Found
export function notFound(error = "Resource not found"): NextResponse {
  return NextResponse.json({ success: false, error }, { status: 404 })
}

// 409 Conflict
export function conflict(error: string): NextResponse {
  return NextResponse.json({ success: false, error }, { status: 409 })
}

// 422 Unprocessable Entity (Zod validation)
export function unprocessable(errors: Record<string, string[]>): NextResponse {
  return NextResponse.json(
    { success: false, error: "Validation failed", errors },
    { status: 422 }
  )
}

// 500 Internal Server Error
export function serverError(error = "Internal server error"): NextResponse {
  // Never expose raw DB/stack errors to client
  return NextResponse.json({ success: false, error }, { status: 500 })
}

// Parse Zod errors into flat field:message map
export function parseZodErrors(zodError: any): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  for (const issue of zodError.issues || []) {
    const key = issue.path.join(".")
    if (!errors[key]) errors[key] = []
    errors[key].push(issue.message)
  }
  return errors
}
