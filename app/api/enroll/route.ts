import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a database like Supabase or MongoDB
const enrolledUsers: Array<{
  id: string
  name: string
  email: string
  phone: string
  credentialId: string
  enrolledAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, credentialId } = body

    // Validate required fields
    if (!name || !email || !phone || !credentialId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already enrolled
    if (enrolledUsers.some((user) => user.email === email)) {
      return NextResponse.json({ error: "Email already enrolled" }, { status: 409 })
    }

    // Create new enrollment record
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      credentialId,
      enrolledAt: new Date().toISOString(),
    }

    enrolledUsers.push(newUser)

    console.log("[v0] User enrolled:", newUser)

    return NextResponse.json(
      {
        success: true,
        message: "Enrollment successful",
        userId: newUser.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Enrollment error:", error)
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 })
  }
}

// GET endpoint to retrieve enrolled users (for testing)
export async function GET() {
  return NextResponse.json({
    enrolledUsers,
    count: enrolledUsers.length,
  })
}
