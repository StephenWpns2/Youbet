"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, Plus, TrendingUp, Users, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { YouBetLogo } from "./youbet-logo"
import { useUser } from "@/contexts/user-context"

interface BetPost {
  id: string
  user: {
    name: string
    avatar: string
    roi: number
  }
  bet: {
    teams: string
    odds: string
    stake: number
    result?: "win" | "loss"
  }
  likes: number
  comments: number
  timestamp: string
}

const mockPosts: BetPost[] = [
  {
    id: "1",
    user: { name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=12", roi: 23.5 },
    bet: { teams: "Lakers vs Warriors", odds: "+150", stake: 100, result: "win" },
    likes: 42,
    comments: 8,
    timestamp: "2h ago",
  },
  {
    id: "2",
    user: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=5", roi: 18.2 },
    bet: { teams: "Man City vs Arsenal", odds: "+200", stake: 50, result: "loss" },
    likes: 28,
    comments: 5,
    timestamp: "4h ago",
  },
  {
    id: "3",
    user: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=33", roi: 31.8 },
    bet: { teams: "Chiefs vs Bills", odds: "-110", stake: 200 },
    likes: 56,
    comments: 12,
    timestamp: "6h ago",
  },
]

export function HomeFeed({ onCreatePost }: { onCreatePost: () => void }) {
  const router = useRouter()
  const { user } = useUser()
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(false)
  const [taglineIndex, setTaglineIndex] = useState(0)

  const taglines = [
    "Let's Win Together",
    "Your Winning Community",
    "Bet Smart, Win Big",
    "Track Every Victory"
  ]

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Rotate taglines every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-primary via-primary/95 to-secondary backdrop-blur-lg shadow-xl border-b-2 border-white/20">
        <div className="px-4 py-4">
          {/* Top Row: Logo + Actions */}
          <div className="flex items-center justify-between mb-3">
            {/* Logo and Tagline - Left Aligned */}
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="bg-white rounded-2xl p-3 shadow-lg inline-block">
                <YouBetLogo size={48} className="text-primary" />
              </div>
              {/* Animated Slogan below logo */}
              <div className="relative h-6 overflow-hidden mt-2">
                {taglines.map((tagline, index) => (
                  <div
                    key={tagline}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                      index === taglineIndex
                        ? 'opacity-100 translate-y-0'
                        : index < taglineIndex
                          ? 'opacity-0 -translate-y-full'
                          : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <p className="text-xs font-bold text-white/90 italic tracking-wide whitespace-nowrap">
                      {tagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Connect Button + Avatar */}
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right duration-700">
              {/* Connect Button */}
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-white"
              >
                <span className="text-xs font-black text-white drop-shadow-md">
                  Connect
                </span>
              </button>

              {/* Profile Avatar */}
              <Avatar 
                className="h-10 w-10 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-all duration-300"
              >
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm font-black">
                  {user?.name?.split(" ").map(n => n[0]).join("") || "YB"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* User Name Display */}
          {user && (
            <div className="text-center mt-1 mb-2">
              <p className="text-xs font-semibold text-white/90">
                Welcome back, {user.name}!
              </p>
            </div>
          )}

          {/* Quick Stats Bar */}
          <div className={`grid grid-cols-3 gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center border border-white/30">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-white" />
                <p className="text-xs font-bold text-white">ROI</p>
              </div>
              <p className="text-sm font-black text-white">+23.5%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center border border-white/30">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-3 w-3 text-white" />
                <p className="text-xs font-bold text-white">Streak</p>
              </div>
              <p className="text-sm font-black text-white">7W</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center border border-white/30">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-3 w-3 text-white" />
                <p className="text-xs font-bold text-white">Following</p>
              </div>
              <p className="text-sm font-black text-white">142</p>
            </div>
          </div>
        </div>
      </header>

      {/* Feed */}
      <div className="space-y-4 p-4 relative z-10">
        {mockPosts.map((post, index) => (
          <Card
            key={post.id}
            className={`overflow-hidden rounded-2xl border-2 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-in fade-in slide-in-from-bottom ${
              post.bet.result === "win"
              ? "border-success/40 bg-gradient-to-br from-white via-white to-success/10"
              : post.bet.result === "loss"
                ? "border-destructive/40 bg-gradient-to-br from-white via-white to-destructive/10"
                : "border-primary/40 bg-gradient-to-br from-white via-white to-primary/10"
            }`}
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationDuration: '700ms'
            }}
          >
            <div className="p-5">
              {/* User Info */}
              <div className="mb-4 flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-200 group"
                  onClick={() => router.push(`/profile/${post.user.name.toLowerCase().replace(' ', '')}`)}
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-3 border-primary/30 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {post.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{post.user.name}</p>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <div className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 shadow-md">
                  <p className="text-sm font-black text-white">ROI {post.user.roi}%</p>
                </div>
              </div>

              {/* Bet Details */}
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-5 border border-border/50 backdrop-blur-sm">
                <h3 className="mb-3 text-lg font-black text-foreground">{post.bet.teams}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Odds</p>
                    <p className="text-2xl font-black text-primary">{post.bet.odds}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Stake</p>
                    <p className="text-2xl font-black text-foreground">${post.bet.stake}</p>
                  </div>
                  {post.bet.result && (
                    <div
                      className={`rounded-xl px-5 py-2.5 shadow-lg ${
                        post.bet.result === "win" 
                          ? "bg-success" 
                          : "bg-destructive"
                      }`}
                    >
                      <p className="text-sm font-black text-white uppercase tracking-wide drop-shadow-md">
                        {post.bet.result === "win" ? "WON" : "LOST"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 transition-all hover:scale-110 rounded-xl flex-1 ${
                    likedPosts.has(post.id) 
                      ? "text-red-500 bg-red-50 hover:bg-red-100" 
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className={`h-5 w-5 transition-all ${likedPosts.has(post.id) ? "fill-current scale-110" : ""}`} />
                  <span className="font-semibold">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground transition-all hover:scale-110 hover:bg-muted rounded-xl flex-1"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground transition-all hover:scale-110 hover:bg-muted rounded-xl px-4"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Result Banner (for wins/losses) */}
            {post.bet.result && (
              <div className={`h-1.5 ${
                post.bet.result === "win" 
                  ? "bg-gradient-to-r from-success via-success/80 to-success" 
                  : "bg-gradient-to-r from-destructive via-destructive/80 to-destructive"
              }`} />
            )}
          </Card>
        ))}

        {/* Load More Indicator */}
        <div className="py-8 text-center animate-in fade-in duration-1000" style={{ animationDelay: '1s' }}>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">You're all caught up!</p>
        </div>
      </div>

      {/* Floating Create Button */}
      <button
        onClick={onCreatePost}
        className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95 animate-in zoom-in duration-700 border-4 border-white"
        style={{ animationDelay: '1.2s' }}
      >
        <Plus className="h-7 w-7 text-white" strokeWidth={3} />
      </button>
    </div>
  )
}
