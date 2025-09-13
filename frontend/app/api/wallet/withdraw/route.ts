import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { withdrawFunds } from "@/lib/wallet"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum withdrawal amount is 50 ETB",
        },
        { status: 400 },
      )
    }

    const result = await withdrawFunds(session.user.id, amount)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
