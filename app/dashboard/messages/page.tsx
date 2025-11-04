"use client"

import { MessageSquare, Send, Search, Pin } from "@/components/icons"
import { useState } from "react"

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null)

  const conversations = [
    {
      id: 1,
      name: "Prof. Robert Johnson",
      role: "Instructor",
      lastMessage: "Your assignment has been graded. Great work!",
      timestamp: "2 hours ago",
      unread: true,
      avatar: "RJ",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 2,
      name: "Admin Support",
      role: "University",
      lastMessage: "Your fee payment has been confirmed",
      timestamp: "1 day ago",
      unread: false,
      avatar: "AS",
      color: "from-teal-400 to-teal-600",
    },
    {
      id: 3,
      name: "Library Services",
      role: "Department",
      lastMessage: "Your book reservation is ready for pickup",
      timestamp: "3 days ago",
      unread: false,
      avatar: "LS",
      color: "from-amber-400 to-amber-600",
    },
    {
      id: 4,
      name: "Study Group - CS301",
      role: "Group Chat",
      lastMessage: "Let's meet tomorrow at 3 PM in the library",
      timestamp: "5 days ago",
      unread: false,
      avatar: "SG",
      color: "from-green-400 to-green-600",
    },
    {
      id: 5,
      name: "Career Services",
      role: "Department",
      lastMessage: "Internship opportunities available for CS students",
      timestamp: "1 week ago",
      unread: false,
      avatar: "CS",
      color: "from-purple-400 to-purple-600",
    },
  ]

  const selectedConversation = conversations.find((c) => c.id === selectedMessage)

  const messages = [
    { id: 1, sender: "Prof. Robert Johnson", text: "Hi John, I've reviewed your assignment.", time: "10:30 AM" },
    { id: 2, sender: "You", text: "Thank you Professor! I worked hard on it.", time: "10:45 AM" },
    { id: 3, sender: "Prof. Robert Johnson", text: "Your assignment has been graded. Great work!", time: "11:00 AM" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
        <p className="text-slate-600">Communicate with instructors and university staff</p>
      </div>

      {/* Messages Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedMessage(conversation.id)}
                className={`w-full p-4 border-b border-slate-100 text-left hover:bg-slate-50 transition-colors ${
                  selectedMessage === conversation.id ? "bg-orange-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${conversation.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-slate-900 ${conversation.unread ? "font-bold" : ""}`}>
                        {conversation.name}
                      </p>
                      {conversation.unread && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>}
                    </div>
                    <p className="text-xs text-slate-600 mb-1">{conversation.role}</p>
                    <p className="text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-slate-500 mt-1">{conversation.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hidden lg:flex">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedConversation.color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{selectedConversation.name}</p>
                    <p className="text-xs text-slate-600">{selectedConversation.role}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Pin className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === "You" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "You" ? "text-orange-100" : "text-slate-600"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
