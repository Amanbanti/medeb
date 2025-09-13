import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { depositFunds } from "@/lib/wallet"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 10 || amount > 10000) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be between 10 and 10,000 ETB",
        },
        { status: 400 },
      )
    }

    const result = await depositFunds(session.user.id, amount)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
