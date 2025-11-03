"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  User, 
  Settings, 
  LogOut, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  X,
  AlertTriangle
} from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ProfileMenuProps {
  onClose: () => void
  onSignOut: () => void
}

export function ProfileMenu({ onClose, onSignOut }: ProfileMenuProps) {
  const { user, updateUser, setUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedEmail, setEditedEmail] = useState(user?.email || "")
  const [editedPhone, setEditedPhone] = useState(user?.phone || "")

  const handleSaveProfile = () => {
    updateUser({
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
    })
    setIsEditing(false)
  }

  const handleDeleteAccount = () => {
    // Clear all user data
    localStorage.clear()
    setUser(null)
    onClose()
    // This will trigger the app to go back to sign-in
    window.location.reload()
  }

  const handleSignOut = () => {
    // Clear onboarding step to go back to sign-in
    localStorage.removeItem('onboarding-step')
    setUser(null)
    onSignOut()
    onClose()
  }

  if (!user) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end p-4 pt-20 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Card */}
      <Card className="relative w-full max-w-sm rounded-2xl shadow-2xl border-2 border-border animate-in slide-in-from-right duration-300 bg-background">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {!showDeleteConfirm ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                    {user.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white">{user.name}</h2>
                  <p className="text-sm text-white/80">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {isEditing ? (
                <>
                  {/* Edit Mode */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name" className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </Label>
                      <Input
                        id="edit-name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email" className="text-sm font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone" className="text-sm font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Phone
                      </Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setEditedName(user.name || "")
                        setEditedEmail(user.email || "")
                        setEditedPhone(user.phone || "")
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-semibold text-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-semibold text-foreground">{user.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats (if available) */}
                  {(user.totalBets || user.winRate || user.roi) && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-3 rounded-xl bg-primary/10">
                        <p className="text-xl font-black text-primary">{user.totalBets || 0}</p>
                        <p className="text-xs text-muted-foreground">Bets</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-secondary/10">
                        <p className="text-xl font-black text-secondary">{user.winRate || 0}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-accent/10">
                        <p className="text-xl font-black text-accent">+{user.roi || 0}%</p>
                        <p className="text-xs text-muted-foreground">ROI</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full justify-start gap-3 h-12"
                    >
                      <Edit className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Edit Profile</span>
                    </Button>

                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full justify-start gap-3 h-12"
                    >
                      <LogOut className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">Sign Out</span>
                    </Button>

                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="font-semibold">Delete Account</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* Delete Confirmation */
          <div className="p-8 space-y-6">
            <div className="flex justify-center">
              <div className="bg-destructive/10 rounded-full p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-foreground">Delete Account?</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All your data, bets, and stats will be permanently deleted.
              </p>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
              <p className="text-sm text-destructive font-semibold">
                You will lose:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• All betting history and stats</li>
                <li>• Your followers and following list</li>
                <li>• All saved picks and predictions</li>
                <li>• Your profile and achievements</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleDeleteAccount}
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white font-bold"
              >
                Yes, Delete My Account
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="w-full h-12 font-semibold"
              >
                Cancel, Keep My Account
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

