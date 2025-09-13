import { type NextRequest, NextResponse } from "next/server"
import { verifyOTP, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json({ success: false, message: "Phone number and OTP are required" }, { status: 400 })
    }

    const result = await verifyOTP(phoneNumber, otp)

    if (result.success && result.user) {
      await createSession(result.user)
      return NextResponse.json({ success: true, user: result.user })
    }

    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
