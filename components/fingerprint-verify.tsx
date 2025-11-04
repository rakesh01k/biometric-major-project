"use client"

import { useState, useRef, useEffect } from "react"
import { Fingerprint, RotateCcw } from "lucide-react"

interface FingerprintVerifyProps {
  onVerificationComplete: (result: { success: boolean; message: string; matchScore?: number }) => void
}

export function FingerprintVerify({ onVerificationComplete }: FingerprintVerifyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationAttempts, setVerificationAttempts] = useState(0)

  const generateFingerprintPattern = (canvas: HTMLCanvasElement, variation = 0) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw fingerprint-like pattern with variation
    ctx.strokeStyle = "#0f766e"
    ctx.lineWidth = 1.5

    // Generate ridge patterns with some variation
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 40 + 20
      const startAngle = Math.random() * Math.PI * 2
      const endAngle = startAngle + Math.random() * Math.PI

      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, endAngle)
      ctx.stroke()
    }

    // Add dots for uniqueness
    ctx.fillStyle = "#0f766e"
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 2 + 1
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          startVerification()
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 300)
  }

  const startVerification = () => {
    setIsVerifying(true)

    // Generate fingerprint pattern
    if (canvasRef.current) {
      generateFingerprintPattern(canvasRef.current, verificationAttempts)
    }

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationAttempts((prev) => prev + 1)

      // Simulate match score - higher chance of success on first attempt
      const matchScore = Math.random() * 30 + 70 // 70-100%
      const isMatch = matchScore > 85

      if (isMatch) {
        onVerificationComplete({
          success: true,
          message: "Your fingerprint has been verified successfully. Welcome back!",
          matchScore: Math.round(matchScore),
        })
      } else if (verificationAttempts < 2) {
        // Allow retry
        setScanProgress(0)
      } else {
        // Too many attempts
        onVerificationComplete({
          success: false,
          message: "Authentication failed. Maximum verification attempts exceeded. Please try again later.",
          matchScore: Math.round(matchScore),
        })
      }
    }, 2000)
  }

  const resetScan = () => {
    setScanProgress(0)
    setVerificationAttempts(0)
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#f8fafc"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#f8fafc"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Scanner Display */}
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 bg-slate-50 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-lg">
          <canvas ref={canvasRef} width={256} height={256} className="w-full h-full" />

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-teal-500 bg-opacity-10 flex items-center justify-center">
              <div className="text-center">
                <Fingerprint className="w-12 h-12 text-teal-600 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-teal-600">Scanning...</p>
              </div>
            </div>
          )}

          {/* Verifying Overlay */}
          {isVerifying && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-600">Verifying...</p>
              </div>
            </div>
          )}

          {/* Scanning Line Animation */}
          {isScanning && (
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-b from-teal-400 to-transparent"
              style={{
                top: `${scanProgress}%`,
                transition: "top 0.1s linear",
              }}
            />
          )}
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="w-64 mt-6">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-teal-600 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
            </div>
            <p className="text-center text-sm text-slate-600 mt-2">{Math.round(scanProgress)}%</p>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center">
        {!isScanning && !isVerifying && verificationAttempts === 0 && (
          <p className="text-slate-600">Ready to verify your fingerprint</p>
        )}
        {isScanning && <p className="text-teal-600 font-semibold">Keep your finger steady...</p>}
        {isVerifying && <p className="text-blue-600 font-semibold">Comparing with stored fingerprint...</p>}
        {!isScanning && !isVerifying && verificationAttempts > 0 && verificationAttempts < 3 && (
          <p className="text-slate-600">Attempt {verificationAttempts} of 3</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!isScanning && !isVerifying && (
          <>
            <button
              onClick={startScanning}
              className="flex items-center gap-2 px-8 py-3 btn-primary rounded-lg font-semibold transition-all duration-200"
            >
              <Fingerprint className="w-5 h-5" />
              {verificationAttempts === 0 ? "Start Verification" : "Try Again"}
            </button>
            {verificationAttempts > 0 && (
              <button
                onClick={resetScan}
                className="flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
