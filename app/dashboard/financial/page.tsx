"use client"

import { DollarSign, TrendingUp, AlertCircle, Check } from "@/components/icons"

export default function FinancialPage() {
  const financialData = [
    { label: "Total Revenue", value: "$1,245,000", change: "+12.5%", icon: DollarSign, color: "green" },
    { label: "Pending Payments", value: "$45,000", change: "+5.2%", icon: AlertCircle, color: "amber" },
    { label: "Collection Rate", value: "94.5%", change: "+2.3%", icon: TrendingUp, color: "blue" },
    { label: "Verified Payments", value: "98.2%", change: "+0.8%", icon: Check, color: "green" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Financial Management</h1>
        <p className="text-slate-600 mt-1">Track revenue, payments, and financial metrics</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialData.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    item.color === "green"
                      ? "bg-green-100 text-green-600"
                      : item.color === "amber"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-sm font-semibold ${item.color === "green" ? "text-green-600" : "text-amber-600"}`}
                >
                  {item.change}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            </div>
          )
        })}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { date: "Nov 3, 2025", amount: "$5,000", student: "John Doe", status: "Completed" },
            { date: "Nov 2, 2025", amount: "$3,500", student: "Jane Smith", status: "Completed" },
            { date: "Nov 2, 2025", amount: "$2,200", student: "Mike Johnson", status: "Pending" },
            { date: "Nov 1, 2025", amount: "$4,800", student: "Sarah Williams", status: "Completed" },
          ].map((transaction, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0">
              <div>
                <p className="font-semibold text-slate-900">{transaction.student}</p>
                <p className="text-sm text-slate-600">{transaction.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-900">{transaction.amount}</span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    transaction.status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
