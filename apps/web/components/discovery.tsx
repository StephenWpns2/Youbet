"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Flame, Calendar, Newspaper, ChevronRight, Users, Trophy, Clock } from "lucide-react"

export function Discovery() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Sports", icon: Trophy },
    { id: "football", label: "Football", icon: Trophy },
    { id: "basketball", label: "Basketball", icon: Trophy },
    { id: "tennis", label: "Tennis", icon: Trophy },
    { id: "mma", label: "MMA", icon: Trophy },
  ]

  const trendingGames = [
    {
      id: 1,
      sport: "Premier League",
      match: "Man City vs Arsenal",
      time: "Today, 8:00 PM",
      bettors: 2847,
      trending: true,
      odds: { home: 2.1, draw: 3.4, away: 3.2 },
    },
    {
      id: 2,
      sport: "NBA",
      match: "Lakers vs Warriors",
      time: "Today, 10:30 PM",
      bettors: 1923,
      trending: true,
      odds: { home: 1.85, away: 1.95 },
    },
    {
      id: 3,
      sport: "Champions League",
      match: "Real Madrid vs Bayern",
      time: "Tomorrow, 9:00 PM",
      bettors: 3421,
      trending: true,
      odds: { home: 2.3, draw: 3.1, away: 2.9 },
    },
  ]

  const upcomingGames = [
    {
      id: 1,
      sport: "La Liga",
      match: "Barcelona vs Atletico",
      time: "Tomorrow, 4:00 PM",
      category: "football",
    },
    {
      id: 2,
      sport: "NBA",
      match: "Celtics vs Heat",
      time: "Tomorrow, 7:30 PM",
      category: "basketball",
    },
    {
      id: 3,
      sport: "UFC 300",
      match: "Jones vs Miocic",
      time: "Sat, 11:00 PM",
      category: "mma",
    },
    {
      id: 4,
      sport: "ATP Finals",
      match: "Djokovic vs Alcaraz",
      time: "Sun, 3:00 PM",
      category: "tennis",
    },
  ]

  const sportsNews = [
    {
      id: 1,
      title: "Man City's Haaland breaks Premier League scoring record",
      source: "ESPN",
      time: "2h ago",
      image: "/football-celebration.png",
      category: "Football",
    },
    {
      id: 2,
      title: "LeBron James reaches 40,000 career points milestone",
      source: "NBA.com",
      time: "4h ago",
      image: "/basketball-player-action.png",
      category: "Basketball",
    },
    {
      id: 3,
      title: "Surprise upset: Underdog wins by knockout in Round 2",
      source: "MMA Fighting",
      time: "6h ago",
      image: "/mma-fight.jpg",
      category: "MMA",
    },
  ]

  const popularBettors = [
    {
      id: 1,
      name: "BetKing_Pro",
      avatar: "/male-avatar.png",
      winRate: 78,
      followers: 12400,
      roi: "+245%",
    },
    {
      id: 2,
      name: "SportsGuru",
      avatar: "/diverse-female-avatar.png",
      winRate: 72,
      followers: 9800,
      roi: "+189%",
    },
    {
      id: 3,
      name: "OddsWizard",
      avatar: "/male-avatar-2.png",
      winRate: 69,
      followers: 8200,
      roi: "+156%",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Discover</h1>
            <p className="text-sm text-muted-foreground">Trending games & sports news</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <TrendingUp className="h-5 w-5 text-primary" />
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="shrink-0 rounded-full"
              >
                <Icon className="mr-1 h-3 w-3" />
                {cat.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="space-y-6 p-4">
        {/* Trending Games Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-bold">Trending Now</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {trendingGames.map((game, index) => (
              <Card
                key={game.id}
                className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5 transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
                        {game.sport}
                      </Badge>
                      <h3 className="text-lg font-bold">{game.match}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {game.time}
                      </div>
                    </div>
                    <Badge variant="destructive" className="gap-1">
                      <Flame className="h-3 w-3" />
                      Hot
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{game.bettors.toLocaleString()}</span> betting
                    </div>
                    <div className="flex gap-2">
                      {game.odds.home && (
                        <Badge variant="outline" className="font-mono">
                          {game.odds.home}
                        </Badge>
                      )}
                      {game.odds.draw && (
                        <Badge variant="outline" className="font-mono">
                          {game.odds.draw}
                        </Badge>
                      )}
                      {game.odds.away && (
                        <Badge variant="outline" className="font-mono">
                          {game.odds.away}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Games Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Upcoming Games</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {upcomingGames.map((game, index) => (
              <Card
                key={game.id}
                className="group cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {game.sport}
                  </Badge>
                  <h3 className="font-semibold leading-tight group-hover:text-primary">{game.match}</h3>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {game.time}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Sports News Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Sports News</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {sportsNews.map((news, index) => (
              <Card
                key={news.id}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-1 text-xs">
                      {news.category}
                    </Badge>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
                      {news.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Bettors Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Top Bettors</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {popularBettors.map((bettor, index) => (
              <Card
                key={bettor.id}
                className="group cursor-pointer transition-all hover:scale-[1.01] hover:border-primary/50 hover:shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={bettor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{bettor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary">{bettor.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {bettor.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{bettor.roi}</div>
                    <div className="text-xs text-muted-foreground">{bettor.winRate}% Win Rate</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
