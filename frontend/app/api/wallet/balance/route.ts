import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getWalletBalance } from "@/lib/wallet"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const balance = await getWalletBalance(session.user.id)

    return NextResponse.json({ success: true, balance })
  } catch (error) {
    console.error("Get balance error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
