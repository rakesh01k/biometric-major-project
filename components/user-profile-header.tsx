"use client"

import { User, MapPin, Calendar, Badge } from "lucide-react"

interface UserProfileHeaderProps {
  name?: string
  title?: string
  location?: string
  joinDate?: string
  status?: "Active" | "Inactive" | "Pending"
  imageUrl?: string
}

export function UserProfileHeader({
  name = "John Doe",
  title = "Student",
  location = "San Francisco, CA",
  joinDate = "Oct 2024",
  status = "Active",
  imageUrl,
}: UserProfileHeaderProps) {
  const statusColors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-slate-100 text-slate-700",
    Pending: "bg-yellow-100 text-yellow-700",
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
      {/* Header Background */}
      <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600"></div>

      {/* Profile Content */}
      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:gap-6 -mt-16 mb-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center shadow-lg overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-teal-600" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
                <p className="text-lg text-slate-600 font-medium mt-1">{title}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold text-sm w-fit ${statusColors[status]}`}>
                {status}
              </div>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Location</p>
              <p className="text-sm text-slate-900 font-semibold">{location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Joined</p>
              <p className="text-sm text-slate-900 font-semibold">{joinDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Badge className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Verification</p>
              <p className="text-sm text-slate-900 font-semibold">Biometric</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
