"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { SignIn } from "@/components/auth/sign-in"
import { PrivacyPolicy } from "@/components/auth/privacy-policy"
import { Permissions } from "@/components/auth/permissions"
import { Tutorial } from "@/components/auth/tutorial"
import { HomeFeed } from "@/components/home-feed"
import { CreatePost } from "@/components/create-post"
import { UserProfile } from "@/components/user-profile"
import { MessagingApp } from "@/components/messaging-app"
import { Dashboard } from "@/components/dashboard"
import { Discovery } from "@/components/discovery"
import { ContactsScreen } from "@/components/contacts-screen"
import { BottomNav } from "@/components/bottom-nav"
import { useUser } from "@/contexts/user-context"
import { AppLayout } from "@/components/app-layout"

type OnboardingStep = "loading" | "sign-in" | "privacy" | "permissions" | "tutorial" | "app"

function AppContent() {
  const { setUser } = useUser()
  const [step, setStep] = useState<OnboardingStep>("loading")
  const [activeTab, setActiveTab] = useState<"home" | "discover" | "chat" | "profile" | "dashboard" | "contacts">("home")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on client side and restore state from localStorage
  useEffect(() => {
    setIsClient(true)
    
    // Restore onboarding step from localStorage
    const savedStep = localStorage.getItem('onboarding-step')
    if (savedStep && savedStep !== 'loading') {
      setStep(savedStep as OnboardingStep)
    }
    
    // Restore active tab
    const savedTab = localStorage.getItem('active-tab')
    if (savedTab) {
      setActiveTab(savedTab as typeof activeTab)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isClient && step !== 'loading') {
      localStorage.setItem('onboarding-step', step)
    }
  }, [step, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('active-tab', activeTab)
    }
  }, [activeTab, isClient])

  const handleSignInComplete = (userData: { name: string; email: string; phone: string }) => {
    // Create user profile
    const userProfile = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      totalBets: 0,
      winRate: 0,
      roi: 0,
      streak: 0,
    }
    setUser(userProfile)
    setStep("privacy")
  }

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return null
  }

  // Loading Screen
  if (step === "loading") {
    return <LoadingScreen onComplete={() => setStep("sign-in")} />
  }

  // Sign In with OTP
  if (step === "sign-in") {
    return <SignIn onComplete={handleSignInComplete} />
  }

  // Privacy Policy & Terms
  if (step === "privacy") {
    return <PrivacyPolicy onAccept={() => setStep("permissions")} />
  }

  // Permissions (Age, Location, Notifications)
  if (step === "permissions") {
    return <Permissions onComplete={() => setStep("tutorial")} />
  }

  // Tutorial/Onboarding
  if (step === "tutorial") {
    return <Tutorial onComplete={() => setStep("app")} />
  }

  // Main App
  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-20">
        {activeTab === "home" && <HomeFeed onCreatePost={() => setShowCreatePost(true)} />}
        {activeTab === "discover" && <Discovery />}
        {activeTab === "contacts" && <ContactsScreen />}
        {activeTab === "chat" && <MessagingApp />}
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "dashboard" && <Dashboard />}

        {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </AppLayout>
  )
}

export default function Page() {
  return <AppContent />
}
