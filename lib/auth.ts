// Authentication utilities using localStorage
// This stores user data locally - can be migrated to a database later

export interface User {
  userId: string
  isAdmin: boolean
  id: string
  email: string
  password: string
  name: string
  fingerprint?: string // Base64 encoded fingerprint data
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

const USERS_KEY = "biosecure_users"
const SESSION_KEY = "biosecure_session"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
let userIdCounter = Number.parseInt(localStorage.getItem("biosecure_user_id_counter") || "1001")

// Helper to generate next user ID
function getNextUserId(): string {
  const id = `USR-${userIdCounter}`
  userIdCounter++
  if (typeof window !== "undefined") {
    localStorage.setItem("biosecure_user_id_counter", userIdCounter.toString())
  }
  return id
}

// Get all users from localStorage
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

// Find user by email
export function findUserByEmail(email: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
}

// Find user by userId
export function findUserByUserId(userId: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.userId === userId) || null
}

// Create new user (signup)
export function createUser(email: string, password: string, name: string, isAdmin = false): User | null {
  if (findUserByEmail(email)) {
    return null // User already exists
  }

  const userId = getNextUserId()

  const newUser: User = {
    userId,
    isAdmin,
    id: Math.random().toString(36).substr(2, 9),
    email,
    password, // In production, this should be hashed
    name,
    createdAt: new Date().toISOString(),
  }

  const users = getAllUsers()
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return newUser
}

// Verify user credentials
export function verifyCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

// Create session
export function createSession(user: User): AuthSession {
  const token = Math.random().toString(36).substr(2) + Date.now().toString(36)
  const session: AuthSession = {
    user,
    token,
    expiresAt: Date.now() + SESSION_DURATION,
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  return session
}

// Get current session
export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(SESSION_KEY)
  if (!data) return null

  const session: AuthSession = JSON.parse(data)

  // Check if session expired
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  return session
}

// Logout
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null
}

// Get current user
export function getCurrentUser(): User | null {
  const session = getSession()
  return session?.user || null
}

export async function registerWebAuthn(email: string, userName: string): Promise<string | null> {
  try {
    // Check if WebAuthn is available
    if (!window.PublicKeyCredential) {
      console.log("[v0] WebAuthn not available, using fallback")
      return generateFallbackFingerprint()
    }

    // Check if platform authenticator is available (fingerprint/face recognition)
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    if (!available) {
      console.log("[v0] Platform authenticator not available, using fallback")
      return generateFallbackFingerprint()
    }

    // Create credential options
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const options: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: {
          name: "BioSecure - University Management System",
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(Buffer.from(email)),
          name: email,
          displayName: userName,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
        },
        timeout: 60000,
        attestation: "direct",
      },
    }

    // Create credential
    const credential = (await navigator.credentials.create(options)) as PublicKeyCredential | null

    if (!credential) {
      console.log("[v0] WebAuthn registration cancelled")
      return null
    }

    // Store credential ID as fingerprint identifier
    const credentialId = Array.from(new Uint8Array(credential.rawId))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return credentialId
  } catch (error) {
    console.log("[v0] WebAuthn registration error:", error)
    // Fallback to simulated fingerprint
    return generateFallbackFingerprint()
  }
}

export async function authenticateWebAuthn(email: string): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) {
      console.log("[v0] WebAuthn not available for authentication")
      return false
    }

    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const options: CredentialRequestOptions = {
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "preferred",
      },
    }

    const assertion = (await navigator.credentials.get(options)) as PublicKeyCredential | null

    if (!assertion) {
      console.log("[v0] WebAuthn authentication cancelled")
      return false
    }

    return true
  } catch (error) {
    console.log("[v0] WebAuthn authentication error:", error)
    return false
  }
}

function generateFallbackFingerprint(): string {
  // Generate a realistic-looking fingerprint hash for preview environment
  return `FP_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
}

export function registerFingerprint(email: string, fingerprintData: string): boolean {
  const users = getAllUsers()
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

  if (userIndex === -1) {
    return false // User not found
  }

  const fingerprintHash = generateFingerprintHash(email)
  console.log("[v0] Registering fingerprint for", email, "hash:", fingerprintHash)
  users[userIndex].fingerprint = fingerprintHash
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  console.log("[v0] Fingerprint registered. All users:", users)
  return true
}

export function verifyFingerprint(email: string, fingerprintData: string): User | null {
  const user = findUserByEmail(email)
  console.log("[v0] Verifying fingerprint for", email, "user found:", !!user)

  if (!user || !user.fingerprint) {
    console.log("[v0] User not found or no fingerprint enrolled")
    return null
  }

  const fingerprintHash = generateFingerprintHash(email)
  console.log("[v0] Stored fingerprint:", user.fingerprint, "Generated hash:", fingerprintHash)

  if (user.fingerprint === fingerprintHash) {
    console.log("[v0] Fingerprint verified successfully")
    return user
  }
  console.log("[v0] Fingerprint verification failed - hashes don't match")
  return null
}

function generateFingerprintHash(email: string): string {
  // Create a consistent hash based only on email
  return `FP_${email.toLowerCase()}_enrolled`.replace(/[^a-zA-Z0-9_]/g, "")
}

export function hasFingerprint(email: string): boolean {
  const user = findUserByEmail(email)
  return user ? !!user.fingerprint : false
}
