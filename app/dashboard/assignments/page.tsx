"use client"

import { CheckSquare, Clock, AlertCircle, FileText } from "@/components/icons"

export default function AssignmentsPage() {
  const assignments = [
    {
      id: 1,
      title: "Data Structures Implementation",
      course: "CS-301",
      dueDate: "2025-11-10",
      status: "Submitted",
      grade: "A-",
      color: "from-green-500 to-green-600",
    },
    {
      id: 2,
      title: "React Component Design",
      course: "CS-205",
      dueDate: "2025-11-08",
      status: "Pending",
      grade: null,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 3,
      title: "Database Query Optimization",
      course: "CS-310",
      dueDate: "2025-11-15",
      status: "In Progress",
      grade: null,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 4,
      title: "AI Model Training Project",
      course: "CS-401",
      dueDate: "2025-11-20",
      status: "Not Started",
      grade: null,
      color: "from-red-500 to-red-600",
    },
    {
      id: 5,
      title: "System Design Document",
      course: "CS-350",
      dueDate: "2025-11-05",
      status: "Submitted",
      grade: "A",
      color: "from-green-500 to-green-600",
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "Submitted":
        return <CheckSquare className="w-5 h-5 text-green-600" />
      case "Pending":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case "In Progress":
        return <Clock className="w-5 h-5 text-amber-600" />
      default:
        return <FileText className="w-5 h-5 text-slate-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-orange-100 text-orange-700"
      case "In Progress":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Assignments</h1>
        <p className="text-slate-600">Track and submit your coursework</p>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${assignment.color}`}>
                    {getStatusIcon(assignment.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                    <p className="text-sm text-slate-600">{assignment.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Due: {assignment.dueDate}</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>

              {/* Right Content */}
              <div className="text-right">
                {assignment.grade ? (
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Grade</p>
                    <p className="text-2xl font-bold text-green-600">{assignment.grade}</p>
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Total Assignments</p>
          <p className="text-3xl font-bold text-slate-900">5</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Submitted</p>
          <p className="text-3xl font-bold text-green-600">2</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">In Progress</p>
          <p className="text-3xl font-bold text-amber-600">2</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Not Started</p>
          <p className="text-3xl font-bold text-red-600">1</p>
        </div>
      </div>
    </div>
  )
}
