"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Target, DollarSign, BarChart3, Activity, Trophy, XCircle, Shield, Users, LineChart } from "lucide-react"
import { YouBetLogo } from "@/components/youbet-logo"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Dashboard() {
  const router = useRouter()
  const [animatedStats, setAnimatedStats] = useState({
    totalBets: 0,
    winRate: 0,
    totalProfit: 0,
    roi: 0,
  })

  const finalStats = {
    totalBets: 247,
    winRate: 68,
    totalProfit: 2340,
    roi: 23.5,
  }

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setAnimatedStats({
        totalBets: Math.floor(finalStats.totalBets * progress),
        winRate: Math.floor(finalStats.winRate * progress),
        totalProfit: Math.floor(finalStats.totalProfit * progress),
        roi: Number.parseFloat((finalStats.roi * progress).toFixed(1)),
      })

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedStats(finalStats)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    { label: "Total Bets", value: animatedStats.totalBets.toString(), icon: Target, color: "text-primary" },
    { label: "Win Rate", value: `${animatedStats.winRate}%`, icon: TrendingUp, color: "text-secondary" },
    {
      label: "Total Profit",
      value: `$${animatedStats.totalProfit.toLocaleString()}`,
      icon: DollarSign,
      color: "text-secondary",
    },
    { label: "ROI", value: `+${animatedStats.roi}%`, icon: BarChart3, color: "text-primary" },
  ]

  const roiTrendData = [
    { week: "W1", roi: 12, profit: 450 },
    { week: "W2", roi: 8, profit: 320 },
    { week: "W3", roi: 18, profit: 680 },
    { week: "W4", roi: 15, profit: 590 },
    { week: "W5", roi: 22, profit: 890 },
    { week: "W6", roi: 19, profit: 720 },
    { week: "W7", roi: 23.5, profit: 920 },
  ]

  const betDistributionData = [
    { name: "NBA", value: 45, color: "oklch(0.55 0.22 250)" },
    { name: "NFL", value: 30, color: "oklch(0.7 0.18 145)" },
    { name: "Soccer", value: 15, color: "oklch(0.65 0.15 280)" },
    { name: "MLB", value: 10, color: "oklch(0.6 0.2 200)" },
  ]

  const performanceData = [
    { month: "Jan", wins: 18, losses: 7 },
    { month: "Feb", wins: 22, losses: 9 },
    { month: "Mar", wins: 25, losses: 8 },
    { month: "Apr", wins: 28, losses: 6 },
    { month: "May", wins: 31, losses: 5 },
    { month: "Jun", wins: 35, losses: 7 },
  ]

  const recentBets = [
    { sport: "NBA", match: "Lakers vs Warriors", result: "win", profit: "+$150" },
    { sport: "NFL", match: "Chiefs vs Bills", result: "win", profit: "+$220" },
    { sport: "Soccer", match: "Man City vs Arsenal", result: "loss", profit: "-$50" },
  ]

  const followingUsers = [
    {
      id: 1,
      name: "Mike Johnson",
      username: "@mikej",
      avatar: "/sports-bettor.jpg",
      totalWins: 156,
      totalLosses: 89,
      last10Games: { wins: 7, losses: 3 },
      recentGames: [
        { sport: "NBA", match: "Celtics vs Heat", result: "win", odds: "1.85", stake: "$100", profit: "+$85" },
        { sport: "NFL", match: "49ers vs Cowboys", result: "win", odds: "2.10", stake: "$50", profit: "+$55" },
        { sport: "MLB", match: "Yankees vs Red Sox", result: "loss", odds: "1.75", stake: "$75", profit: "-$75" },
        { sport: "Soccer", match: "Liverpool vs Chelsea", result: "win", odds: "1.95", stake: "$120", profit: "+$114" },
      ],
    },
    {
      id: 2,
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "/sports-bettor.jpg",
      totalWins: 203,
      totalLosses: 67,
      last10Games: { wins: 8, losses: 2 },
      recentGames: [
        { sport: "NBA", match: "Lakers vs Nuggets", result: "win", odds: "2.20", stake: "$150", profit: "+$180" },
        { sport: "Soccer", match: "Man City vs Arsenal", result: "win", odds: "1.65", stake: "$200", profit: "+$130" },
        { sport: "NFL", match: "Chiefs vs Eagles", result: "win", odds: "1.90", stake: "$100", profit: "+$90" },
        { sport: "NBA", match: "Bucks vs Nets", result: "loss", odds: "1.80", stake: "$80", profit: "-$80" },
      ],
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      username: "@alexr",
      avatar: "/sports-bettor.jpg",
      totalWins: 134,
      totalLosses: 98,
      last10Games: { wins: 6, losses: 4 },
      recentGames: [
        { sport: "MLB", match: "Dodgers vs Giants", result: "win", odds: "1.70", stake: "$90", profit: "+$63" },
        {
          sport: "Soccer",
          match: "Barcelona vs Real Madrid",
          result: "loss",
          odds: "2.00",
          stake: "$100",
          profit: "-$100",
        },
        { sport: "NBA", match: "Warriors vs Suns", result: "win", odds: "1.85", stake: "$110", profit: "+$93.50" },
        { sport: "NFL", match: "Packers vs Vikings", result: "loss", odds: "1.95", stake: "$60", profit: "-$60" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header with Logo */}
      <header className="bg-gradient-to-r from-primary to-secondary px-4 py-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <YouBetLogo size={48} className="text-white" />
          <div>
            <h1 className="text-2xl font-black text-white">Analytics Dashboard</h1>
            <p className="text-sm text-white/90">Track your betting performance</p>
          </div>
        </div>
      </header>

      {/* Value Proposition Banner */}
      <div className="px-4 mt-4">
        <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 border-2 border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold text-foreground">Why YouBet?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">The Problem:</strong> Sports bettors have no way to prove their 
                track record. Anyone can claim big wins, but without transparency, it's impossible to know who 
                to trust or learn from.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Our Solution:</strong> YouBet creates a tamper-proof, 
                time-stamped record of every pick you make. Picks lock when events start—no editing after the fact. 
                Build real credibility, follow proven winners, and improve together.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-success/20 rounded-full p-1">
                    <Shield className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-semibold text-foreground">Tamper-Proof Records</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-primary/20 rounded-full p-1">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">Learn from Winners</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-secondary/20 rounded-full p-1">
                    <LineChart className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="font-semibold text-foreground">Track Progress</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid with animation */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="animate-fade-in-up rounded-2xl border border-border bg-card p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2">
                <div className={`rounded-full bg-muted p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className={`mt-3 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* ROI Trend Chart */}
      <div className="px-4 mt-4">
        <Card
          className="rounded-2xl border border-border bg-card p-6 shadow-md animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-card-foreground">ROI & Profit Trend</h3>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={roiTrendData}>
              <defs>
                <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.22 250)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="oklch(0.55 0.22 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="week" stroke="oklch(0.5 0 0)" />
              <YAxis stroke="oklch(0.5 0 0)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0 0)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="roi"
                stroke="oklch(0.55 0.22 250)"
                fillOpacity={1}
                fill="url(#colorRoi)"
                strokeWidth={3}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Chart */}
      <div className="px-4 mt-4">
        <Card
          className="rounded-2xl border border-border bg-card p-6 shadow-md animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <h3 className="mb-4 font-bold text-card-foreground">Win/Loss Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" stroke="oklch(0.5 0 0)" />
              <YAxis stroke="oklch(0.5 0 0)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0 0)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="wins" fill="oklch(0.7 0.18 145)" radius={[8, 8, 0, 0]} animationDuration={1500} />
              <Bar dataKey="losses" fill="oklch(0.55 0.22 25)" radius={[8, 8, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bet Distribution Pie Chart */}
      <div className="px-4 mt-4">
        <Card
          className="rounded-2xl border border-border bg-card p-6 shadow-md animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <h3 className="mb-4 font-bold text-card-foreground">Bet Distribution by Sport</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={betDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1500}
              >
                {betDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 px-4">
        <h3 className="mb-4 text-xl font-bold text-foreground">Following Performance</h3>
        <div className="space-y-4">
          {followingUsers.map((user, userIndex) => (
            <Card
              key={user.id}
              className="animate-fade-in-up rounded-2xl border border-border bg-card p-5 shadow-md transition-all hover:shadow-lg cursor-pointer"
              style={{ animationDelay: `${700 + userIndex * 100}ms` }}
              onClick={() => router.push(`/profile/${user.username.replace('@', '')}`)}
            >
              {/* User Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-card-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/profile/${user.username.replace('@', '')}`)
                  }}
                >
                  View Profile
                </Button>
              </div>

              {/* Overall Stats */}
              <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{user.totalWins}</p>
                  <p className="text-xs text-muted-foreground">Total Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">{user.totalLosses}</p>
                  <p className="text-xs text-muted-foreground">Total Losses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {((user.totalWins / (user.totalWins + user.totalLosses)) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>

              {/* Last 10 Games Performance */}
              <div className="mb-4 rounded-xl border border-border bg-background p-3">
                <p className="mb-2 text-sm font-bold text-foreground">Last 10 Games</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    <span className="text-lg font-bold text-secondary">{user.last10Games.wins}W</span>
                  </div>
                  <div className="h-2 flex-1 mx-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-1000"
                      style={{ width: `${(user.last10Games.wins / 10) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-destructive">{user.last10Games.losses}L</span>
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </div>

              {/* Recent Games */}
              <div>
                <p className="mb-2 text-sm font-bold text-foreground">Recent Games</p>
                <div className="space-y-2">
                  {user.recentGames.map((game, gameIndex) => (
                    <div
                      key={gameIndex}
                      className="rounded-xl border-2 border-border/50 bg-card p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                              {game.sport}
                            </span>
                            {/* Professional WIN/LOST Badge */}
                            <span
                              className={`text-xs font-black uppercase px-3 py-1 rounded-lg shadow-sm ${
                                game.result === "win" 
                                  ? "bg-green-600 text-white" 
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              {game.result === "win" ? "WON" : "LOST"}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-card-foreground mb-2">{game.match}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-semibold">Odds:</span> {game.odds}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-semibold">Stake:</span> {game.stake}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-xl font-black ${
                              game.result === "win" ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            {game.profit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Bets */}
      <div className="mt-6 px-4">
        <h3 className="mb-3 font-bold text-foreground">My Recent Bets</h3>
        <div className="space-y-3">
          {recentBets.map((bet, i) => (
            <Card
              key={i}
              className="animate-fade-in-up rounded-2xl border-2 border-border/50 bg-card p-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ animationDelay: `${700 + i * 100}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      {bet.sport}
                    </span>
                    {/* Professional WIN/LOST Badge */}
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-lg shadow-sm ${
                        bet.result === "win" 
                          ? "bg-green-600 text-white" 
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {bet.result === "win" ? "WON" : "LOST"}
                    </span>
                  </div>
                  <p className="font-bold text-card-foreground">{bet.match}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xl font-black ${bet.result === "win" ? "text-green-600" : "text-blue-600"}`}>
                    {bet.profit}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
