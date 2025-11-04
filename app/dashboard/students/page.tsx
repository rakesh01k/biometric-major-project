"use client"

import { Users, Search, Plus, Edit, Trash2 } from "@/components/icons"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [students, setStudents] = useState([
    {
      id: "USR-1001",
      name: "rakeesh",
      email: "rakeshkanama3@gmail.com",
      enrolled: "2025-11-04",
      status: "Active",
    },
    {
      id: "USR-1002",
      name: "rakesh",
      email: "rakeshkanama2@gmail.com",
      enrolled: "2025-11-04",
      status: "Active",
    },
  ])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.includes(searchTerm),
  )

  const handleAddStudent = () => {
    if (formData.name.trim() && formData.email.trim()) {
      const newStudent = {
        id: `USR-${1001 + students.length}`,
        name: formData.name,
        email: formData.email,
        enrolled: new Date().toISOString().split("T")[0],
        status: "Active",
      }
      setStudents([...students, newStudent])
      setFormData({ name: "", email: "" })
      setOpenDialog(false)
    }
  }

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id))
  }

  const handleEditStudent = (id: string) => {
    const student = students.find((s) => s.id === id)
    if (student) {
      setFormData({ name: student.name, email: student.email })
      setOpenDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Students</h1>
          <p className="text-slate-600 mt-1">View and manage all enrolled students</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the student's information to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-900">Name</label>
                <Input
                  placeholder="Student name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900">Email</label>
                <Input
                  placeholder="student@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Enrolled</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{student.id}</td>
                <td className="px-6 py-4 text-slate-700">{student.name}</td>
                <td className="px-6 py-4 text-slate-700">{student.email}</td>
                <td className="px-6 py-4 text-slate-700">{student.enrolled}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <button
                    onClick={() => handleEditStudent(student.id)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No students found matching your search</p>
        </div>
      )}
    </div>
  )
}
