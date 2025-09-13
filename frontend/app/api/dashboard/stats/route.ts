import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Mock dashboard stats - replace with real database queries
    const stats = {
      totalWinnings: 1250.0,
      poolsJoined: 8,
      poolsWon: 3,
      winRate: 37.5,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
