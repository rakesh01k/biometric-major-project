"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

let toastId = 0
const toastListeners: Set<(toast: Toast) => void> = new Set()

export function showToast(message: string, type: ToastType = "info", duration = 3000) {
  const id = `toast-${toastId++}`
  const toast: Toast = { id, message, type, duration }
  toastListeners.forEach((listener) => listener(toast))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])

      if (toast.duration) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }, toast.duration)

        return () => clearTimeout(timer)
      }
    }

    toastListeners.add(handleToast)
    return () => {
      toastListeners.delete(handleToast)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slideInRight pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-white border border-slate-200"
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}

          <p className="text-sm font-medium text-slate-900">{toast.message}</p>

          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
