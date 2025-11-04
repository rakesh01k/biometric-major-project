"use client"

import { useState } from "react"
import { WebAuthnAuthenticate } from "./webauthn-authenticate"
import { ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react"

type AuthStep = "identify" | "verify" | "result"

interface AuthResult {
  success: boolean
  message: string
  matchScore?: number
}

export function AuthenticationForm() {
  const [step, setStep] = useState<AuthStep>("identify")
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<AuthResult | null>(null)

  const handleIdentify = () => {
    if (email) {
      setStep("verify")
    }
  }

  const handleAuthenticationSuccess = (matchScore: number) => {
    setResult({
      success: true,
      message: "Your fingerprint has been verified successfully!",
      matchScore,
    })
    setStep("result")
  }

  const handleAuthenticationError = (error: string) => {
    setResult({
      success: false,
      message: error || "Authentication failed. Please try again.",
    })
    setStep("result")
  }

  const handleReset = () => {
    setStep("identify")
    setEmail("")
    setResult(null)
  }

  return (
    <div className="card p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-12">
        {["identify", "verify", "result"].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                step === s
                  ? "bg-teal-600 text-white scale-110"
                  : ["identify", "verify", "result"].indexOf(step) > idx
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-600"
              }`}
            >
              {idx + 1}
            </div>
            {idx < 2 && (
              <div
                className={`h-1 w-16 mx-2 transition-all duration-200 ${
                  ["identify", "verify", "result"].indexOf(step) > idx ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === "identify" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">User Identification</h2>
          <p className="text-slate-600">Enter your email address to begin authentication</p>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="input-field"
              onKeyPress={(e) => e.key === "Enter" && email && handleIdentify()}
            />
            <p className="text-xs text-slate-500 mt-2">Use the email you registered with</p>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleIdentify}
              disabled={!email}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                email ? "btn-primary" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Fingerprint Verification</h2>
          <p className="text-slate-600">
            Authenticating user: <span className="font-semibold text-slate-900">{email}</span>
          </p>

          <WebAuthnAuthenticate
            email={email}
            onSuccess={handleAuthenticationSuccess}
            onError={handleAuthenticationError}
          />
        </div>
      )}

      {step === "result" && result && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Authentication Result</h2>

          <div className={`rounded-lg p-8 text-center ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex justify-center mb-4">
              {result.success ? (
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-500" />
              )}
            </div>

            <h3 className={`text-2xl font-bold mb-2 ${result.success ? "text-green-900" : "text-red-900"}`}>
              {result.success ? "Authentication Successful" : "Authentication Failed"}
            </h3>

            <p className={`text-lg mb-4 ${result.success ? "text-green-700" : "text-red-700"}`}>{result.message}</p>

            {result.matchScore !== undefined && (
              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-2">Match Score</p>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.matchScore >= 85 ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${result.matchScore}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-2">{result.matchScore}% Match</p>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
              {result.success ? (
                <>
                  <a href="/dashboard" className="btn-primary px-8 py-3">
                    Go to Dashboard
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
                  >
                    Authenticate Again
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleReset} className="btn-primary px-8 py-3">
                    Try Again
                  </button>
                  <a
                    href="/"
                    className="px-8 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
                  >
                    Return Home
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
