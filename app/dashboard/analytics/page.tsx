"use client"

import { TrendingUp, BarChart3, PieChart, Users } from "@/components/icons"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-600 mt-1">Monitor system performance and user metrics</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Total Users</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">2,547</p>
          <p className="text-sm text-green-600 mt-2">+156 this month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Active Sessions</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">324</p>
          <p className="text-sm text-green-600 mt-2">+12 from last hour</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Avg Response Time</h3>
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">142ms</p>
          <p className="text-sm text-green-600 mt-2">Optimal performance</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">System Uptime</h3>
            <PieChart className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">99.9%</p>
          <p className="text-sm text-green-600 mt-2">Excellent reliability</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">User Engagement</h3>
          <div className="space-y-4">
            {[
              { label: "Page Views", value: "12,456", percentage: 85 },
              { label: "Unique Visitors", value: "8,234", percentage: 72 },
              { label: "Avg Session Duration", value: "8:42", percentage: 65 },
              { label: "Bounce Rate", value: "24.3%", percentage: 30 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Features Used</h3>
          <div className="space-y-3">
            {[
              { feature: "Dashboard", users: "2,145", trend: "↑ 12%" },
              { feature: "Course Management", users: "1,876", trend: "↑ 8%" },
              { feature: "Student Records", users: "1,654", trend: "↑ 5%" },
              { feature: "Financial Reports", users: "934", trend: "↓ 3%" },
              { feature: "Analytics", users: "734", trend: "↑ 15%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                <span className="text-slate-700 font-medium">{item.feature}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{item.users}</span>
                  <span className="text-sm text-green-600 font-semibold">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
