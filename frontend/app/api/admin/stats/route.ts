import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    // Mock admin stats - replace with real database queries
    const stats = {
      totalUsers: 1247,
      activePools: 8,
      totalRevenue: 15420.5,
      totalPrizesPaid: 138784.5,
      recentPools: [
        {
          id: "pool-1",
          name: "Daily Lucky 50",
          participants: 15,
          status: "active",
          created_at: "2024-01-20T10:00:00Z",
        },
        {
          id: "pool-2",
          name: "Weekly Mega 100",
          participants: 32,
          status: "active",
          created_at: "2024-01-19T14:00:00Z",
        },
        {
          id: "pool-3",
          name: "Premium 200",
          participants: 8,
          status: "completed",
          created_at: "2024-01-18T16:00:00Z",
        },
      ],
      recentUsers: [
        {
          id: "user-1",
          username: "newplayer1",
          phone_number: "+251911234567",
          created_at: "2024-01-20T12:00:00Z",
        },
        {
          id: "user-2",
          username: "luckyuser",
          phone_number: "+251922345678",
          created_at: "2024-01-20T11:30:00Z",
        },
        {
          id: "user-3",
          username: "winner123",
          phone_number: "+251933456789",
          created_at: "2024-01-20T10:15:00Z",
        },
      ],
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
