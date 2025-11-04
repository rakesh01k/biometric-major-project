"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Fingerprint } from "@/components/icons"
import { createUser, registerFingerprint, registerWebAuthn } from "@/lib/auth"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const [fingerprintStep, setFingerprintStep] = useState(false)
  const [fingerprintData, setFingerprintData] = useState<string | null>(null)
  const [isFingerprintCapturing, setIsFingerprintCapturing] = useState(false)
  const [fingerprintMessage, setFingerprintMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCaptureFingerprint = async () => {
    setIsFingerprintCapturing(true)
    setFingerprintMessage("Initializing fingerprint scanner...")

    try {
      const fingerprintId = await registerWebAuthn(currentUser.email, currentUser.name)

      if (!fingerprintId) {
        setFingerprintMessage("Fingerprint enrollment cancelled. You can add it later.")
        setTimeout(() => {
          setSuccessMessage("Account created! Redirecting to login...")
          setTimeout(() => {
            router.push("/")
          }, 2000)
        }, 1500)
        return
      }

      setFingerprintData(fingerprintId)
      setFingerprintMessage("Fingerprint enrolled successfully!")

      if (currentUser) {
        const registered = registerFingerprint(currentUser.email, fingerprintId)
        console.log("[v0] Fingerprint registration result:", registered)
      }

      setTimeout(() => {
        setSuccessMessage("Account created with fingerprint! Redirecting to login...")
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }, 1500)
    } catch (error) {
      console.log("[v0] Fingerprint capture error:", error)
      setFingerprintMessage("Fingerprint enrollment not available on this device. You can add it later in settings.")
      setTimeout(() => {
        setSuccessMessage("Account created! Redirecting to login...")
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }, 2000)
    } finally {
      setIsFingerprintCapturing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const user = createUser(formData.email, formData.password, formData.name, isAdmin)

      if (!user) {
        setErrors({ email: "This email is already registered" })
        setIsLoading(false)
        return
      }

      setCurrentUser(user)
      setFingerprintStep(true)
      setIsLoading(false)
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
      setIsLoading(false)
    }
  }

  if (fingerprintStep) {
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
            {/* Fingerprint Card */}
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Enroll Fingerprint</h1>
                <p className="text-center text-slate-600 mb-8">Secure your account with biometric authentication</p>

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                )}

                {fingerprintMessage && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                      fingerprintMessage.includes("successfully")
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <Fingerprint
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        fingerprintMessage.includes("successfully") ? "text-green-600" : "text-blue-600"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        fingerprintMessage.includes("successfully") ? "text-green-700" : "text-blue-700"
                      }`}
                    >
                      {fingerprintMessage}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Fingerprint Scanner Animation */}
                  <div className="flex justify-center">
                    <div
                      className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                        isFingerprintCapturing
                          ? "border-orange-500 bg-orange-50 animate-pulse"
                          : fingerprintData
                            ? "border-green-500 bg-green-50"
                            : "border-slate-300 bg-slate-50"
                      }`}
                    >
                      <Fingerprint
                        className={`w-16 h-16 ${
                          isFingerprintCapturing
                            ? "text-orange-500 animate-bounce"
                            : fingerprintData
                              ? "text-green-600"
                              : "text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Capture Button */}
                  <button
                    type="button"
                    onClick={handleCaptureFingerprint}
                    disabled={isFingerprintCapturing || !!fingerprintData}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFingerprintCapturing
                      ? "Scanning..."
                      : fingerprintData
                        ? "Fingerprint Enrolled ✓"
                        : "Scan Fingerprint"}
                  </button>

                  {/* Skip Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessMessage("Account created! Redirecting to login...")
                      setTimeout(() => {
                        router.push("/")
                      }, 2000)
                    }}
                    className="w-full py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                  >
                    Skip for Now
                  </button>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Tip:</strong> Fingerprint authentication provides an extra layer of security to your
                    account. You can add it later in your profile settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-sm text-slate-600">
              <p>Secure biometric enrollment</p>
              <p className="text-xs text-slate-500 mt-2">© 2025 University Management System</p>
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
            <User className="w-6 h-6 text-white" />
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
          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
            {/* Header with gradient */}
            <div className="h-32 bg-gradient-to-r from-teal-500 via-teal-400 to-orange-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-4 w-20 h-20 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-2 left-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create Account</h1>
              <p className="text-center text-slate-600 mb-8">Join our university system</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 bg-slate-50 ${
                        errors.name
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 bg-slate-50 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Admin Checkbox */}
                <div className="flex items-center gap-2 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded border-teal-300 text-teal-600"
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium text-teal-900">
                    Register as Administrator
                  </label>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                )}

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-teal-200 transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* Sign In Link */}
              <p className="text-center text-slate-600 mt-6">
                Already have an account?{" "}
                <Link href="/" className="text-orange-600 hover:text-orange-700 font-bold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>Secure account creation</p>
            <p className="text-xs text-slate-500 mt-2">© 2025 University Management System</p>
          </div>
        </div>
      </div>
    </div>
  )
}
