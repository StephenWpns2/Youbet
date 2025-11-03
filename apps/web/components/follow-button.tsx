"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, UserMinus, Loader2 } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface FollowButtonProps {
  targetUserId: string
  targetUsername: string
  initialFollowing?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function FollowButton({
  targetUserId,
  targetUsername,
  initialFollowing = false,
  size = "md",
  variant = "default",
}: FollowButtonProps) {
  const { user } = useUser()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false)

  // Don't show button if viewing own profile
  if (!user || user.id === targetUserId) {
    return null
  }

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      // TODO: Call API endpoint POST /api/users/${targetUserId}/follow
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      
      setIsFollowing(true)
      
      // TODO: Show toast notification
      console.log(`Now following ${targetUsername}`)
    } catch (error) {
      console.error("Failed to follow user:", error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfollow = async () => {
    setIsLoading(true)
    try {
      // TODO: Call API endpoint DELETE /api/users/${targetUserId}/follow
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      
      setIsFollowing(false)
      setShowUnfollowConfirm(false)
      
      // TODO: Show toast notification
      console.log(`Unfollowed ${targetUsername}`)
    } catch (error) {
      console.error("Failed to unfollow user:", error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const buttonSize = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  }[size]

  // Unfollow confirmation state
  if (showUnfollowConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          onClick={handleUnfollow}
          disabled={isLoading}
          className={buttonSize}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserMinus className="h-4 w-4 mr-2" />
              Unfollow
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          onClick={() => setShowUnfollowConfirm(false)}
          className={buttonSize}
        >
          Cancel
        </Button>
      </div>
    )
  }

  // Following state - show "Following" button
  if (isFollowing) {
    return (
      <Button
        variant={variant}
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        onClick={() => setShowUnfollowConfirm(true)}
        disabled={isLoading}
        className={`${buttonSize} group hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all`}
      >
        <UserCheck className="h-4 w-4 mr-2 group-hover:hidden" />
        <UserMinus className="h-4 w-4 mr-2 hidden group-hover:block" />
        <span className="group-hover:hidden">Following</span>
        <span className="hidden group-hover:inline">Unfollow</span>
      </Button>
    )
  }

  // Not following - show "Follow" button
  return (
    <Button
      variant={variant}
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
      className={`${buttonSize} bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      Follow
    </Button>
  )
}

