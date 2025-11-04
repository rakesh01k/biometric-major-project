"use client"

import { Users, BookOpen, DollarSign, AlertCircle, TrendingUp } from "@/components/icons"
import type { User } from "@/lib/auth"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const stats = [
    {
      label: "Total Students",
      value: "2,547",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Courses",
      value: "48",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Revenue",
      value: "$1.2M",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Issues",
      value: "12",
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome, Admin {user.name}!</h2>
        <p className="text-blue-50">Admin ID: {user.userId} • Manage and monitor the entire university system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Student Management</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">New Enrollments</p>
              <span className="font-bold text-blue-600">+156</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">Active Students</p>
              <span className="font-bold text-slate-900">2,547</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">Pending Verification</p>
              <span className="font-bold text-amber-600">8</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              View All Students
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">System Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">System Uptime</p>
              <span className="font-bold text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">API Response Time</p>
              <span className="font-bold text-slate-900">142ms</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">Active Sessions</p>
              <span className="font-bold text-slate-900">324</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              View Analytics
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-slate-900">Financial Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">Total Revenue (This Year)</p>
              <span className="font-bold text-green-600">$1.2M</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">Pending Payments</p>
              <span className="font-bold text-amber-600">$45K</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-slate-700">Collection Rate</p>
              <span className="font-bold text-slate-900">94.5%</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Financial Reports
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-slate-900">System Alerts</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">Database Backup Failed</p>
                <p className="text-xs text-slate-600">Nov 4, 2025 - 02:30 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">High Memory Usage</p>
                <p className="text-xs text-slate-600">Nov 4, 2025 - 10:15 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">API Rate Limit Warning</p>
                <p className="text-xs text-slate-600">Nov 4, 2025 - 11:45 AM</p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
              View All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
