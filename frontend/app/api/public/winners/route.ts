import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock public winners data - replace with real database queries
    const winners = [
      {
        pool_id: "pool-1",
        pool_name: "Daily Lucky 50",
        username: "lucky_player",
        position: 1,
        prize_amount: 675,
        total_participants: 15,
        draw_date: "2024-01-20T18:00:00Z",
      },
      {
        pool_id: "pool-2",
        pool_name: "Weekly Mega 100",
        username: "winner123",
        position: 1,
        prize_amount: 1125,
        total_participants: 25,
        draw_date: "2024-01-19T20:00:00Z",
      },
      {
        pool_id: "pool-2",
        pool_name: "Weekly Mega 100",
        username: "player456",
        position: 2,
        prize_amount: 675,
        total_participants: 25,
        draw_date: "2024-01-19T20:00:00Z",
      },
      {
        pool_id: "pool-3",
        pool_name: "Premium 200",
        username: "bigwinner",
        position: 1,
        prize_amount: 1260,
        total_participants: 18,
        draw_date: "2024-01-18T16:00:00Z",
      },
    ]

    return NextResponse.json({ success: true, winners })
  } catch (error) {
    console.error("Get public winners error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
