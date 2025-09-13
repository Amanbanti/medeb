import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Mock win history - replace with real database queries
    const wins = [
      {
        id: "win-1",
        pool_name: "Daily Lucky 50",
        position: 1,
        prize_amount: 675,
        participants_count: 15,
        draw_date: "2024-01-19T18:00:00Z",
      },
      {
        id: "win-2",
        pool_name: "Evening Special 75",
        position: 2,
        prize_amount: 300,
        participants_count: 20,
        draw_date: "2024-01-12T20:00:00Z",
      },
    ]

    return NextResponse.json({ success: true, wins })
  } catch (error) {
    console.error("Get win history error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
