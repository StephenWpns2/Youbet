"use client"

import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  UserPlus,
  Share2,
  Trophy,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Flame,
} from "lucide-react"
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

// Mock user data - in production, fetch from API
const getUserData = (handle: string) => {
  return {
    id: "user-123",
    handle: handle,
    name: "Alex Johnson",
    avatar: "/male-avatar.png",
    bio: "🏀 NBA & NFL Enthusiast | 📊 Data-Driven Bettor | 🎯 67% Win Rate",
    joinedDate: "Jan 2024",
    isFollowing: false,
    stats: {
      totalPicks: 342,
      winRate: 67.3,
      roi: 28.5,
      totalProfit: 8450,
      totalStaked: 29600,
      currentStreak: 7,
      bestStreak: 15,
      followers: 2847,
      following: 156,
      avgOdds: 2.15,
    },
    recentPicks: [
      {
        id: "1",
        event: "Lakers vs Celtics",
        league: "NBA",
        market: "Moneyline",
        selection: "Lakers",
        odds: 2.15,
        stake: 100,
        status: "won",
        profit: 115,
        date: "2024-11-01",
        lockTime: "2024-11-01 19:30",
        proofUrl: "/basketball-player-action.png",
      },
      {
        id: "2",
        event: "49ers vs Cowboys",
        league: "NFL",
        market: "Spread",
        selection: "49ers -3.5",
        odds: 1.91,
        stake: 150,
        status: "won",
        profit: 136.5,
        date: "2024-10-30",
        lockTime: "2024-10-30 13:00",
        proofUrl: "/football-celebration.png",
      },
      {
        id: "3",
        event: "Knicks vs Heat",
        league: "NBA",
        market: "Over/Under",
        selection: "Over 215.5",
        odds: 1.95,
        stake: 80,
        status: "lost",
        profit: -80,
        date: "2024-10-28",
        lockTime: "2024-10-28 19:00",
      },
      {
        id: "4",
        event: "Chiefs vs Raiders",
        league: "NFL",
        market: "Player Props",
        selection: "Mahomes Over 2.5 TD",
        odds: 2.35,
        stake: 60,
        status: "won",
        profit: 81,
        date: "2024-10-27",
        lockTime: "2024-10-27 16:25",
        proofUrl: "/sports-bettor.jpg",
      },
      {
        id: "5",
        event: "Warriors vs Suns",
        league: "NBA",
        market: "Moneyline",
        selection: "Warriors",
        odds: 1.75,
        stake: 120,
        status: "won",
        profit: 90,
        date: "2024-10-25",
        lockTime: "2024-10-25 20:00",
      },
      {
        id: "6",
        event: "Packers vs Vikings",
        league: "NFL",
        market: "Spread",
        selection: "Packers -7",
        odds: 1.88,
        stake: 100,
        status: "pending",
        profit: 0,
        date: "2024-11-03",
        lockTime: "2024-11-03 13:00",
      },
    ],
    earningsChart: [
      { month: "Jun", profit: 450, loss: -200 },
      { month: "Jul", profit: 820, loss: -340 },
      { month: "Aug", profit: 1250, loss: -480 },
      { month: "Sep", profit: 1680, loss: -590 },
      { month: "Oct", profit: 2150, loss: -720 },
      { month: "Nov", profit: 2100, loss: -680 },
    ],
    sportDistribution: [
      { name: "NBA", value: 45, color: "#f97316" },
      { name: "NFL", value: 35, color: "#3b82f6" },
      { name: "MLB", value: 12, color: "#10b981" },
      { name: "NHL", value: 8, color: "#8b5cf6" },
    ],
    winLossDistribution: [
      { name: "Wins", value: 230, color: "#10b981" },
      { name: "Losses", value: 92, color: "#3b82f6" },
      { name: "Pending", value: 20, color: "#f59e0b" },
    ],
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const handle = params.handle as string
  const user = getUserData(handle)

  const handleFollowToggle = () => {
    // Implement follow/unfollow logic
    console.log("Toggle follow")
  }

  const handleShare = () => {
    // Implement share profile
    if (navigator.share) {
      navigator.share({
        title: `${user.name} on YouBet`,
        text: `Check out ${user.name}'s betting profile on YouBet!`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-white hover:bg-white/20"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{user.name}</h1>
            <p className="text-white/80 text-sm mb-2">@{user.handle}</p>
            <p className="text-white/90 text-sm mb-3">{user.bio}</p>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Calendar className="h-3 w-3" />
              <span>Joined {user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleFollowToggle}
            className={`flex-1 font-bold ${
              user.isFollowing
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-white text-primary hover:bg-white/90"
            }`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {user.isFollowing ? "Following" : "Follow"}
          </Button>
          <Button
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Message
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-secondary/20 rounded-full p-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Win Rate</span>
            </div>
            <p className="text-2xl font-black text-foreground">{user.stats.winRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {user.stats.totalPicks} total picks
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/20 rounded-full p-2">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">ROI</span>
            </div>
            <p className="text-2xl font-black text-foreground">+{user.stats.roi}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${user.stats.totalStaked.toLocaleString()} staked
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-success/20 rounded-full p-2">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Total Profit</span>
            </div>
            <p className="text-2xl font-black text-success">
              ${user.stats.totalProfit.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All-time earnings</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-accent/20 rounded-full p-2">
                <Flame className="h-4 w-4 text-accent" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Streak</span>
            </div>
            <p className="text-2xl font-black text-foreground">{user.stats.currentStreak}W</p>
            <p className="text-xs text-muted-foreground mt-1">
              Best: {user.stats.bestStreak}
            </p>
          </Card>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Card className="p-3 text-center">
            <p className="text-xl font-black text-foreground">{user.stats.followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-black text-foreground">{user.stats.following}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl font-black text-foreground">{user.stats.avgOdds.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Avg Odds</p>
          </Card>
        </div>
      </div>

      {/* Tabs for different sections */}
      <div className="px-4">
        <Tabs defaultValue="picks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="picks">Picks</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Picks Tab */}
          <TabsContent value="picks" className="space-y-3">
            {user.recentPicks.map((pick) => (
              <Card
                key={pick.id}
                className="overflow-hidden border-2 border-border/50 bg-card"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1">
                          {pick.league}
                        </Badge>
                        {/* Professional WIN/LOST Badge with high contrast */}
                        <Badge
                          className={`text-xs font-black px-3 py-1 shadow-sm ${
                            pick.status === "won"
                              ? "bg-green-600 text-white hover:bg-green-600"
                              : pick.status === "lost"
                                ? "bg-blue-600 text-white hover:bg-blue-600"
                                : "bg-amber-500 text-white hover:bg-amber-500"
                          }`}
                        >
                          {pick.status === "won" && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                          {pick.status === "lost" && <XCircle className="h-3.5 w-3.5 mr-1" />}
                          {pick.status === "pending" && <Clock className="h-3.5 w-3.5 mr-1" />}
                          {pick.status === "won" ? "WON" : pick.status === "lost" ? "LOST" : "PENDING"}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground text-sm">{pick.event}</h3>
                      <p className="text-xs text-muted-foreground">{pick.market}</p>
                    </div>
                    {pick.proofUrl && (
                      <img
                        src={pick.proofUrl}
                        alt="Slip proof"
                        className="w-12 h-12 rounded-lg object-cover border-2 border-border"
                      />
                    )}
                  </div>

                  {/* Pick Details */}
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">
                        {pick.selection}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        @{pick.odds.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Stake: ${pick.stake}</span>
                      <span
                        className={`font-black ${
                          pick.profit > 0 ? "text-green-600" : pick.profit < 0 ? "text-blue-600" : "text-muted-foreground"
                        }`}
                      >
                        {pick.profit > 0 ? "+" : ""}
                        {pick.profit !== 0 ? `$${pick.profit.toFixed(2)}` : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
                      <Calendar className="h-3 w-3" />
                      <span>{pick.date}</span>
                      <span className="text-muted-foreground/60">•</span>
                      <Clock className="h-3 w-3" />
                      <span>Locked {pick.lockTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            {/* Profit Trend */}
            <Card className="p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Profit Trend (6 Months)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={user.earningsChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="loss"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Expected Wins */}
            <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-accent/20 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Expected Wins</h3>
                  <p className="text-xs text-muted-foreground">Based on pending picks</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Potential Profit</p>
                  <p className="text-2xl font-black text-success">$245</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pending Stakes</p>
                  <p className="text-2xl font-black text-foreground">$320</p>
                </div>
              </div>
            </Card>

            {/* Win/Loss Distribution */}
            <Card className="p-4">
              <h3 className="font-bold text-foreground mb-4">Win/Loss Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={user.winLossDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {user.winLossDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            {/* Sport Distribution */}
            <Card className="p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Sport Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={user.sportDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {user.sportDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Avg Stake
                  </span>
                </div>
                <p className="text-xl font-black text-foreground">
                  ${(user.stats.totalStaked / user.stats.totalPicks).toFixed(0)}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-success" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Total Wins
                  </span>
                </div>
                <p className="text-xl font-black text-foreground">
                  {Math.round((user.stats.winRate / 100) * user.stats.totalPicks)}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Total Losses
                  </span>
                </div>
                <p className="text-xl font-black text-foreground">
                  {user.stats.totalPicks - Math.round((user.stats.winRate / 100) * user.stats.totalPicks)}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Avg Win
                  </span>
                </div>
                <p className="text-xl font-black text-foreground">
                  ${(user.stats.totalProfit / Math.round((user.stats.winRate / 100) * user.stats.totalPicks)).toFixed(0)}
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

