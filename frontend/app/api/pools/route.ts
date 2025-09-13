import { NextResponse } from "next/server"
import { getActivePools } from "@/lib/pools"

export async function GET() {
  try {
    const pools = await getActivePools()
    return NextResponse.json({ success: true, pools })
  } catch (error) {
    console.error("Get pools error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
