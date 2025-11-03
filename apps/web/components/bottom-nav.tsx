"use client"

import { Home, Compass, MessageCircle, User, BarChart3, Users } from "lucide-react"

interface BottomNavProps {
  activeTab: "home" | "discover" | "chat" | "profile" | "dashboard" | "contacts"
  onTabChange: (tab: "home" | "discover" | "chat" | "profile" | "dashboard" | "contacts") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "contacts" as const, icon: Users, label: "Contacts" },
    { id: "chat" as const, icon: MessageCircle, label: "Chat" },
    { id: "profile" as const, icon: User, label: "Profile" },
    { id: "dashboard" as const, icon: BarChart3, label: "Stats" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#FFB84D]/20 bg-white shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? "text-[#FFB84D]" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
