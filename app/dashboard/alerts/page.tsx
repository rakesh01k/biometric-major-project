"use client"

import { AlertCircle, AlertTriangle, CheckCircle, Info, Trash2 } from "@/components/icons"
import { useState } from "react"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Database Backup Failed",
      description: "The scheduled backup failed due to storage limitations",
      severity: "critical",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "High Memory Usage",
      description: "System memory usage is at 88%. Consider optimizing resources",
      severity: "warning",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "API Rate Limit Warning",
      description: "API requests are approaching rate limits",
      severity: "warning",
      time: "30 minutes ago",
    },
    {
      id: 4,
      title: "Security Update Available",
      description: "A new security patch is available for the system",
      severity: "info",
      time: "1 day ago",
    },
    {
      id: 5,
      title: "System Maintenance Completed",
      description: "Weekly maintenance has been completed successfully",
      severity: "success",
      time: "3 days ago",
    },
  ])

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5" />
      case "warning":
        return <AlertTriangle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
      case "success":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  const getTextColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-amber-600"
      case "info":
        return "text-blue-600"
      case "success":
        return "text-green-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Alerts</h1>
        <p className="text-slate-600 mt-1">Monitor and manage system notifications and warnings</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: 1, color: "bg-red-100 text-red-700" },
          { label: "Warnings", count: 2, color: "bg-amber-100 text-amber-700" },
          { label: "Info", count: 1, color: "bg-blue-100 text-blue-700" },
          { label: "Success", count: 1, color: "bg-green-100 text-green-700" },
        ].map((item, i) => (
          <div key={i} className={`rounded-lg p-4 ${item.color} font-semibold`}>
            {item.label}: {item.count}
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`rounded-lg border-2 p-4 flex items-start gap-4 ${getColor(alert.severity)}`}>
            <div className={`mt-1 flex-shrink-0 ${getTextColor(alert.severity)}`}>{getIcon(alert.severity)}</div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{alert.title}</h3>
              <p className="text-slate-700 text-sm mt-1">{alert.description}</p>
              <p className="text-xs text-slate-600 mt-2">{alert.time}</p>
            </div>
            <button
              onClick={() => handleDismiss(alert.id)}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 flex-shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-slate-600">No alerts at the moment. Everything is running smoothly!</p>
        </div>
      )}
    </div>
  )
}
