"use client"

import { useState } from "react"
import { Search, UserPlus, MessageCircle, Eye, X, Check, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddContactModal } from "./add-contact-modal"
import { useRouter } from "next/navigation"

type TabType = "contacts" | "pending" | "invitations"

interface Contact {
  id: string
  name: string
  username: string
  avatar?: string
  phone: string
  roi: number
  status: "approved"
}

interface PendingRequest {
  id: string
  phone: string
  name?: string
  username?: string
  avatar?: string
  message?: string
  sentAt: string
  userExists: boolean
}

interface Invitation {
  id: string
  from: {
    id: string
    name: string
    username: string
    avatar?: string
    roi: number
  }
  message?: string
  receivedAt: string
}

// Mock data
const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Chen", username: "@sarahc", avatar: "https://i.pravatar.cc/150?img=5", phone: "+1 (555) 111-1111", roi: 18.2, status: "approved" },
  { id: "2", name: "Mike Johnson", username: "@mikej", avatar: "https://i.pravatar.cc/150?img=12", phone: "+1 (555) 222-2222", roi: 23.5, status: "approved" },
  { id: "3", name: "Alex Rivera", username: "@alexr", avatar: "https://i.pravatar.cc/150?img=33", phone: "+1 (555) 333-3333", roi: 31.8, status: "approved" },
]

const mockPending: PendingRequest[] = [
  { id: "1", phone: "+1 (555) 999-8888", sentAt: "2 days ago", userExists: false },
  { id: "2", name: "John Doe", username: "@johnd", avatar: "https://i.pravatar.cc/150?img=15", phone: "+1 (555) 444-4444", message: "Hey! Let's connect", sentAt: "1 hour ago", userExists: true },
]

const mockInvitations: Invitation[] = [
  { id: "1", from: { id: "4", name: "Emma Wilson", username: "@emmaw", avatar: "https://i.pravatar.cc/150?img=20", roi: 28.1 }, message: "Let's share betting tips!", receivedAt: "2 hours ago" },
  { id: "2", from: { id: "5", name: "David Lee", username: "@davidl", avatar: "https://i.pravatar.cc/150?img=25", roi: 15.3 }, receivedAt: "1 day ago" },
]

export function ContactsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("contacts")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [contacts, setContacts] = useState(mockContacts)
  const [pending, setPending] = useState(mockPending)
  const [invitations, setInvitations] = useState(mockInvitations)

  const handleApprove = async (invitationId: string) => {
    // TODO: API call to approve
    setInvitations(invitations.filter(inv => inv.id !== invitationId))
    // TODO: Show success toast
  }

  const handleDecline = async (invitationId: string) => {
    // TODO: API call to decline
    setInvitations(invitations.filter(inv => inv.id !== invitationId))
  }

  const handleCancelRequest = async (requestId: string) => {
    // TODO: API call to cancel
    setPending(pending.filter(req => req.id !== requestId))
  }

  const handleAddContact = (phone: string) => {
    // TODO: Refresh pending list from API
    console.log("Contact added:", phone)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-white">Contacts</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-white hover:bg-white/90 text-primary font-bold"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-background sticky top-0 z-10">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === "contacts"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Contacts ({contacts.length})
          {activeTab === "contacts" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === "pending"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending ({pending.length})
          {activeTab === "pending" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === "invitations"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Invitations ({invitations.length})
          {activeTab === "invitations" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
          {invitations.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? "No contacts found" : "No contacts yet"}
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/30">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {contact.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.username}</p>
                      <p className="text-xs text-success font-semibold">ROI: +{contact.roi}%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="rounded-full">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/profile/${contact.username.replace("@", "")}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {/* Pending Tab */}
        {activeTab === "pending" && (
          <>
            {pending.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending requests</p>
              </div>
            ) : (
              pending.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {request.userExists ? (
                      <Avatar className="h-12 w-12 border-2 border-amber-500/30">
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback className="bg-amber-500 text-white font-bold">
                          {request.name?.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-foreground">
                        {request.userExists ? request.name : request.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">{request.sentAt}</p>
                      {request.userExists ? (
                        <Badge variant="secondary" className="mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending approval
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mt-1">
                          SMS invite sent
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {/* Invitations Tab */}
        {activeTab === "invitations" && (
          <>
            {invitations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending invitations</p>
              </div>
            ) : (
              invitations.map((invitation) => (
                <Card key={invitation.id} className="p-4 border-2 border-primary/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/30">
                      <AvatarImage src={invitation.from.avatar} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {invitation.from.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{invitation.from.name}</p>
                      <p className="text-sm text-muted-foreground">{invitation.from.username}</p>
                      <p className="text-xs text-success font-semibold">ROI: +{invitation.from.roi}%</p>
                      <p className="text-xs text-muted-foreground mt-1">{invitation.receivedAt}</p>
                    </div>
                  </div>
                  {invitation.message && (
                    <p className="text-sm text-muted-foreground italic mb-3 px-3 py-2 bg-muted/50 rounded-lg">
                      "{invitation.message}"
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary"
                      onClick={() => handleApprove(invitation.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDecline(invitation.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddContact}
        />
      )}
    </div>
  )
}

