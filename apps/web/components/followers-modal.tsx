"use client"

import { useState } from "react"
import { X, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { FollowButton } from "./follow-button"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  username: string
  avatar?: string
  roi: number
  isFollowing: boolean
  followsYou: boolean
}

interface FollowersModalProps {
  type: "followers" | "following"
  userId: string
  onClose: () => void
}

// Mock data - will be replaced with API call
const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "@sarahc",
    avatar: "https://i.pravatar.cc/150?img=5",
    roi: 18.2,
    isFollowing: true,
    followsYou: true,
  },
  {
    id: "2",
    name: "Alex Rivera",
    username: "@alexr",
    avatar: "https://i.pravatar.cc/150?img=33",
    roi: 31.8,
    isFollowing: false,
    followsYou: false,
  },
  {
    id: "3",
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "https://i.pravatar.cc/150?img=12",
    roi: 23.5,
    isFollowing: true,
    followsYou: false,
  },
]

export function FollowersModal({ type, userId, onClose }: FollowersModalProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>(mockUsers)

  // TODO: Fetch users from API based on type
  // useEffect(() => {
  //   fetchUsers(userId, type)
  // }, [userId, type])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const title = type === "followers" ? "Followers" : "Following"
  const count = filteredUsers.length

  const handleUserClick = (username: string) => {
    onClose()
    router.push(`/profile/${username.replace("@", "")}`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-foreground">
            {title} ({count})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "No users found" : `No ${title.toLowerCase()} yet`}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                {/* Avatar */}
                <div
                  className="cursor-pointer"
                  onClick={() => handleUserClick(user.username)}
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/30">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-white font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleUserClick(user.username)}
                >
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{user.username}</span>
                    {user.followsYou && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-semibold">
                        Follows you
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ROI: <span className="text-success font-semibold">+{user.roi}%</span>
                  </p>
                </div>

                {/* Follow Button */}
                <FollowButton
                  targetUserId={user.id}
                  targetUsername={user.name}
                  initialFollowing={user.isFollowing}
                  size="sm"
                  variant="outline"
                />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

