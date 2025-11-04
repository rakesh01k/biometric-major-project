"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"

export default function DashboardPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    return <div className="text-center text-slate-600">Please log in to continue</div>
  }

  return user.isAdmin ? <AdminDashboard user={user} /> : <StudentDashboard user={user} />
}
