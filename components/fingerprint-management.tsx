"use client"

import { useState } from "react"
import { Fingerprint, Trash2, Plus, CheckCircle2 } from "lucide-react"

interface StoredFingerprint {
  id: string
  name: string
  finger: string
  enrolledDate: string
  lastUsed: string
  status: "active" | "inactive"
}

export function FingerprintManagement() {
  const [fingerprints, setFingerprints] = useState<StoredFingerprint[]>([
    {
      id: "fp-001",
      name: "Right Index",
      finger: "Right Index Finger",
      enrolledDate: "2024-10-15",
      lastUsed: "2024-10-25 14:32:00",
      status: "active",
    },
    {
      id: "fp-002",
      name: "Left Index",
      finger: "Left Index Finger",
      enrolledDate: "2024-10-20",
      lastUsed: "2024-10-24 09:15:00",
      status: "active",
    },
  ])

  const handleDelete = (id: string) => {
    setFingerprints((prev) => prev.filter((fp) => fp.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Add New Fingerprint */}
      <div className="card p-6 bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add New Fingerprint</h3>
              <p className="text-sm text-slate-600">Enroll an additional fingerprint for backup</p>
            </div>
          </div>
          <button className="btn-primary">Enroll Now</button>
        </div>
      </div>

      {/* Fingerprints List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Your Enrolled Fingerprints</h3>
        {fingerprints.map((fp) => (
          <div key={fp.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Fingerprint className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold text-slate-900">{fp.name}</h4>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {fp.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{fp.finger}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Enrolled</p>
                      <p className="font-semibold text-slate-900">{fp.enrolledDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Last Used</p>
                      <p className="font-semibold text-slate-900">{fp.lastUsed}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(fp.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Info */}
      <div className="card p-6 bg-blue-50 border-2 border-blue-200">
        <h4 className="font-bold text-slate-900 mb-2">Security Tip</h4>
        <p className="text-sm text-slate-700">
          We recommend enrolling at least 2 fingerprints for better authentication reliability. If one fingerprint is
          temporarily unavailable, you can use the other for authentication.
        </p>
      </div>
    </div>
  )
}
