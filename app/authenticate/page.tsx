"use client"

import { AuthenticationForm } from "@/components/authentication-form"
import { WebAuthnInfo } from "@/components/webauthn-info"

export default function AuthenticatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Fingerprint Authentication</h1>
          <p className="text-slate-600 mt-2">Verify your identity using Touch ID on your Mac</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <WebAuthnInfo />

        <AuthenticationForm />
      </div>
    </div>
  )
}
