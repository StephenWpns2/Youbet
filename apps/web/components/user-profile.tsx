"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, UserPlus, Wallet, X, LogOut, Trash2, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { FollowersModal } from "./followers-modal"

export function UserProfile() {
  const { user, setUser } = useUser()
  const [activeTab, setActiveTab] = useState<"picks" | "wins" | "following">("picks")
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState<"followers" | "following" | null>(null)

  const stats = [
    { label: "Win Rate", value: `${user?.winRate || 0}%`, color: "text-success" },
    { label: "ROI", value: `+${user?.roi || 0}%`, color: "text-primary" },
    { label: "Total Bets", value: `${user?.totalBets || 0}`, color: "text-foreground" },
    { label: "Streak", value: `${user?.streak || 0}W`, color: "text-secondary" },
  ]

  const handleSignOut = () => {
    // Clear user data
    localStorage.clear()
    setUser(null)
    // Reload to go back to sign-in
    window.location.reload()
  }

  const handleDeleteAccount = () => {
    // Clear all user data
    localStorage.clear()
    setUser(null)
    // Reload to go back to sign-in
    window.location.reload()
  }

  return (
    <div className="min-h-screen pb-6">
      {/* Banner & Avatar */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-4xl text-white font-black">
              {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">{user?.name || "User"}</h2>
        <p className="text-muted-foreground">{user?.email || "@user"}</p>
        
        {/* Followers/Following Count */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => setShowFollowersModal("followers")}
            className="flex items-center gap-1 hover:underline cursor-pointer transition-colors"
          >
            <span className="font-bold text-foreground">234</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </button>
          <span className="text-muted-foreground">•</span>
          <button
            onClick={() => setShowFollowersModal("following")}
            className="flex items-center gap-1 hover:underline cursor-pointer transition-colors"
          >
            <span className="font-bold text-foreground">45</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </button>
        </div>
        
        <p className="mt-2 text-sm text-foreground">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
        </p>
      </div>

      {/* Connect Betting Account - Prominent CTA */}
      <div className="mt-6 px-4">
        <Button 
          onClick={() => setShowConnectModal(true)}
          className="w-full h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        >
          <Wallet className="mr-3 h-6 w-6" strokeWidth={2.5} />
          Connect Betting Account
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3 px-4">
        <Button className="flex-1 bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        <Button variant="outline" className="flex-1">
          <MessageCircle className="mr-2 h-4 w-4" />
          Share Profile
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-4 gap-2 px-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-md">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Account Management Buttons */}
      <div className="mt-6 px-4 space-y-3">
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          className="w-full h-12 rounded-xl font-semibold border-2"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
        <Button 
          onClick={() => setShowDeleteConfirm(true)}
          variant="destructive" 
          className="w-full h-12 rounded-xl font-semibold"
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Delete Account
        </Button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-[#FFB84D]/20 px-4">
        {(["picks", "wins", "following"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-3 text-sm font-bold uppercase transition-colors ${
              activeTab === tab ? "border-b-2 border-[#FFB84D] text-[#FFB84D]" : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Lakers vs Warriors</p>
                <p className="text-sm text-muted-foreground">+150 • $100 stake</p>
              </div>
              <div className="rounded-lg bg-success px-3 py-1">
                <p className="text-sm font-bold text-white">WON</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Connect Betting Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md m-4 p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="text-center space-y-6">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="bg-destructive/10 rounded-full p-6">
                  <AlertTriangle className="h-16 w-16 text-destructive" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl font-black text-foreground mb-2">
                  Delete Account?
                </h2>
                <p className="text-muted-foreground text-base">
                  This action cannot be undone
                </p>
              </div>

              {/* Warning Message */}
              <div className="bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-6 text-left">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Deleting your account will permanently remove:
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>All your betting history and picks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Your followers and following list</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Any saved analyses and comments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Your achievements and statistics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Access to your account forever</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleDeleteAccount}
                  className="w-full h-14 bg-destructive hover:bg-destructive/90 text-white font-black text-base rounded-xl shadow-lg"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Yes, Delete My Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full h-12 rounded-xl font-semibold border-2"
                >
                  Cancel, Keep My Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Followers/Following Modal */}
      {showFollowersModal && (
        <FollowersModal
          type={showFollowersModal}
          userId={user?.id || ""}
          onClose={() => setShowFollowersModal(null)}
        />
      )}
    </div>
  )
}
