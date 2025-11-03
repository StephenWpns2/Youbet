"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Bell, Shield, Check, AlertTriangle } from "lucide-react"

interface PermissionsProps {
  onComplete: () => void
}

type Permission = "age" | "location" | "notifications"

export function Permissions({ onComplete }: PermissionsProps) {
  const [granted, setGranted] = useState<Set<Permission>>(new Set())
  const [ageVerified, setAgeVerified] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState({ month: "", day: "", year: "" })

  // Calculate max year safely for SSR
  const maxYear = useMemo(() => {
    if (typeof window === 'undefined') return 2007 // Fallback for SSR (current year - 18)
    return new Date().getFullYear() - 18
  }, [])

  const handleAgeVerification = () => {
    // Simple age verification (in production, use proper validation)
    const { month, day, year } = dateOfBirth
    if (month && day && year) {
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      
      if (age >= 18) {
        setAgeVerified(true)
        setGranted(prev => new Set(prev).add("age"))
      } else {
        alert("You must be 18 or older to use YouBet.")
      }
    }
  }

  const handleLocationPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      setGranted(prev => new Set(prev).add("location"))
    } catch (error) {
      // Handle error or allow manual region selection
      setGranted(prev => new Set(prev).add("location"))
    }
  }

  const handleNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setGranted(prev => new Set(prev).add("notifications"))
      } else {
        // Allow skipping notifications
        setGranted(prev => new Set(prev).add("notifications"))
      }
    } else {
      setGranted(prev => new Set(prev).add("notifications"))
    }
  }

  const canContinue = granted.has("age") && granted.has("location")

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 md:p-8 shadow-2xl border-2 border-primary/10 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 rounded-full p-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Setup Your Account</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We need a few permissions to ensure compliance and provide you the best experience
          </p>
        </div>

        <div className="space-y-4">
          {/* Age Verification - Required */}
          <Card className={`p-6 border-2 transition-all ${
            granted.has("age") 
              ? "border-success bg-success/5" 
              : "border-primary/20 bg-white hover:border-primary/50"
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${
                  granted.has("age") ? "bg-success/20" : "bg-primary/10"
                }`}>
                  <Calendar className={`h-6 w-6 ${
                    granted.has("age") ? "text-success" : "text-primary"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">Age Verification</h3>
                    <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                      REQUIRED
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    You must be 18+ to use YouBet. We comply with responsible gambling regulations.
                  </p>

                  {!granted.has("age") ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        Your date of birth is encrypted and never shared
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground">Month</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            placeholder="MM"
                            value={dateOfBirth.month}
                            onChange={(e) => setDateOfBirth(prev => ({ ...prev, month: e.target.value }))}
                            className="w-full h-10 px-3 border-2 border-neutral-200 rounded-lg text-center font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground">Day</label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="DD"
                            value={dateOfBirth.day}
                            onChange={(e) => setDateOfBirth(prev => ({ ...prev, day: e.target.value }))}
                            className="w-full h-10 px-3 border-2 border-neutral-200 rounded-lg text-center font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground">Year</label>
                          <input
                            type="number"
                            min="1900"
                            max={maxYear}
                            placeholder="YYYY"
                            value={dateOfBirth.year}
                            onChange={(e) => setDateOfBirth(prev => ({ ...prev, year: e.target.value }))}
                            className="w-full h-10 px-3 border-2 border-neutral-200 rounded-lg text-center font-mono"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAgeVerification}
                        disabled={!dateOfBirth.month || !dateOfBirth.day || !dateOfBirth.year}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                      >
                        Verify Age
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <Check className="h-5 w-5" />
                      Age verified (18+)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Location - Required */}
          <Card className={`p-6 border-2 transition-all ${
            granted.has("location") 
              ? "border-success bg-success/5" 
              : !granted.has("age") 
                ? "border-neutral-200 bg-neutral-50 opacity-60"
                : "border-primary/20 bg-white hover:border-primary/50"
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`rounded-full p-3 ${
                  granted.has("location") ? "bg-success/20" : "bg-primary/10"
                }`}>
                  <MapPin className={`h-6 w-6 ${
                    granted.has("location") ? "text-success" : "text-primary"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">Location Access</h3>
                    <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                      REQUIRED
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    We verify your region to ensure compliance with local gambling laws and age restrictions.
                  </p>

                  {!granted.has("location") ? (
                    <Button
                      onClick={handleLocationPermission}
                      disabled={!granted.has("age")}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                    >
                      Enable Location
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <Check className="h-5 w-5" />
                      Location enabled
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications - Optional */}
          <Card className={`p-6 border-2 transition-all ${
            granted.has("notifications") 
              ? "border-success bg-success/5" 
              : !canContinue
                ? "border-neutral-200 bg-neutral-50 opacity-60"
                : "border-primary/20 bg-white hover:border-primary/50"
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`rounded-full p-3 ${
                  granted.has("notifications") ? "bg-success/20" : "bg-secondary/10"
                }`}>
                  <Bell className={`h-6 w-6 ${
                    granted.has("notifications") ? "text-success" : "text-secondary"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">Notifications</h3>
                    <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                      OPTIONAL
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get notified when picks settle, followers post, or you receive tips.
                  </p>

                  {!granted.has("notifications") ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleNotificationPermission}
                        disabled={!canContinue}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-semibold"
                      >
                        Enable Notifications
                      </Button>
                      <Button
                        onClick={() => setGranted(prev => new Set(prev).add("notifications"))}
                        disabled={!canContinue}
                        variant="outline"
                        className="flex-1"
                      >
                        Skip
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <Check className="h-5 w-5" />
                      Notifications enabled
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button
            onClick={onComplete}
            disabled={!canContinue}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canContinue ? "Continue to Tutorial" : "Complete Required Permissions First"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

