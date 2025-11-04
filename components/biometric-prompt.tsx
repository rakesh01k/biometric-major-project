"use client"

import { Fingerprint, AlertCircle, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

interface BiometricPromptProps {
  title: string
  description: string
  status?: "ready" | "processing" | "success" | "error"
  errorMessage?: string
}

export function BiometricPrompt({ title, description, status = "ready", errorMessage }: BiometricPromptProps) {
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const checkWebAuthnSupport = async () => {
      const supported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      setIsSupported(supported)
    }

    if (window.PublicKeyCredential) {
      checkWebAuthnSupport()
    } else {
      setIsSupported(false)
    }
  }, [])

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">WebAuthn Not Supported</h3>
            <p className="text-sm text-yellow-800">
              Your browser or device doesn't support biometric authentication. Please use a compatible device or
              browser.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {status === "success" && <CheckCircle2 className="w-6 h-6 text-green-600" />}
            {status === "error" && <AlertCircle className="w-6 h-6 text-red-600" />}
            {(status === "ready" || status === "processing") && (
              <Fingerprint className={`w-6 h-6 text-teal-600 ${status === "processing" ? "animate-pulse" : ""}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-teal-900 mb-1">{title}</h3>
            <p className="text-sm text-teal-800">{description}</p>
            {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
        <p className="font-semibold text-slate-900">How it works:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Your biometric data never leaves your device</li>
          <li>Authentication happens locally on your Mac</li>
          <li>Only a cryptographic signature is sent to verify your identity</li>
          <li>Your fingerprint is never stored on our servers</li>
        </ul>
      </div>
    </div>
  )
}
