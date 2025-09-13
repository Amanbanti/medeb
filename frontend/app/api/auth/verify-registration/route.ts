import { type NextRequest, NextResponse } from "next/server"
import { verifyOTP, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, username, email, otp } = await request.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json({ success: false, message: "Phone number and OTP are required" }, { status: 400 })
    }

    const result = await verifyOTP(phoneNumber, otp)

    if (result.success) {
      // Create new user with provided details
      const newUser = {
        id: `user-${Date.now()}`,
        phone_number: phoneNumber,
        username: username || phoneNumber.replace("+", "").slice(-8),
        email: email || undefined,
        is_verified: true,
        is_admin: false,
      }

      await createSession(newUser)
      return NextResponse.json({ success: true, user: newUser })
    }

    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 })
  } catch (error) {
    console.error("Verify registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
