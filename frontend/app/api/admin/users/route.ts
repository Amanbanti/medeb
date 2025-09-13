import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    // Mock users data - replace with real database queries
    const users = [
      {
        id: "user-1",
        username: "testuser1",
        phone_number: "+251911234567",
        email: "user1@example.com",
        is_verified: true,
        is_admin: false,
        wallet_balance: 250.0,
        pools_joined: 5,
        total_winnings: 450.0,
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "user-2",
        username: "luckyplayer",
        phone_number: "+251922345678",
        email: "lucky@example.com",
        is_verified: true,
        is_admin: false,
        wallet_balance: 1200.0,
        pools_joined: 12,
        total_winnings: 2340.0,
        created_at: "2024-01-10T14:30:00Z",
      },
      {
        id: "user-3",
        username: "admin",
        phone_number: "+251933456789",
        email: "admin@luckybirr.com",
        is_verified: true,
        is_admin: true,
        wallet_balance: 0.0,
        pools_joined: 0,
        total_winnings: 0.0,
        created_at: "2024-01-01T00:00:00Z",
      },
    ]

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
