"use client"

import { Mail, Phone, MapPin, Calendar, Edit2, Camera, Award, BookOpen, Users } from "@/components/icons"
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const userProfile = {
    name: currentUser?.name || "John Doe",
    userId: currentUser?.userId || "USR-1001",
    studentId: "STU-2025-001",
    email: currentUser?.email || "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "September 2023",
    major: "Computer Science",
    gpa: "3.85",
    credits: "87/120",
    bio: "Passionate about software development and AI. Active member of the coding club.",
    isAdmin: currentUser?.isAdmin || false,
  }

  const achievements = [
    { icon: Award, label: "Dean's List", value: "2 times", color: "from-orange-500 to-orange-600" },
    { icon: BookOpen, label: "Courses Completed", value: "15", color: "from-teal-500 to-teal-600" },
    { icon: Users, label: "Study Groups", value: "5", color: "from-amber-500 to-amber-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Profile Banner Section */}
      <div className="relative">
        {/* Banner Background */}
        <div className="h-48 bg-gradient-to-r from-orange-500 via-orange-400 to-teal-500 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-8 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          </div>

          {/* Edit Banner Button */}
          <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Card Overlay */}
        <div className="relative -mt-24 mx-4 md:mx-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                    {currentUser?.name?.substring(0, 2).toUpperCase() || "JD"}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{userProfile.name}</h1>
                    <p className="text-slate-600 font-medium">{userProfile.major}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-slate-500">ID: {userProfile.userId}</p>
                      {userProfile.isAdmin && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">ADMIN</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="text-sm font-medium text-slate-900">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{userProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm font-medium text-slate-900">{userProfile.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-600">Joined</p>
                      <p className="text-sm font-medium text-slate-900">{userProfile.joinDate}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-700">{userProfile.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Academic Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Current GPA</span>
                <span className="text-2xl font-bold text-orange-600">{userProfile.gpa}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[96%] bg-gradient-to-r from-orange-500 to-orange-600"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Credits Completed</span>
                <span className="text-lg font-bold text-teal-600">{userProfile.credits}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-gradient-to-r from-teal-500 to-teal-600"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Status:</span> Good Standing
              </p>
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-semibold text-slate-900">Next Semester:</span> Spring 2026
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${achievement.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{achievement.label}</p>
                    <p className="text-xs text-slate-600">{achievement.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Account Security</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Change Password
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Active Sessions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Preferences</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Email Notifications
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Privacy Settings
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Theme & Display
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Support</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Help Center
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Contact Support
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
