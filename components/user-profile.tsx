"use client"

import { User, Mail, Phone, Calendar, Shield, CheckCircle2 } from "lucide-react"

export function UserProfile() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    enrolledDate: "2024-10-15",
    status: "Active",
    fingerprintsEnrolled: 2,
    lastAuthentication: "2024-10-25 14:32:00",
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="lg:col-span-1">
        <div className="card p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">{user.status}</span>
          </div>
          <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 font-semibold">Email Address</p>
              <p className="text-lg text-slate-900 font-semibold">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 font-semibold">Phone Number</p>
              <p className="text-lg text-slate-900 font-semibold">{user.phone}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 font-semibold">Enrollment Date</p>
              <p className="text-lg text-slate-900 font-semibold">{user.enrolledDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6">
            <p className="text-sm text-slate-600 font-semibold mb-2">Fingerprints Enrolled</p>
            <p className="text-3xl font-bold text-teal-600">{user.fingerprintsEnrolled}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-slate-600 font-semibold mb-2">Last Authentication</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-slate-900 font-semibold">Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
