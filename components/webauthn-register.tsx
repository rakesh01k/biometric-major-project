"use client"

import { useState, useEffect } from "react"
import { Fingerprint, RotateCcw, AlertCircle } from "lucide-react"
import { base64urlToBuffer } from "@/lib/base64"
import { isWebAuthnAvailable, isInPreviewEnvironment } from "@/lib/webauthn-utils"

interface WebAuthnRegisterProps {
  userId: string
  userName: string
  displayName: string
  onSuccess: (credentialId: string) => void
  onError: (error: string) => void
}

export function WebAuthnRegister({ userId, userName, displayName, onSuccess, onError }: WebAuthnRegisterProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [webAuthnAvailable, setWebAuthnAvailable] = useState<boolean | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    const checkAvailability = async () => {
      console.log("[v0] Checking WebAuthn availability...")
      const available = await isWebAuthnAvailable()
      const inPreview = isInPreviewEnvironment()

      console.log("[v0] WebAuthn available:", available)
      console.log("[v0] In preview:", inPreview)
      console.log("[v0] PublicKeyCredential exists:", !!window.PublicKeyCredential)

      setWebAuthnAvailable(available)
      setDebugInfo(`WebAuthn: ${available ? "✓ Available" : "✗ Not available"} | Preview: ${inPreview ? "Yes" : "No"}`)
    }
    checkAvailability()
  }, [])

  const startRegistration = async () => {
    setIsRegistering(true)
    setError(null)

    try {
      console.log("[v0] Starting real WebAuthn registration...")

      if (!webAuthnAvailable) {
        throw new Error(
          "WebAuthn is not available on this device. Please ensure you're using a Mac with Touch ID or a device with biometric authentication.",
        )
      }

      const optionsResponse = await fetch("/api/webauthn/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName, displayName }),
      })

      if (!optionsResponse.ok) {
        throw new Error("Failed to get registration options from server")
      }

      const { options } = await optionsResponse.json()
      console.log("[v0] Got registration options from server")

      const challenge = base64urlToBuffer(options.challenge)
      const userId_buffer = base64urlToBuffer(options.user.id)

      console.log("[v0] Calling navigator.credentials.create()...")
      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: options.rp,
          user: {
            id: userId_buffer,
            name: options.user.name,
            displayName: options.user.displayName,
          },
          pubKeyCredParams: options.pubKeyCredParams,
          timeout: options.timeout,
          attestation: options.attestation,
          authenticatorSelection: options.authenticatorSelection,
        },
      })) as PublicKeyCredential | null

      if (!credential) {
        throw new Error("Registration was cancelled. Please try again and use your Touch ID when prompted.")
      }

      console.log("[v0] Credential created successfully, verifying...")

      const verifyResponse = await fetch("/api/webauthn/verify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          credential: {
            id: credential.id,
            type: credential.type,
            rawId: credential.id,
          },
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify your fingerprint with the server")
      }

      const { credentialId } = await verifyResponse.json()
      console.log("[v0] Registration verified successfully!")

      setIsComplete(true)
      onSuccess(credentialId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      console.error("[v0] WebAuthn registration error:", errorMessage)
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsRegistering(false)
    }
  }

  const resetRegistration = () => {
    setIsComplete(false)
    setError(null)
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
          {isRegistering && (
            <div className="text-center">
              <Fingerprint className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-pulse" />
              <p className="text-sm font-semibold text-teal-600">Registering with Touch ID...</p>
              <p className="text-xs text-teal-500 mt-2">Use your fingerprint on your device</p>
            </div>
          )}

          {isComplete && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-sm font-semibold text-green-600">Registration Complete!</p>
            </div>
          )}

          {!isRegistering && !isComplete && (
            <div className="text-center">
              <Fingerprint className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-600">Ready to register</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {!isComplete && !isRegistering && (
          <p className="text-slate-600">Click the button below to register your fingerprint using Touch ID</p>
        )}
        {isRegistering && <p className="text-teal-600 font-semibold">Follow the prompts on your device...</p>}
        {isComplete && (
          <p className="text-green-600 font-semibold">Your fingerprint has been registered successfully!</p>
        )}
        {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!isComplete ? (
          <button
            onClick={startRegistration}
            disabled={isRegistering || !webAuthnAvailable}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isRegistering || !webAuthnAvailable ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-primary"
            }`}
          >
            <Fingerprint className="w-5 h-5" />
            {isRegistering ? "Registering..." : "Register with Touch ID"}
          </button>
        ) : (
          <>
            <button
              onClick={resetRegistration}
              className="flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Register Again
            </button>
            <button className="flex items-center gap-2 px-8 py-3 btn-primary cursor-default">✓ Registered</button>
          </>
        )}
      </div>
    </div>
  )
}
