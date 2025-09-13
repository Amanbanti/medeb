import { type NextRequest, NextResponse } from "next/server"
import { sendOTP } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, username, email } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 })
    }

    // In real implementation, check if user already exists
    // For now, just send OTP
    const result = await sendOTP(phoneNumber)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `OTP sent to ${phoneNumber}. Use 123456 for testing.`,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
