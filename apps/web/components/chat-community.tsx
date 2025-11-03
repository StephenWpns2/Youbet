"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { useState } from "react"

interface Message {
  id: string
  user: string
  avatar: string
  message: string
  timestamp: string
  type?: "text" | "bet-slip" | "game-analysis"
  betData?: {
    match: string
    odds: string
    stake: number
    result?: "win" | "loss"
    profit?: number
  }
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  isGroup: boolean
  members?: number
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/sports-bettor.jpg",
    lastMessage: "Lakers looking strong tonight!",
    timestamp: "2m ago",
    unread: 2,
    isGroup: false,
  },
  {
    id: "2",
    name: "NBA Betting Squad",
    avatar: "/diverse-group-collaborating.png",
    lastMessage: "Alex: I got them at +150",
    timestamp: "5m ago",
    unread: 5,
    isGroup: true,
    members: 8,
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "/abstract-geometric-shapes.png",
    lastMessage: "Check out this parlay",
    timestamp: "1h ago",
    unread: 0,
    isGroup: false,
  },
  {
    id: "4",
    name: "Premier League Tips",
    avatar: "/diverse-group-collaborating.png",
    lastMessage: "Emma: City to win by 2+",
    timestamp: "3h ago",
    unread: 12,
    isGroup: true,
    members: 24,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    user: "Sarah Chen",
    avatar: "/sports-bettor.jpg",
    message: "Hey! Did you see the Lakers game tonight?",
    timestamp: "10:23 AM",
    type: "text",
  },
  {
    id: "2",
    user: "You",
    avatar: "/placeholder.svg",
    message: "Yeah! I'm thinking of betting on them",
    timestamp: "10:24 AM",
    type: "text",
  },
  {
    id: "3",
    user: "Sarah Chen",
    avatar: "/sports-bettor.jpg",
    message: "Check out my slip, great odds!",
    timestamp: "10:25 AM",
    type: "bet-slip",
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
    user: "You",
    avatar: "/placeholder.svg",
    message: "Nice hit! What's your analysis?",
    timestamp: "10:26 AM",
    type: "text",
  },
  {
    id: "5",
    user: "Sarah Chen",
    avatar: "/sports-bettor.jpg",
    message:
      "Warriors defense has been weak, Lakers have momentum. LeBron is playing well and AD is dominating the paint.",
    timestamp: "10:27 AM",
    type: "game-analysis",
  },
]

export function ChatCommunity() {
  const [view, setView] = useState<"list" | "chat">("list")
  const [message, setMessage] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showNewChat, setShowNewChat] = useState(false)

  const openChat = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setView("chat")
  }

  const backToList = () => {
    setView("list")
    setSelectedConversation(null)
  }

  if (view === "list") {
    return (
      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <header className="border-b bg-card px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
                onClick={() => setShowNewChat(true)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* New Chat Options */}
        {showNewChat && (
          <div className="border-b bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Start New</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowNewChat(false)}>
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                <MessageCircle className="h-4 w-4" />
                New DM
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                <Users className="h-4 w-4" />
                Create Group
              </Button>
              <Button
                variant="outline"
                className="col-span-2 flex items-center gap-2 border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                <Share2 className="h-4 w-4" />
                Invite Friends to YouBet
              </Button>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => openChat(conversation)}
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
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{conversation.name}</p>
                    {conversation.isGroup && (
                      <Badge variant="secondary" className="text-xs">
                        {conversation.members}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                  {conversation.unread > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">{conversation.unread}</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Chat Header */}
      <header className="border-b bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={backToList} className="text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {selectedConversation?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{selectedConversation?.name}</p>
              {selectedConversation?.isGroup && (
                <p className="text-xs text-muted-foreground">{selectedConversation.members} members</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-primary">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {mockMessages.map((msg) => {
          const isYou = msg.user === "You"
          return (
            <div key={msg.id} className={`flex gap-3 ${isYou ? "flex-row-reverse" : ""}`}>
              {!isYou && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {msg.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`flex-1 ${isYou ? "items-end" : "items-start"} flex flex-col`}>
                {!isYou && <p className="mb-1 text-xs font-semibold text-foreground">{msg.user}</p>}

                {/* Regular text message */}
                {msg.type === "text" && (
                  <Card
                    className={`inline-block max-w-[80%] rounded-2xl p-3 shadow-sm ${
                      isYou ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-card"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </Card>
                )}

                {/* Bet slip message */}
                {msg.type === "bet-slip" && msg.betData && (
                  <Card
                    className={`inline-block max-w-[80%] rounded-2xl p-4 shadow-md ${
                      isYou ? "rounded-tr-sm" : "rounded-tl-sm"
                    } ${
                      msg.betData.result === "win"
                        ? "border-2 border-success bg-success/5"
                        : "border-2 border-destructive bg-destructive/5"
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

                {/* Game analysis message */}
                {msg.type === "game-analysis" && (
                  <Card
                    className={`inline-block max-w-[80%] rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 shadow-sm ${
                      isYou ? "rounded-tr-sm" : "rounded-tl-sm"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <p className="text-xs font-semibold text-primary">Game Analysis</p>
                    </div>
                    <p className="text-sm text-foreground">{msg.message}</p>
                  </Card>
                )}

                <p className={`mt-1 text-xs text-muted-foreground ${isYou ? "text-right" : ""}`}>{msg.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Bar with share options */}
      <div className="border-t bg-card p-4">
        <div className="mb-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-primary/30 text-xs hover:bg-primary/10 bg-transparent"
          >
            <Share2 className="h-3 w-3" />
            Share Slip
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-primary/30 text-xs hover:bg-primary/10 bg-transparent"
          >
            <TrendingUp className="h-3 w-3" />
            Share Analysis
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-primary">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-primary/30"
          />
          <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
