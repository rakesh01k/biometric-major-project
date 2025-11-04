"use client"

import { useState, useEffect } from "react"
import { Fingerprint, AlertCircle } from "lucide-react"
import { base64urlToBuffer } from "@/lib/base64"
import { isWebAuthnAvailable, isInPreviewEnvironment } from "@/lib/webauthn-utils"

interface WebAuthnAuthenticateProps {
  email: string
  onSuccess: (matchScore: number) => void
  onError: (error: string) => void
}

export function WebAuthnAuthenticate({ email, onSuccess, onError }: WebAuthnAuthenticateProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [webAuthnAvailable, setWebAuthnAvailable] = useState<boolean | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    const checkAvailability = async () => {
      console.log("[v0] Checking WebAuthn availability for authentication...")
      const available = await isWebAuthnAvailable()
      const inPreview = isInPreviewEnvironment()

      console.log("[v0] WebAuthn available:", available)
      console.log("[v0] In preview:", inPreview)

      setWebAuthnAvailable(available)
      setDebugInfo(`WebAuthn: ${available ? "✓ Available" : "✗ Not available"} | Preview: ${inPreview ? "Yes" : "No"}`)
    }
    checkAvailability()
  }, [])

  const startAuthentication = async () => {
    setIsAuthenticating(true)
    setError(null)

    try {
      console.log("[v0] Starting real WebAuthn authentication...")

      if (!webAuthnAvailable) {
        throw new Error(
          "WebAuthn is not available on this device. Please ensure you're using a Mac with Touch ID or a device with biometric authentication.",
        )
      }

      const optionsResponse = await fetch("/api/webauthn/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!optionsResponse.ok) {
        throw new Error("Failed to get authentication options from server")
      }

      const { options } = await optionsResponse.json()
      console.log("[v0] Got authentication options from server")

      const challenge = base64urlToBuffer(options.challenge)

      console.log("[v0] Calling navigator.credentials.get()...")
      const assertion = (await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: options.timeout,
          rpId: options.rpId,
          userVerification: options.userVerification,
          allowCredentials: options.allowCredentials.map((cred: any) => ({
            type: cred.type,
            id: base64urlToBuffer(cred.id),
            transports: cred.transports,
          })),
        },
      })) as PublicKeyCredential | null

      if (!assertion) {
        throw new Error("Authentication was cancelled. Please try again and use your Touch ID when prompted.")
      }

      console.log("[v0] Assertion created successfully, verifying...")

      const verifyResponse = await fetch("/api/webauthn/verify-authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          assertion: {
            id: assertion.id,
            type: assertion.type,
            rawId: assertion.id,
          },
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Authentication failed. Your fingerprint could not be verified.")
      }

      const { matchScore } = await verifyResponse.json()
      console.log("[v0] Authentication verified successfully! Match score:", matchScore)
      onSuccess(matchScore)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed"
      console.error("[v0] WebAuthn authentication error:", errorMessage)
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (webAuthnAvailable === null) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border-2 border-teal-200 overflow-hidden shadow-lg flex items-center justify-center">
            <div className="text-center">
              <Fingerprint className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-pulse" />
              <p className="text-sm font-semibold text-teal-600">Checking device capabilities...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="text-xs text-slate-500 text-center">{debugInfo}</div>

      {/* WebAuthn Not Available Warning */}
      {!webAuthnAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Touch ID Not Available</p>
            <p className="text-sm text-red-800 mt-1">
              WebAuthn is not available on this device. Make sure you're using a Mac with Touch ID or a compatible
              device with biometric authentication.
            </p>
          </div>
        </div>
      )}

      {/* Scanner Display */}
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border-2 border-teal-200 overflow-hidden shadow-lg flex items-center justify-center">
          {isAuthenticating && (
            <div className="text-center">
              <Fingerprint className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-pulse" />
              <p className="text-sm font-semibold text-teal-600">Verifying with Touch ID...</p>
              <p className="text-xs text-teal-500 mt-2">Use your fingerprint on your device</p>
            </div>
          )}

          {!isAuthenticating && (
            <div className="text-center">
              <Fingerprint className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-600">Ready to authenticate</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {!isAuthenticating && <p className="text-slate-600">Click the button below to authenticate using Touch ID</p>}
        {isAuthenticating && <p className="text-teal-600 font-semibold">Follow the prompts on your device...</p>}
        {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={startAuthentication}
          disabled={isAuthenticating || !webAuthnAvailable}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isAuthenticating || !webAuthnAvailable ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-primary"
          }`}
        >
          <Fingerprint className="w-5 h-5" />
          {isAuthenticating ? "Authenticating..." : "Authenticate with Touch ID"}
        </button>
      </div>
    </div>
  )
}
