import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface User {
  id: string
  phone_number: string
  username?: string
  email?: string
  is_verified: boolean
  is_admin: boolean
}

export interface AuthSession {
  user: User
  expires: string
}

// Mock authentication for now - replace with real implementation
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("luckybirr-session")

  if (!sessionCookie) {
    return null
  }

  try {
    // In real implementation, verify JWT token here
    const session = JSON.parse(sessionCookie.value)
    return session
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return session.user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()

  if (!user.is_admin) {
    redirect("/dashboard")
  }

  return user
}

export async function createSession(user: User): Promise<void> {
  const session: AuthSession = {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  }

  const cookieStore = await cookies()
  cookieStore.set("luckybirr-session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("luckybirr-session")
}

// Mock OTP service - replace with real SMS service
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // In real implementation, save OTP to database and send SMS
  console.log(`[MOCK SMS] OTP for ${phoneNumber}: ${otp}`)

  return {
    success: true,
    message: `OTP sent to ${phoneNumber}. Check console for mock OTP: ${otp}`,
  }
}

export async function verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; user?: User }> {
  // Mock verification - in real implementation, check against database
  if (otp === "123456") {
    const mockUser: User = {
      id: "mock-user-id",
      phone_number: phoneNumber,
      username: phoneNumber.replace("+", "").slice(-8),
      is_verified: true,
      is_admin: false,
    }

    return { success: true, user: mockUser }
  }

  return { success: false }
}
