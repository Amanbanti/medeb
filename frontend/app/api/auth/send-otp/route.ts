import { type NextRequest, NextResponse } from "next/server"
import { sendOTP } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 })
    }

    const result = await sendOTP(phoneNumber)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
