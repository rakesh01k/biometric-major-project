import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticationOptions } from "@/lib/webauthn"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const rpId = request.headers.get("host")?.split(":")[0] || "localhost"

    // In a real application, you would fetch allowed credentials from your database
    const allowedCredentialIds: string[] = []

    const options = getAuthenticationOptions(rpId, allowedCredentialIds)

    return NextResponse.json({
      success: true,
      options,
    })
  } catch (error) {
    console.error("[v0] Authentication options error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate authentication options" }, { status: 500 })
  }
}
