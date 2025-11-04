import { Shield, Lock, Zap } from "lucide-react"

export function WebAuthnInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
        <Shield className="w-8 h-8 text-teal-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-2">Secure</h3>
        <p className="text-sm text-slate-600">
          Your biometric data stays on your device. We only verify cryptographic signatures.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <Lock className="w-8 h-8 text-blue-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-2">Private</h3>
        <p className="text-sm text-slate-600">
          No fingerprint images are transmitted or stored. Your privacy is protected.
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <Zap className="w-8 h-8 text-green-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-2">Fast</h3>
        <p className="text-sm text-slate-600">Authenticate in seconds using your Mac's built-in Touch ID sensor.</p>
      </div>
    </div>
  )
}
