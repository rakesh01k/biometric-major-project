"use client"

import { BookOpen, Clock, Award } from "@/components/icons"

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      name: "Advanced Data Structures",
      code: "CS-301",
      instructor: "Dr. Sarah Johnson",
      progress: 75,
      credits: 3,
      status: "In Progress",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 2,
      name: "Web Development Fundamentals",
      code: "CS-205",
      instructor: "Prof. Michael Chen",
      progress: 90,
      credits: 4,
      status: "In Progress",
      color: "from-teal-500 to-teal-600",
    },
    {
      id: 3,
      name: "Database Management Systems",
      code: "CS-310",
      instructor: "Dr. Emily Rodriguez",
      progress: 60,
      credits: 3,
      status: "In Progress",
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 4,
      name: "Artificial Intelligence",
      code: "CS-401",
      instructor: "Prof. James Wilson",
      progress: 45,
      credits: 4,
      status: "In Progress",
      color: "from-green-500 to-green-600",
    },
    {
      id: 5,
      name: "Software Engineering",
      code: "CS-350",
      instructor: "Dr. Lisa Anderson",
      progress: 85,
      credits: 3,
      status: "In Progress",
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Courses</h1>
        <p className="text-slate-600">Manage and track your enrolled courses</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer"
          >
            {/* Course Header */}
            <div className={`h-24 bg-gradient-to-r ${course.color} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <div>
                  <p className="text-white/80 text-sm font-medium">{course.code}</p>
                  <p className="text-white font-bold text-lg">{course.credits} Credits</p>
                </div>
                <BookOpen className="w-8 h-8 text-white/60 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{course.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{course.instructor}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Progress</span>
                  <span className="text-xs font-bold text-slate-900">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} transition-all duration-300`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {course.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-teal-100">
              <Award className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Credits</p>
              <p className="text-3xl font-bold text-slate-900">17</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Avg. Progress</p>
              <p className="text-3xl font-bold text-slate-900">71%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
