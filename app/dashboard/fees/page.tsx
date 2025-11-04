"use client"

import { DollarSign, CheckCircle, AlertCircle } from "@/components/icons"

export default function FeesPage() {
  const feeBreakdown = [
    { item: "Tuition Fee", amount: 5000, status: "Paid", date: "2025-09-15" },
    { item: "Library Fee", amount: 200, status: "Paid", date: "2025-09-15" },
    { item: "Lab Fee", amount: 300, status: "Paid", date: "2025-09-15" },
    { item: "Technology Fee", amount: 150, status: "Pending", date: "2025-11-30" },
    { item: "Sports Fee", amount: 100, status: "Pending", date: "2025-11-30" },
  ]

  const totalAmount = feeBreakdown.reduce((sum, fee) => sum + fee.amount, 0)
  const paidAmount = feeBreakdown.filter((f) => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0)
  const pendingAmount = totalAmount - paidAmount

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Fee Management</h1>
        <p className="text-slate-600">View and manage your tuition and fees</p>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Amount Due</p>
              <p className="text-3xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-100">
              <DollarSign className="w-6 h-6 text-slate-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">For current semester</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Amount Paid</p>
              <p className="text-3xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Successfully processed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Amount Pending</p>
              <p className="text-3xl font-bold text-amber-600">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Due by Nov 30, 2025</p>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Fee Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fee Item</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {feeBreakdown.map((fee, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{fee.item}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${fee.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        fee.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fee.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left">
            <p className="font-semibold text-slate-900">Pay Online</p>
            <p className="text-sm text-slate-600">Credit/Debit Card or Bank Transfer</p>
          </button>
          <button className="p-4 border-2 border-teal-200 rounded-lg hover:bg-teal-50 transition-colors text-left">
            <p className="font-semibold text-slate-900">Download Invoice</p>
            <p className="text-sm text-slate-600">Get your fee invoice as PDF</p>
          </button>
        </div>
      </div>
    </div>
  )
}
