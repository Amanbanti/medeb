import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getTransactionHistory } from "@/lib/wallet"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const transactions = await getTransactionHistory(session.user.id)

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
