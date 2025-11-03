"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Send,
  Smile,
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  Users,
  Share2,
  TrendingUp,
  MessageCircle,
  Phone,
  Video,
  Paperclip,
  Mic,
  Image as ImageIcon,
  File,
  Check,
  CheckCheck,
  Reply,
  Forward,
  Copy,
  Trash2,
  Edit,
  ThumbsUp,
  Heart,
  Laugh,
  Flag,
  UserPlus,
  X,
  Download,
  Play,
  Pause,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { ContactsManager, type Contact } from "./contacts-manager"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "voice" | "bet-slip" | "game-analysis"
  status: "sending" | "sent" | "delivered" | "read"
  replyTo?: {
    id: string
    senderName: string
    content: string
  }
  reactions?: {
    emoji: string
    userId: string
    userName: string
  }[]
  isEdited?: boolean
  betData?: {
    match: string
    odds: string
    stake: number
    result?: "win" | "loss"
    profit?: number
  }
  mediaUrl?: string
  fileName?: string
  fileSize?: string
  voiceDuration?: number
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  isGroup: boolean
  members?: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
  }[]
  isTyping?: boolean
  isPinned?: boolean
}

const mockCurrentUserId = "user-1"

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/sports-bettor.jpg",
    lastMessage: "Lakers looking strong tonight!",
    timestamp: "2m ago",
    unread: 2,
    isGroup: false,
    isPinned: true,
    members: [
      { id: "sarah-1", name: "Sarah Chen", avatar: "/sports-bettor.jpg", isOnline: true },
    ],
  },
  {
    id: "2",
    name: "NBA Betting Squad",
    avatar: "/diverse-group-collaborating.png",
    lastMessage: "Alex: I got them at +150",
    timestamp: "5m ago",
    unread: 5,
    isGroup: true,
    isTyping: true,
    members: [
      { id: "alex-1", name: "Alex", avatar: "/placeholder.svg", isOnline: true },
      { id: "mike-1", name: "Mike", avatar: "/abstract-geometric-shapes.png", isOnline: false },
      { id: "emma-1", name: "Emma", avatar: "/placeholder.svg", isOnline: true },
    ],
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "/abstract-geometric-shapes.png",
    lastMessage: "Check out this parlay",
    timestamp: "1h ago",
    unread: 0,
    isGroup: false,
    members: [
      { id: "mike-2", name: "Mike Johnson", avatar: "/abstract-geometric-shapes.png", isOnline: false },
    ],
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "sarah-1",
    senderName: "Sarah Chen",
    senderAvatar: "/sports-bettor.jpg",
    content: "Hey! Did you see the Lakers game tonight?",
    timestamp: "10:23 AM",
    type: "text",
    status: "read",
  },
  {
    id: "2",
    senderId: mockCurrentUserId,
    senderName: "You",
    senderAvatar: "/placeholder.svg",
    content: "Yeah! I'm thinking of betting on them",
    timestamp: "10:24 AM",
    type: "text",
    status: "read",
    reactions: [
      { emoji: "👍", userId: "sarah-1", userName: "Sarah Chen" },
    ],
  },
  {
    id: "3",
    senderId: "sarah-1",
    senderName: "Sarah Chen",
    senderAvatar: "/sports-bettor.jpg",
    content: "Check out my slip, great odds!",
    timestamp: "10:25 AM",
    type: "bet-slip",
    status: "read",
    betData: {
      match: "Lakers vs Warriors",
      odds: "+150",
      stake: 50,
      result: "win",
      profit: 75,
    },
  },
  {
    id: "4",
    senderId: mockCurrentUserId,
    senderName: "You",
    senderAvatar: "/placeholder.svg",
    content: "Nice hit! What's your analysis?",
    timestamp: "10:26 AM",
    type: "text",
    status: "delivered",
    replyTo: {
      id: "3",
      senderName: "Sarah Chen",
      content: "Check out my slip, great odds!",
    },
  },
]

const reactionEmojis = ["👍", "❤️", "😂", "🔥", "🎯", "💯"]

export function MessagingApp() {
  const [view, setView] = useState<"list" | "chat" | "contacts">("list")
  const [message, setMessage] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [messageSearchQuery, setMessageSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const openChat = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setView("chat")
    // Mark as read
    setConversations(
      conversations.map((c) =>
        c.id === conversation.id ? { ...c, unread: 0 } : c
      )
    )
  }

  const backToList = () => {
    setView("list")
    setSelectedConversation(null)
    setReplyingTo(null)
    setEditingMessage(null)
  }

  const sendMessage = () => {
    if (!message.trim() && !editingMessage) return

    if (editingMessage) {
      // Edit existing message
      setMessages(
        messages.map((m) =>
          m.id === editingMessage.id
            ? { ...m, content: message, isEdited: true }
            : m
        )
      )
      setEditingMessage(null)
    } else {
      // Send new message
      const timestamp = typeof window !== 'undefined' 
        ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Now"
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: mockCurrentUserId,
        senderName: "You",
        senderAvatar: "/placeholder.svg",
        content: message,
        timestamp,
        type: "text",
        status: "sending",
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              senderName: replyingTo.senderName,
              content: replyingTo.content,
            }
          : undefined,
      }
      setMessages([...messages, newMessage])

      // Simulate sending
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, status: "sent" } : m
          )
        )
      }, 500)
    }

    setMessage("")
    setReplyingTo(null)
  }

  const deleteMessage = (messageId: string) => {
    if (confirm("Delete this message?")) {
      setMessages(messages.filter((m) => m.id !== messageId))
      setSelectedMessage(null)
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((m) => {
        if (m.id === messageId) {
          const reactions = m.reactions || []
          const existingReaction = reactions.find(
            (r) => r.userId === mockCurrentUserId && r.emoji === emoji
          )

          if (existingReaction) {
            // Remove reaction
            return {
              ...m,
              reactions: reactions.filter((r) => r !== existingReaction),
            }
          } else {
            // Add reaction
            return {
              ...m,
              reactions: [
                ...reactions,
                { emoji, userId: mockCurrentUserId, userName: "You" },
              ],
            }
          }
        }
        return m
      })
    )
  }

  const handleFileSelect = (type: "image" | "file") => {
    const timestamp = typeof window !== 'undefined'
      ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Now"
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: mockCurrentUserId,
      senderName: "You",
      senderAvatar: "/placeholder.svg",
      content: type === "image" ? "Shared an image" : "Shared a file",
      timestamp,
      type: type,
      status: "sending",
      mediaUrl: "/placeholder.svg",
      fileName: type === "file" ? "document.pdf" : undefined,
      fileSize: type === "file" ? "2.3 MB" : undefined,
    }
    setMessages([...messages, newMessage])
    setShowMediaOptions(false)

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: "sent" } : m))
      )
    }, 1000)
  }

  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      // Start recording
      setIsRecordingVoice(true)
    } else {
      // Stop and send
      const timestamp = typeof window !== 'undefined'
        ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Now"
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: mockCurrentUserId,
        senderName: "You",
        senderAvatar: "/placeholder.svg",
        content: "Voice message",
        timestamp,
        type: "voice",
        status: "sending",
        voiceDuration: 15,
      }
      setMessages([...messages, newMessage])
      setIsRecordingVoice(false)

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMessage.id ? { ...m, status: "sent" } : m))
        )
      }, 500)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned)
  const regularConversations = filteredConversations.filter((c) => !c.isPinned)

  if (view === "contacts") {
    return (
      <ContactsManager
        onStartChat={(contactId) => {
          // Create or open conversation with contact
          alert(`Starting chat with contact ${contactId}`)
          setView("list")
        }}
        onBack={() => setView("list")}
      />
    )
  }

  if (view === "list") {
    return (
      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <header className="border-b bg-card px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
                onClick={() => setView("contacts")}
              >
                <Users className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
                onClick={() => setShowNewChat(!showNewChat)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="rounded-xl pl-10"
              />
            </div>
          )}
        </header>

        {/* New Chat Options */}
        {showNewChat && (
          <div className="border-b bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Start New</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowNewChat(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setView("contacts")}
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent rounded-xl"
              >
                <MessageCircle className="h-4 w-4" />
                New DM
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent rounded-xl"
              >
                <Users className="h-4 w-4" />
                Create Group
              </Button>
              <Button
                variant="outline"
                onClick={() => setView("contacts")}
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent rounded-xl"
              >
                <UserPlus className="h-4 w-4" />
                View Contacts
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent rounded-xl"
              >
                <Share2 className="h-4 w-4" />
                Invite Friends
              </Button>
            </div>
          </div>
        )}

        {/* Pinned Conversations */}
        {pinnedConversations.length > 0 && (
          <div className="border-b bg-card/50">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Pinned</p>
            </div>
            {pinnedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => openChat(conversation)}
              />
            ))}
          </div>
        )}

        {/* Regular Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {regularConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No conversations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start chatting with your contacts
              </p>
              <Button onClick={() => setView("contacts")} className="rounded-xl">
                <Users className="mr-2 h-4 w-4" />
                View Contacts
              </Button>
            </div>
          ) : (
            regularConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => openChat(conversation)}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  // Chat View
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Chat Header */}
      <header className="border-b bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button variant="ghost" size="icon" onClick={backToList} className="text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => selectedConversation?.isGroup && setShowGroupInfo(true)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedConversation?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {!selectedConversation?.isGroup &&
                  selectedConversation?.members?.[0]?.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
                  )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-foreground truncate">
                  {selectedConversation?.name}
                </p>
                {selectedConversation?.isGroup ? (
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.members?.length} members
                  </p>
                ) : selectedConversation?.isTyping ? (
                  <p className="text-xs text-primary">typing...</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation?.members?.[0]?.isOnline ? "Online" : "Offline"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
              <Search className="h-5 w-5" onClick={() => setShowSearch(!showSearch)} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {selectedConversation?.isGroup && (
                  <DropdownMenuItem onClick={() => setShowGroupInfo(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Group Info
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Search className="mr-2 h-4 w-4" />
                  Search in Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Message Search */}
        {showSearch && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={messageSearchQuery}
              onChange={(e) => setMessageSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="rounded-xl pl-10"
            />
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isYou = msg.senderId === mockCurrentUserId
          return (
            <div key={msg.id} className={`flex gap-3 ${isYou ? "flex-row-reverse" : ""}`}>
              {!isYou && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.senderAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {msg.senderName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`flex-1 ${isYou ? "items-end" : "items-start"} flex flex-col`}>
                {!isYou && selectedConversation?.isGroup && (
                  <p className="mb-1 text-xs font-semibold text-foreground">{msg.senderName}</p>
                )}

                {/* Reply Preview */}
                {msg.replyTo && (
                  <div
                    className={`mb-1 max-w-[80%] rounded-lg border-l-4 border-primary bg-accent/50 p-2 ${
                      isYou ? "self-end" : "self-start"
                    }`}
                  >
                    <p className="text-xs font-semibold text-primary">{msg.replyTo.senderName}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.replyTo.content}</p>
                  </div>
                )}

                {/* Message Content */}
                <div className="relative group">
                  {msg.type === "text" && (
                    <Card
                      className={`inline-block max-w-[80%] rounded-2xl p-3 shadow-sm ${
                        isYou ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-card"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      {msg.isEdited && (
                        <p className="text-xs mt-1 opacity-70">Edited</p>
                      )}
                    </Card>
                  )}

                  {msg.type === "image" && (
                    <Card className={`overflow-hidden rounded-2xl ${isYou ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
                      <img
                        src={msg.mediaUrl || "/placeholder.svg"}
                        alt="Shared image"
                        className="max-w-[300px] max-h-[300px] object-cover"
                      />
                    </Card>
                  )}

                  {msg.type === "file" && (
                    <Card
                      className={`inline-flex items-center gap-3 max-w-[80%] rounded-2xl p-3 shadow-sm ${
                        isYou ? "rounded-tr-sm" : "rounded-tl-sm"
                      }`}
                    >
                      <div className="bg-primary/10 rounded-full p-2">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{msg.fileName}</p>
                        <p className="text-xs text-muted-foreground">{msg.fileSize}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </Card>
                  )}

                  {msg.type === "voice" && (
                    <Card
                      className={`inline-flex items-center gap-3 max-w-[80%] rounded-2xl p-3 shadow-sm ${
                        isYou ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-card"
                      }`}
                    >
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <div className="h-6 bg-foreground/20 rounded-full w-32" />
                      </div>
                      <p className="text-xs">{msg.voiceDuration}s</p>
                    </Card>
                  )}

                  {msg.type === "bet-slip" && msg.betData && (
                    <Card
                      className={`inline-block max-w-[80%] rounded-2xl p-4 shadow-md ${
                        isYou ? "rounded-tr-sm" : "rounded-tl-sm"
                      } ${
                        msg.betData.result === "win"
                          ? "border-2 border-success bg-success/5"
                          : msg.betData.result === "loss"
                          ? "border-2 border-destructive bg-destructive/5"
                          : "border-2 border-primary bg-primary/5"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground">Betting Slip</p>
                      </div>
                      <p className="mb-1 font-bold text-foreground">{msg.betData.match}</p>
                      <div className="mb-2 flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Odds: <span className="font-semibold text-foreground">{msg.betData.odds}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Stake: <span className="font-semibold text-foreground">${msg.betData.stake}</span>
                        </span>
                      </div>
                      {msg.betData.result && (
                        <div
                          className={`mt-2 rounded-lg p-2 ${
                            msg.betData.result === "win"
                              ? "bg-success/20 text-success"
                              : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          <p className="text-xs font-bold">
                            {msg.betData.result === "win" ? "WON" : "LOST"}{" "}
                            {msg.betData.result === "win" && `+$${msg.betData.profit}`}
                          </p>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Message Actions */}
                  <div
                    className={`absolute top-0 ${
                      isYou ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                    } opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isYou ? "end" : "start"}>
                        <DropdownMenuItem onClick={() => setReplyingTo(msg)}>
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="mr-2 h-4 w-4" />
                          Forward
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </DropdownMenuItem>
                        {isYou && msg.type === "text" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingMessage(msg)
                              setMessage(msg.content)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Report
                        </DropdownMenuItem>
                        {isYou && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex gap-1 mt-1 ${isYou ? "justify-end" : "justify-start"}`}>
                    {Object.entries(
                      msg.reactions.reduce((acc, r) => {
                        acc[r.emoji] = (acc[r.emoji] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(msg.id, emoji)}
                        className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs hover:bg-accent/80"
                      >
                        <span>{emoji}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Reactions */}
                <div
                  className={`flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isYou ? "justify-end" : "justify-start"
                  }`}
                >
                  {reactionEmojis.slice(0, 4).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      className="rounded-full bg-accent p-1 text-sm hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Timestamp and Status */}
                <div className={`flex items-center gap-1 mt-1 ${isYou ? "justify-end" : "justify-start"}`}>
                  <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                  {isYou && (
                    <span className="text-muted-foreground">
                      {msg.status === "sending" && <Check className="h-3 w-3" />}
                      {msg.status === "sent" && <Check className="h-3 w-3" />}
                      {msg.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                      {msg.status === "read" && <CheckCheck className="h-3 w-3 text-primary" />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply/Edit Bar */}
      {(replyingTo || editingMessage) && (
        <div className="border-t bg-card/50 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary">
                {editingMessage ? "Editing message" : `Replying to ${replyingTo?.senderName}`}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {editingMessage ? editingMessage.content : replyingTo?.content}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setReplyingTo(null)
                setEditingMessage(null)
                setMessage("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t bg-card p-4">
        {/* Quick Actions */}
        <div className="mb-2 flex gap-2 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-primary/30 text-xs hover:bg-primary/10 bg-transparent rounded-xl flex-shrink-0"
          >
            <Share2 className="h-3 w-3" />
            Share Slip
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-primary/30 text-xs hover:bg-primary/10 bg-transparent rounded-xl flex-shrink-0"
          >
            <TrendingUp className="h-3 w-3" />
            Share Analysis
          </Button>
        </div>

        {/* Input */}
        <div className="flex gap-2 items-end">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
              onClick={() => setShowMediaOptions(!showMediaOptions)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder={
                isRecordingVoice
                  ? "Recording..."
                  : editingMessage
                  ? "Edit message..."
                  : "Type a message..."
              }
              className="rounded-full border-primary/30 pr-10"
              disabled={isRecordingVoice}
            />
            {isRecordingVoice && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm text-destructive">Recording...</span>
              </div>
            )}
          </div>

          {message.trim() || editingMessage ? (
            <Button
              size="icon"
              onClick={sendMessage}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={toggleVoiceRecording}
              className={`rounded-full ${
                isRecordingVoice
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Media Options */}
        {showMediaOptions && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                imageInputRef.current?.click()
                handleFileSelect("image")
              }}
              className="flex items-center gap-2 rounded-xl"
            >
              <ImageIcon className="h-4 w-4" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fileInputRef.current?.click()
                handleFileSelect("file")
              }}
              className="flex items-center gap-2 rounded-xl"
            >
              <File className="h-4 w-4" />
              File
            </Button>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-2 grid grid-cols-8 gap-2 p-2 bg-card rounded-xl border">
            {["😀", "😂", "😍", "🤔", "👍", "👎", "🔥", "💯", "🎯", "⚽", "🏀", "🏈", "⚾", "🎾", "💪", "🙌"].map(
              (emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setMessage((prev) => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" />
      <input ref={fileInputRef} type="file" className="hidden" />

      {/* Group Info Dialog */}
      {showGroupInfo && selectedConversation?.isGroup && (
        <Dialog open={showGroupInfo} onOpenChange={setShowGroupInfo}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Group Info</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{selectedConversation.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.members?.length} members
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Members</h4>
                {selectedConversation.members?.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full rounded-xl">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Members
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ConversationItem({
  conversation,
  onClick,
}: {
  conversation: Conversation
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors hover:bg-accent"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {conversation.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {conversation.isGroup && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1">
            <Users className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
        {!conversation.isGroup && conversation.members?.[0]?.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">{conversation.name}</p>
            {conversation.isGroup && (
              <Badge variant="secondary" className="text-xs">
                {conversation.members?.length}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
        </div>
        <div className="flex items-center justify-between">
          {conversation.isTyping ? (
            <p className="text-sm text-primary">typing...</p>
          ) : (
            <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
          )}
          {conversation.unread > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground">{conversation.unread}</Badge>
          )}
        </div>
      </div>
    </div>
  )
}

