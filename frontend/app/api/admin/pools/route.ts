import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { name, description, entry_fee, min_participants, max_participants, winner_count, draw_hours } =
      await request.json()

    // Validation
    if (!name || !description || !entry_fee || !min_participants || !max_participants || !winner_count) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (entry_fee < 1) {
      return NextResponse.json({ success: false, message: "Entry fee must be at least 1 ETB" }, { status: 400 })
    }

    if (min_participants < 2 || max_participants < min_participants) {
      return NextResponse.json({ success: false, message: "Invalid participant limits" }, { status: 400 })
    }

    if (winner_count < 1 || winner_count > max_participants) {
      return NextResponse.json({ success: false, message: "Invalid winner count" }, { status: 400 })
    }

    // Calculate draw date
    const drawDate = new Date(Date.now() + draw_hours * 60 * 60 * 1000)

    // Mock pool creation - replace with real database insertion
    const newPool = {
      id: `pool-${Date.now()}`,
      name,
      description,
      entry_fee,
      min_participants,
      max_participants,
      winner_count,
      status: "active",
      draw_date: drawDate.toISOString(),
      created_by: admin.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_participants: 0,
      total_prize: 0,
    }

    return NextResponse.json({ success: true, pool: newPool })
  } catch (error) {
    console.error("Create pool error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
