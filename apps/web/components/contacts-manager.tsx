"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  UserPlus,
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Star,
  UserX,
  Users,
  Check,
  X,
  Mail,
  ArrowLeft,
} from "lucide-react"
import { useState } from "react"

export interface Contact {
  id: string
  name: string
  handle: string
  avatar: string
  email?: string
  phone?: string
  bio?: string
  isOnline: boolean
  isFavorite: boolean
  mutualFollowers: number
  lastSeen?: string
  isPending?: boolean // For contact requests
  isBlocked?: boolean
}

interface ContactsManagerProps {
  onStartChat: (contactId: string) => void
  onBack?: () => void
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "@sarahc",
    avatar: "/sports-bettor.jpg",
    email: "sarah@example.com",
    bio: "NBA betting expert | 68% win rate",
    isOnline: true,
    isFavorite: true,
    mutualFollowers: 12,
  },
  {
    id: "2",
    name: "Mike Johnson",
    handle: "@mikej",
    avatar: "/abstract-geometric-shapes.png",
    email: "mike@example.com",
    bio: "Soccer analyst",
    isOnline: false,
    isFavorite: false,
    mutualFollowers: 8,
    lastSeen: "2h ago",
  },
  {
    id: "3",
    name: "Alex Thompson",
    handle: "@alexthompson",
    avatar: "/diverse-group-collaborating.png",
    email: "alex@example.com",
    bio: "NFL picks specialist",
    isOnline: true,
    isFavorite: false,
    mutualFollowers: 5,
  },
]

const mockContactRequests: Contact[] = [
  {
    id: "req1",
    name: "Emma Wilson",
    handle: "@emmaw",
    avatar: "/placeholder.svg",
    bio: "Tennis betting enthusiast",
    isOnline: true,
    isFavorite: false,
    mutualFollowers: 3,
    isPending: true,
  },
  {
    id: "req2",
    name: "James Lee",
    handle: "@jameslee",
    avatar: "/placeholder.svg",
    bio: "Basketball analytics",
    isOnline: false,
    isFavorite: false,
    mutualFollowers: 7,
    lastSeen: "5m ago",
    isPending: true,
  },
]

export function ContactsManager({ onStartChat, onBack }: ContactsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [contactRequests, setContactRequests] = useState<Contact[]>(mockContactRequests)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContactHandle, setNewContactHandle] = useState("")
  const [view, setView] = useState<"all" | "favorites" | "requests">("all")

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.handle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesView =
      view === "all" ? true : view === "favorites" ? contact.isFavorite : false
    return matchesSearch && matchesView
  })

  const toggleFavorite = (contactId: string) => {
    setContacts(
      contacts.map((c) =>
        c.id === contactId ? { ...c, isFavorite: !c.isFavorite } : c
      )
    )
  }

  const removeContact = (contactId: string) => {
    if (confirm("Remove this contact?")) {
      setContacts(contacts.filter((c) => c.id !== contactId))
      setSelectedContact(null)
    }
  }

  const acceptContactRequest = (requestId: string) => {
    const request = contactRequests.find((r) => r.id === requestId)
    if (request) {
      setContacts([...contacts, { ...request, isPending: false }])
      setContactRequests(contactRequests.filter((r) => r.id !== requestId))
    }
  }

  const rejectContactRequest = (requestId: string) => {
    setContactRequests(contactRequests.filter((r) => r.id !== requestId))
  }

  const handleAddContact = () => {
    if (newContactHandle.trim()) {
      // In real app, this would send a contact request
      alert(`Contact request sent to ${newContactHandle}`)
      setNewContactHandle("")
      setShowAddContact(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-primary">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-bold text-foreground">Contacts</h1>
          </div>
          <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <UserPlus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="handle">Username or Handle</Label>
                  <Input
                    id="handle"
                    placeholder="@username"
                    value={newContactHandle}
                    onChange={(e) => setNewContactHandle(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <Button onClick={handleAddContact} className="w-full rounded-xl">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Contact Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="rounded-xl pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={view === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("all")}
            className="flex-1 rounded-xl"
          >
            All ({contacts.length})
          </Button>
          <Button
            variant={view === "favorites" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("favorites")}
            className="flex-1 rounded-xl"
          >
            <Star className="mr-1 h-3 w-3" />
            Favorites ({contacts.filter((c) => c.isFavorite).length})
          </Button>
          <Button
            variant={view === "requests" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("requests")}
            className="flex-1 rounded-xl relative"
          >
            Requests
            {contactRequests.length > 0 && (
              <Badge className="ml-1 bg-destructive text-white h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {contactRequests.length}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Contact Requests */}
      {view === "requests" && contactRequests.length > 0 && (
        <div className="border-b bg-card">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Pending Requests ({contactRequests.length})
            </h2>
            {contactRequests.map((request) => (
              <Card key={request.id} className="mb-3 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {request.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.handle}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.mutualFollowers} mutual followers
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="default"
                      onClick={() => acceptContactRequest(request.id)}
                      className="h-9 w-9 rounded-full bg-success hover:bg-success/90"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => rejectContactRequest(request.id)}
                      className="h-9 w-9 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try a different search term"
                : "Add your first contact to start chatting"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddContact(true)} className="rounded-xl">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            )}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors hover:bg-accent"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{contact.name}</p>
                  {contact.isFavorite && <Star className="h-4 w-4 fill-primary text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{contact.handle}</p>
                {contact.bio && (
                  <p className="text-xs text-muted-foreground truncate">{contact.bio}</p>
                )}
                {!contact.isOnline && contact.lastSeen && (
                  <p className="text-xs text-muted-foreground">Last seen {contact.lastSeen}</p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onStartChat(contact.id)
                }}
                className="text-primary hover:bg-primary/10"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Contact Details Dialog */}
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Avatar and Name */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {selectedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedContact.isOnline && (
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-4 border-background bg-success" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground">{selectedContact.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedContact.handle}</p>
                {selectedContact.bio && (
                  <p className="text-sm text-foreground mt-2">{selectedContact.bio}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {selectedContact.mutualFollowers} mutual followers
                  </Badge>
                  {selectedContact.isOnline ? (
                    <Badge className="bg-success text-white text-xs">Online</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {selectedContact.lastSeen || "Offline"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              {(selectedContact.email || selectedContact.phone) && (
                <div className="space-y-2">
                  {selectedContact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{selectedContact.email}</span>
                    </div>
                  )}
                  {selectedContact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{selectedContact.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="default"
                  onClick={() => {
                    onStartChat(selectedContact.id)
                    setSelectedContact(null)
                  }}
                  className="flex-col h-auto py-3 rounded-xl"
                >
                  <MessageCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Message</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-3 rounded-xl">
                  <Phone className="h-5 w-5 mb-1" />
                  <span className="text-xs">Call</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-3 rounded-xl">
                  <Video className="h-5 w-5 mb-1" />
                  <span className="text-xs">Video</span>
                </Button>
              </div>

              {/* More Options */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => toggleFavorite(selectedContact.id)}
                  className="w-full justify-start rounded-xl"
                >
                  <Star
                    className={`mr-2 h-4 w-4 ${
                      selectedContact.isFavorite ? "fill-primary text-primary" : ""
                    }`}
                  />
                  {selectedContact.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => removeContact(selectedContact.id)}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Remove Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

