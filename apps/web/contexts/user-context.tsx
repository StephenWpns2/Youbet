"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  dateOfBirth?: string
  region?: string
  createdAt: string
  // Betting stats
  totalBets?: number
  winRate?: number
  roi?: number
  streak?: number
}

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  updateUser: (updates: Partial<UserProfile>) => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('youbet-user')
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('youbet-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('youbet-user')
    }
  }, [user])

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser)
  }

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUserState({ ...user, ...updates })
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

