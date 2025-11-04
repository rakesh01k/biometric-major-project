import { type NextRequest, NextResponse } from "next/server"
import { getRegistrationOptions } from "@/lib/webauthn"

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, displayName } = await request.json()

    const rpId = request.headers.get("host")?.split(":")[0] || "localhost"

    const options = getRegistrationOptions(userId, userName, displayName, rpId)

    return NextResponse.json({
      success: true,
      options,
    })
  } catch (error) {
    console.error("[v0] Registration options error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate registration options" }, { status: 500 })
  }
}
