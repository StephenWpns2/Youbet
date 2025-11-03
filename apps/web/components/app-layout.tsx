"use client"

import { useState } from "react"
import { Wallet, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import { ProfileMenu } from "./profile-menu"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useUser()
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <div className="relative min-h-screen">
      {children}

      {/* Connect Betting Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md m-4 p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowConnectModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full p-6 shadow-lg">
                  <Wallet className="h-16 w-16 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl font-black text-foreground mb-2">
                  Connect Betting Account
                </h2>
                <p className="text-muted-foreground text-base">
                  Link your sportsbook account to track bets automatically
                </p>
              </div>

              {/* Coming Soon Badge */}
              <div className="bg-gradient-to-r from-accent/20 to-accent/10 border-2 border-accent/30 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent font-black text-xl">COMING SOON</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We're working on integrations with major sportsbooks to make bet tracking seamless and automatic.
                </p>
              </div>

              {/* Features List */}
              <div className="text-left space-y-3 bg-muted/30 rounded-xl p-4">
                <p className="font-semibold text-foreground text-base">What's coming:</p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>Automatic bet import from sportsbooks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                    <span>Real-time odds tracking & updates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    <span>One-click bet placement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                    <span>Secure bank-level encryption</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => setShowConnectModal(false)}
                  className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-black text-base rounded-xl shadow-lg"
                >
                  Got It!
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConnectModal(false)
                    // Could open a waitlist form
                  }}
                  className="w-full h-12 rounded-xl font-semibold"
                >
                  Notify Me When Ready
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Profile Menu Dropdown */}
      {showProfileMenu && (
        <ProfileMenu 
          onClose={() => setShowProfileMenu(false)}
          onSignOut={() => {
            localStorage.clear()
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}

