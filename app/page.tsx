"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Fingerprint, Mail, Lock, Eye, EyeOff, AlertCircle } from "@/components/icons"
import {
  verifyCredentials,
  createSession,
  isAuthenticated,
  verifyFingerprint,
  hasFingerprint,
  authenticateWebAuthn,
} from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false)
  const [isFingerprintMode, setIsFingerprintMode] = useState(false)
  const [fingerprintEmail, setFingerprintEmail] = useState("")
  const [isScanningFingerprint, setIsScanningFingerprint] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  useEffect(() => {
    const checkWebAuthn = async () => {
      try {
        const available =
          window.PublicKeyCredential !== undefined &&
          (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
        setFingerprintAvailable(available)
      } catch (error) {
        setFingerprintAvailable(false)
      }
    }

    checkWebAuthn()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email.trim()) {
      setErrors({ email: "Email is required" })
      return
    }

    if (!password) {
      setErrors({ password: "Password is required" })
      return
    }

    setIsLoading(true)

    try {
      const user = verifyCredentials(email, password)

      if (!user) {
        setErrors({ submit: "Invalid email or password" })
        setIsLoading(false)
        return
      }

      createSession(user)
      router.push("/dashboard")
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
      setIsLoading(false)
    }
  }

  const handleFingerprintLogin = async () => {
    if (!fingerprintEmail.trim()) {
      setErrors({ fingerprint: "Please enter your email first" })
      return
    }

    setIsScanningFingerprint(true)
    setErrors({})

    try {
      if (!hasFingerprint(fingerprintEmail)) {
        setErrors({ fingerprint: "No fingerprint enrolled for this email. Please sign up with fingerprint first." })
        setIsScanningFingerprint(false)
        return
      }

      const webAuthnSuccess = await authenticateWebAuthn(fingerprintEmail)

      if (!webAuthnSuccess) {
        const user = verifyFingerprint(fingerprintEmail, "")
        console.log("[v0] Fingerprint verification result:", user)

        if (!user) {
          setErrors({ fingerprint: "Fingerprint verification failed. Please try again or use email/password login." })
          setIsScanningFingerprint(false)
          return
        }

        createSession(user)
        router.push("/dashboard")
        return
      }

      // WebAuthn successful - find user and create session
      const user = verifyFingerprint(fingerprintEmail, "")
      if (!user) {
        setErrors({ fingerprint: "User not found. Please sign up first." })
        setIsScanningFingerprint(false)
        return
      }

      createSession(user)
      router.push("/dashboard")
    } catch (error) {
      console.log("[v0] Fingerprint login error:", error)
      setErrors({ fingerprint: "Fingerprint authentication failed. Please try again." })
      setIsScanningFingerprint(false)
    }
  }

  if (isFingerprintMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
              BioSecure
            </span>
          </div>
          <div className="text-sm text-slate-600">University Management System</div>
        </nav>

        {/* Main Content */}
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Fingerprint Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
              {/* Header with gradient */}
              <div className="h-32 bg-gradient-to-r from-teal-500 via-teal-400 to-orange-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-4 w-20 h-20 bg-white rounded-full blur-xl"></div>
                  <div className="absolute bottom-2 left-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Fingerprint className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Fingerprint Login</h1>
                <p className="text-center text-slate-600 mb-8">Authenticate with your fingerprint</p>

                <div className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                      <input
                        type="email"
                        value={fingerprintEmail}
                        onChange={(e) => setFingerprintEmail(e.target.value)}
                        placeholder="your.email@university.edu"
                        disabled={isScanningFingerprint}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 bg-slate-50 ${
                          errors.fingerprint
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Fingerprint Scanner Animation */}
                  <div className="flex justify-center py-8">
                    <div
                      className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                        isScanningFingerprint
                          ? "border-orange-500 bg-orange-50 animate-pulse"
                          : "border-slate-300 bg-slate-50"
                      }`}
                    >
                      <Fingerprint
                        className={`w-16 h-16 ${
                          isScanningFingerprint ? "text-orange-500 animate-bounce" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Scan Button */}
                  <button
                    type="button"
                    onClick={handleFingerprintLogin}
                    disabled={isScanningFingerprint}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isScanningFingerprint ? "Scanning Fingerprint..." : "Scan Fingerprint"}
                  </button>

                  {errors.fingerprint && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{errors.fingerprint}</p>
                    </div>
                  )}

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsFingerprintMode(false)
                      setFingerprintEmail("")
                      setErrors({})
                    }}
                    className="w-full py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                  >
                    Back to Email Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
            BioSecure
          </span>
        </div>
        <div className="text-sm text-slate-600">University Management System</div>
      </nav>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
            {/* Header with gradient */}
            <div className="h-32 bg-gradient-to-r from-orange-500 via-orange-400 to-teal-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-4 w-20 h-20 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-2 left-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Fingerprint className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h1>
              <p className="text-center text-slate-600 mb-8">Sign in to your account</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 bg-slate-50 ${
                        errors.email
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 bg-slate-50 ${
                        errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-orange-500" />
                    <span className="text-slate-600">Remember me</span>
                  </label>
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                    Forgot password?
                  </a>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-500 font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Biometric Login */}
              <button
                type="button"
                onClick={() => setIsFingerprintMode(true)}
                className="w-full py-3 border-2 border-teal-200 text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-5 h-5" />
                Login with Fingerprint
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-slate-600 mt-6">
                Don't have an account?{" "}
                <Link href="/enroll" className="text-orange-600 hover:text-orange-700 font-bold">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>Secure biometric authentication system</p>
            <p className="text-xs text-slate-500 mt-2">© 2025 University Management System</p>
          </div>
        </div>
      </div>
    </div>
  )
}
