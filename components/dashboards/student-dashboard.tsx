"use client"

import { LayoutGrid, TrendingUp, AlertCircle, CheckCircle } from "@/components/icons"
import type { User } from "@/lib/auth"

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const stats = [
    {
      label: "Active Courses",
      value: "5",
      icon: LayoutGrid,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Pending Assignments",
      value: "3",
      icon: AlertCircle,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "GPA",
      value: "3.85",
      icon: TrendingUp,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      label: "Fees Status",
      value: "Paid",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-teal-500 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h2>
        <p className="text-orange-50">Student ID: {user.userId} • Here's your academic overview for this semester</p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-slate-900">Midterm Exams</p>
                <p className="text-sm text-slate-600">November 15-20, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-slate-900">Project Submission</p>
                <p className="text-sm text-slate-600">November 10, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-slate-900">Fee Payment Deadline</p>
                <p className="text-sm text-slate-600">November 30, 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Messages</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                PR
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">Prof. Robert</p>
                <p className="text-sm text-slate-600 truncate">Your assignment has been graded</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">Admin</p>
                <p className="text-sm text-slate-600 truncate">New course materials available</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 font-bold text-sm flex-shrink-0">
                LB
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">Library</p>
                <p className="text-sm text-slate-600 truncate">Book reservation confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
