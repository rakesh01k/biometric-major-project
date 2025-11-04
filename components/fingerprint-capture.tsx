"use client"

import { useState, useRef, useEffect } from "react"
import { Fingerprint, RotateCcw } from "lucide-react"

interface FingerprintCaptureProps {
  onCapture: (fingerprintData: string) => void
}

export function FingerprintCapture({ onCapture }: FingerprintCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isCaptured, setIsCaptured] = useState(false)
  const [capturedData, setCapturedData] = useState<string | null>(null)

  const generateFingerprintPattern = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw fingerprint-like pattern
    ctx.strokeStyle = "#0f766e"
    ctx.lineWidth = 1.5

    // Generate random ridge patterns
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

    // Add some dots for uniqueness
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
    setIsCaptured(false)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setIsCaptured(true)

          if (canvasRef.current) {
            generateFingerprintPattern(canvasRef.current)
            const fingerprintData = canvasRef.current.toDataURL()
            setCapturedData(fingerprintData)
          }

          return 100
        }
        return prev + Math.random() * 30
      })
    }, 300)
  }

  useEffect(() => {
    if (isCaptured && capturedData) {
      onCapture(capturedData)
    }
  }, [isCaptured, capturedData, onCapture])

  const resetCapture = () => {
    setIsCaptured(false)
    setScanProgress(0)
    setCapturedData(null)
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
        {!isCaptured && !isScanning && <p className="text-slate-600">Ready to capture your fingerprint</p>}
        {isScanning && <p className="text-teal-600 font-semibold">Keep your finger steady...</p>}
        {isCaptured && <p className="text-green-600 font-semibold">Fingerprint captured successfully!</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!isCaptured ? (
          <button
            onClick={startScanning}
            disabled={isScanning}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isScanning ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-primary"
            }`}
          >
            <Fingerprint className="w-5 h-5" />
            {isScanning ? "Scanning..." : "Start Scan"}
          </button>
        ) : (
          <>
            <button
              onClick={resetCapture}
              className="flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </button>
            <button className="flex items-center gap-2 px-8 py-3 btn-primary cursor-default">✓ Captured</button>
          </>
        )}
      </div>
    </div>
  )
}
