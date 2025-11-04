import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 overflow-auto">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">Welcome back to your university portal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <span className="text-sm text-slate-600">User ID:</span>
                <span className="font-semibold text-slate-900">
                  {typeof window !== "undefined"
                    ? localStorage.getItem("biosecure_session")
                      ? JSON.parse(localStorage.getItem("biosecure_session") || "{}").user?.userId || "N/A"
                      : "N/A"
                    : "N/A"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
