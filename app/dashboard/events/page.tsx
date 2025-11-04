"use client"

import { Calendar, MapPin, Users, Clock } from "@/components/icons"

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Midterm Exams - Computer Science",
      date: "2025-11-15",
      time: "09:00 AM - 12:00 PM",
      location: "Building A, Room 101",
      type: "Exam",
      attendees: 45,
      color: "from-red-500 to-red-600",
    },
    {
      id: 2,
      title: "Guest Lecture: AI in Industry",
      date: "2025-11-12",
      time: "02:00 PM - 03:30 PM",
      location: "Auditorium",
      type: "Lecture",
      attendees: 200,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 3,
      title: "Project Submission Deadline",
      date: "2025-11-10",
      time: "11:59 PM",
      location: "Online",
      type: "Deadline",
      attendees: null,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 4,
      title: "University Sports Day",
      date: "2025-11-18",
      time: "08:00 AM - 05:00 PM",
      location: "Sports Complex",
      type: "Event",
      attendees: 500,
      color: "from-teal-500 to-teal-600",
    },
    {
      id: 5,
      title: "Career Fair 2025",
      date: "2025-11-22",
      time: "10:00 AM - 04:00 PM",
      location: "Convention Center",
      type: "Career",
      attendees: 1000,
      color: "from-green-500 to-green-600",
    },
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case "Exam":
        return "bg-red-100 text-red-700"
      case "Lecture":
        return "bg-orange-100 text-orange-700"
      case "Deadline":
        return "bg-amber-100 text-amber-700"
      case "Event":
        return "bg-teal-100 text-teal-700"
      case "Career":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Events & Deadlines</h1>
        <p className="text-slate-600">Stay updated with important university events</p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Accent Bar */}
              <div className={`w-full md:w-1 bg-gradient-to-b ${event.color}`}></div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{event.title}</h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)}`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm whitespace-nowrap">
                    Add to Calendar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.attendees && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-teal-500" />
                    <span>{event.attendees} people attending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <p className="text-sm font-semibold text-orange-900">November 10</p>
            <p className="text-xs text-orange-700 mt-1">Project Submission Deadline</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
            <p className="text-sm font-semibold text-red-900">November 15</p>
            <p className="text-xs text-red-700 mt-1">Midterm Exams Begin</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
            <p className="text-sm font-semibold text-teal-900">November 18</p>
            <p className="text-xs text-teal-700 mt-1">University Sports Day</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-900">November 22</p>
            <p className="text-xs text-green-700 mt-1">Career Fair 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
