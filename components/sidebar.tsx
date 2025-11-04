"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  DollarSign,
  CheckSquare,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Fingerprint,
  Users,
  TrendingUp,
  AlertCircle,
} from "@/components/icons"
import { logout, getCurrentUser, type User } from "@/lib/auth"

export function Sidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const studentNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
    { icon: DollarSign, label: "Fees", href: "/dashboard/fees" },
    { icon: CheckSquare, label: "Assignments", href: "/dashboard/assignments" },
    { icon: Calendar, label: "Events", href: "/dashboard/events" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  ]

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Manage Students", href: "/dashboard/students" },
    { icon: BookOpen, label: "Manage Courses", href: "/dashboard/courses" },
    { icon: DollarSign, label: "Financial", href: "/dashboard/financial" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
    { icon: AlertCircle, label: "System Alerts", href: "/dashboard/alerts" },
  ]

  const navItems = user?.isAdmin ? adminNavItems : studentNavItems
  const bottomItems = [{ icon: Settings, label: "Settings", href: "/dashboard/settings" }]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 ${
          user?.isAdmin
            ? "bg-gradient-to-b from-slate-900 to-slate-800"
            : "bg-gradient-to-b from-slate-900 to-slate-800"
        } text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                user?.isAdmin
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : "bg-gradient-to-br from-orange-500 to-orange-600"
              }`}
            >
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
            <div>
              <div
                className={`text-lg font-bold bg-clip-text text-transparent ${
                  user?.isAdmin
                    ? "bg-gradient-to-r from-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-orange-400 to-teal-400"
                }`}
              >
                BioSecure
              </div>
              <div className="text-xs text-slate-400">{user?.isAdmin ? "Admin Panel" : "University"}</div>
            </div>
          </Link>
        </div>

        {/* User Role Badge */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-700">
            <div
              className={`text-xs font-bold px-3 py-1 rounded-full text-center ${
                user.isAdmin ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"
              }`}
            >
              {user.isAdmin ? "ADMINISTRATOR" : "STUDENT"}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-orange-500/20 hover:text-orange-400 transition-all duration-200 group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Items */}
        <div className="px-4 py-4 border-t border-slate-700 space-y-2">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-all duration-200 group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={() => {
              setIsOpen(false)
              handleLogout()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
