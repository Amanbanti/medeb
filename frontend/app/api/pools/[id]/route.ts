import { type NextRequest, NextResponse } from "next/server"
import { getPoolById } from "@/lib/pools"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await getPoolById(params.id)

    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, pool })
  } catch (error) {
    console.error("Get pool error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
