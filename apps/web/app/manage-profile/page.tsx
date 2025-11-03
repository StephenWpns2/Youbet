"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  LogOut,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  X,
  Camera
} from "lucide-react"
import { useUser } from "@/contexts/user-context"

type PageState = "view" | "edit" | "deleteConfirm"

export default function ManageProfilePage() {
  const router = useRouter()
  const { user, updateUser, setUser } = useUser()
  const [pageState, setPageState] = useState<PageState>("view")
  const [editedName, setEditedName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [editedPhone, setEditedPhone] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize form values when user data is available
  useEffect(() => {
    if (user) {
      setEditedName(user.name || "")
      setEditedEmail(user.email || "")
      setEditedPhone(user.phone || "")
      setIsLoading(false)
    } else {
      // Give it a moment to load user from localStorage
      const timer = setTimeout(() => {
        if (!user) {
          router.push("/")
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [user, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-semibold">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const handleSaveProfile = () => {
    updateUser({
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
    })
    setPageState("view")
  }

  const handleSignOut = () => {
    localStorage.clear()
    setUser(null)
    window.location.reload()
  }

  const handleDeleteAccount = () => {
    localStorage.clear()
    setUser(null)
    window.location.reload()
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'
  const fullJoinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary px-4 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-black text-white">Manage Profile</h1>
        </div>
      </header>

      {/* VIEW STATE */}
      {pageState === "view" && (
        <div className="p-4 space-y-4 animate-in fade-in duration-500">
          {/* Profile Card */}
          <Card className="rounded-3xl p-6 shadow-lg">
            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary shadow-xl">
                  <AvatarImage src={user.avatar || "/diverse-user-avatars.png"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-5xl text-white font-black">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary rounded-full p-3 shadow-lg hover:scale-110 transition-transform border-4 border-white">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              <h2 className="text-3xl font-black text-foreground mt-4">{user.name}</h2>
              <p className="text-sm text-muted-foreground">Member since {joinDate}</p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <Card className="p-4 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">Email Address</p>
                </div>
                <p className="text-sm text-muted-foreground pl-8">{user.email}</p>
              </Card>

              <Card className="p-4 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">Phone Number</p>
                </div>
                <p className="text-sm text-muted-foreground pl-8">{user.phone}</p>
              </Card>

              <Card className="p-4 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">Joined On</p>
                </div>
                <p className="text-sm text-muted-foreground pl-8">{fullJoinDate}</p>
              </Card>
            </div>

            {/* Stats Display */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <Card className="p-3 rounded-xl text-center bg-primary/5 border border-primary/20">
                <p className="text-2xl font-black text-primary">{user.totalBets}</p>
                <p className="text-xs text-muted-foreground">Total Bets</p>
              </Card>
              <Card className="p-3 rounded-xl text-center bg-secondary/5 border border-secondary/20">
                <p className="text-2xl font-black text-secondary">{user.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </Card>
              <Card className="p-3 rounded-xl text-center bg-accent/5 border border-accent/20">
                <p className="text-2xl font-black text-accent">+{user.roi}%</p>
                <p className="text-xs text-muted-foreground">ROI</p>
              </Card>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => {
                setEditedName(user.name)
                setEditedEmail(user.email)
                setEditedPhone(user.phone)
                setPageState("edit")
              }}
              className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-black rounded-xl shadow-lg"
            >
              <Edit className="h-5 w-5 mr-2" /> Edit Profile
            </Button>

            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="w-full h-12 rounded-xl font-semibold border-2"
            >
              <LogOut className="h-5 w-5 mr-2" /> Sign Out
            </Button>

            <Button 
              onClick={() => setPageState("deleteConfirm")}
              variant="destructive" 
              className="w-full h-12 rounded-xl font-semibold"
            >
              <Trash2 className="h-5 w-5 mr-2" /> Delete Account
            </Button>
          </div>
        </div>
      )}

      {/* EDIT STATE */}
      {pageState === "edit" && (
        <div className="p-4 animate-in fade-in duration-500">
          <Card className="rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-black text-foreground mb-6 text-center">Edit Profile</h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Full Name
                </Label>
                <Input
                  id="edit-name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-12 border-2 border-neutral-200 focus:border-primary rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> Email Address
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="h-12 border-2 border-neutral-200 focus:border-primary rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> Phone Number
                </Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="h-12 border-2 border-neutral-200 focus:border-primary rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <Button 
                onClick={handleSaveProfile}
                className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-black rounded-xl shadow-lg"
              >
                Save Changes
              </Button>
              <Button 
                onClick={() => setPageState("view")}
                variant="outline" 
                className="w-full h-12 rounded-xl font-semibold border-2"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRM STATE */}
      {pageState === "deleteConfirm" && (
        <div className="p-4 animate-in fade-in duration-500">
          <Card className="rounded-3xl p-8 shadow-lg">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-destructive/10 rounded-full p-6">
                <AlertTriangle className="h-20 w-20 text-destructive animate-in zoom-in duration-300" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-foreground mb-3">Delete Account?</h2>
                <p className="text-muted-foreground mb-6">This action cannot be undone</p>
              </div>

              <Card className="bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-6 w-full">
                <p className="text-sm text-muted-foreground text-left mb-4 font-semibold">
                  Deleting your account will permanently remove:
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground text-left">
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
              </Card>

              <div className="space-y-3 w-full pt-4">
                <Button 
                  onClick={handleDeleteAccount}
                  className="w-full h-14 bg-destructive hover:bg-destructive/90 text-white font-black rounded-xl shadow-lg"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Yes, Delete My Account
                </Button>
                <Button 
                  onClick={() => setPageState("view")}
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-semibold border-2"
                >
                  Cancel, Keep My Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

