"use client"

import { useState } from "react"
import { WebAuthnRegister } from "./webauthn-register"
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

type EnrollmentStep = "info" | "capture" | "confirm"

interface EnrollmentData {
  name: string
  email: string
  phone: string
  credentialId: string | null
}

export function EnrollmentForm() {
  const [step, setStep] = useState<EnrollmentStep>("info")
  const [data, setData] = useState<EnrollmentData>({
    name: "",
    email: "",
    phone: "",
    credentialId: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInfoChange = (field: keyof Omit<EnrollmentData, "credentialId">, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleWebAuthnSuccess = (credentialId: string) => {
    setData((prev) => ({ ...prev, credentialId }))
    setStep("confirm")
  }

  const handleWebAuthnError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          credentialId: data.credentialId,
        }),
      })

      if (!response.ok) {
        throw new Error("Enrollment failed")
      }

      setIsComplete(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Enrollment failed"
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToCapture = data.name && data.email && data.phone

  if (isComplete) {
    return (
      <div className="card p-12 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Enrollment Successful!</h2>
        <p className="text-slate-600 mb-8 text-lg">
          Your fingerprint has been securely registered with Touch ID. You can now use it for authentication.
        </p>
        <a href="/" className="btn-primary inline-block">
          Return to Home
        </a>
      </div>
    )
  }

  return (
    <div className="card p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-12">
        {["info", "capture", "confirm"].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                step === s
                  ? "bg-teal-600 text-white scale-110"
                  : ["info", "capture", "confirm"].indexOf(step) > idx
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-600"
              }`}
            >
              {idx + 1}
            </div>
            {idx < 2 && (
              <div
                className={`h-1 w-16 mx-2 transition-all duration-200 ${
                  ["info", "capture", "confirm"].indexOf(step) > idx ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === "info" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
          <p className="text-slate-600">Please provide your details to get started</p>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleInfoChange("name", e.target.value)}
              placeholder="John Doe"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleInfoChange("email", e.target.value)}
              placeholder="john@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleInfoChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="input-field"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={() => setStep("capture")}
              disabled={!canProceedToCapture}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                canProceedToCapture ? "btn-primary" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === "capture" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Register Fingerprint</h2>
          <p className="text-slate-600">Use your Mac's Touch ID to register your fingerprint</p>

          <WebAuthnRegister
            userId={data.email}
            userName={data.email}
            displayName={data.name}
            onSuccess={handleWebAuthnSuccess}
            onError={handleWebAuthnError}
          />

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setStep("info")}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Confirm Enrollment</h2>
          <p className="text-slate-600">Review your information before completing enrollment</p>

          <div className="bg-slate-50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Name</span>
              <span className="font-semibold text-slate-900">{data.name}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Email</span>
              <span className="font-semibold text-slate-900">{data.email}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Phone</span>
              <span className="font-semibold text-slate-900">{data.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Fingerprint</span>
              <span className="text-green-600 font-semibold">Registered with Touch ID ✓</span>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setStep("capture")}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isSubmitting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-primary"
              }`}
            >
              {isSubmitting ? "Enrolling..." : "Complete Enrollment"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
