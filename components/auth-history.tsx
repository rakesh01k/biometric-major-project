"use client"

import { CheckCircle2, XCircle } from "lucide-react"

interface AuthAttempt {
  id: string
  timestamp: string
  status: "success" | "failed"
  matchScore: number
  device: string
  location: string
}

export function AuthHistory() {
  const attempts: AuthAttempt[] = [
    {
      id: "auth-001",
      timestamp: "2024-10-25 14:32:00",
      status: "success",
      matchScore: 98,
      device: "Chrome on Windows",
      location: "New York, NY",
    },
    {
      id: "auth-002",
      timestamp: "2024-10-25 09:15:00",
      status: "success",
      matchScore: 95,
      device: "Safari on macOS",
      location: "New York, NY",
    },
    {
      id: "auth-003",
      timestamp: "2024-10-24 18:45:00",
      status: "success",
      matchScore: 92,
      device: "Chrome on Windows",
      location: "New York, NY",
    },
    {
      id: "auth-004",
      timestamp: "2024-10-24 15:20:00",
      status: "failed",
      matchScore: 62,
      device: "Firefox on Linux",
      location: "Unknown",
    },
    {
      id: "auth-005",
      timestamp: "2024-10-24 10:30:00",
      status: "success",
      matchScore: 96,
      device: "Chrome on Windows",
      location: "New York, NY",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-sm text-slate-600 font-semibold mb-2">Total Attempts</p>
          <p className="text-3xl font-bold text-slate-900">{attempts.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-600 font-semibold mb-2">Successful</p>
          <p className="text-3xl font-bold text-green-600">{attempts.filter((a) => a.status === "success").length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-slate-600 font-semibold mb-2">Failed</p>
          <p className="text-3xl font-bold text-red-600">{attempts.filter((a) => a.status === "failed").length}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Match Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Device</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm text-slate-900">{attempt.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {attempt.status === "success" ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">Success</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-semibold text-red-600">Failed</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${attempt.status === "success" ? "bg-green-600" : "bg-red-600"}`}
                          style={{ width: `${attempt.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{attempt.matchScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{attempt.device}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{attempt.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
