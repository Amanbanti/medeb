import { type NextRequest, NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  await destroySession()
  return NextResponse.redirect(new URL("/", request.url))
}
