import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, credential } = await request.json()

    // In a real application, you would:
    // 1. Verify the credential signature
    // 2. Store the public key in your database
    // 3. Associate it with the user

    console.log("[v0] Credential registered for user:", userId)

    return NextResponse.json({
      success: true,
      message: "Credential registered successfully",
      credentialId: credential.id,
    })
  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify credential" }, { status: 500 })
  }
}
