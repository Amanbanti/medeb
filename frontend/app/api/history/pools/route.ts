import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Mock pool history - replace with real database queries
    const history = [
      {
        id: "entry-1",
        pool: {
          id: "pool-1",
          name: "Daily Lucky 50",
          entry_fee: 50,
          current_participants: 15,
          winner_count: 1,
        },
        joined_at: "2024-01-18T10:00:00Z",
        result: {
          status: "won",
          position: 1,
          prize_amount: 675,
          total_winners: 1,
          draw_date: "2024-01-19T18:00:00Z",
        },
      },
      {
        id: "entry-2",
        pool: {
          id: "pool-2",
          name: "Weekly Mega 100",
          entry_fee: 100,
          current_participants: 25,
          winner_count: 3,
        },
        joined_at: "2024-01-15T14:30:00Z",
        result: {
          status: "lost",
          total_winners: 3,
          draw_date: "2024-01-16T20:00:00Z",
        },
      },
      {
        id: "entry-3",
        pool: {
          id: "pool-3",
          name: "Premium 200",
          entry_fee: 200,
          current_participants: 12,
          winner_count: 2,
        },
        joined_at: "2024-01-20T09:00:00Z",
        result: {
          status: "pending",
          draw_date: "2024-01-21T16:00:00Z",
        },
      },
    ]

    return NextResponse.json({ success: true, history })
  } catch (error) {
    console.error("Get pool history error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
