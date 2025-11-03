"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, Phone, KeyRound, ArrowRight, Shield, Apple, User } from "lucide-react"
import { YouBetLogo } from "@/components/youbet-logo"

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

type SignInStep = "credentials" | "name" | "otp" | "verifying" | "social"

interface SignInProps {
  onComplete: (userData: { name: string; email: string; phone: string }) => void
}

export function SignIn({ onComplete }: SignInProps) {
  const [step, setStep] = useState<SignInStep>("credentials")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate OTP send
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setStep("name")
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
    setStep("otp")
  }

  const handleAppleSignIn = async () => {
    setIsLoading(true)
    setStep("verifying")
    
    // Simulate Apple Sign In
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For social login, generate a default name
    onComplete({
      name: "Apple User",
      email: "user@apple.com",
      phone: ""
    })
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setStep("verifying")
    
    // Simulate Google Sign In
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For social login, generate a default name
    onComplete({
      name: "Google User",
      email: "user@gmail.com",
      phone: ""
    })
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStep("verifying")
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    onComplete({ name, email, phone })
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md p-8 shadow-2xl border-2 border-primary/10 bg-white/95 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center gap-2">
            <YouBetLogo size={80} />
            <div className="text-center">
              <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                YouBet
              </h1>
              <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                Win Together
              </p>
            </div>
          </div>
        </div>

        {/* Credentials Step */}
        {step === "credentials" && (
          <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">
                Enter your details to continue your winning streak
              </p>
            </div>

            {/* Social Sign In Options */}
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-black hover:bg-black/90 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Apple className="h-5 w-5 fill-current" />
                Continue with Apple
              </Button>
              
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl flex items-center justify-center gap-2 border-2 border-gray-200 shadow-sm"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-semibold">
                  Or continue with phone
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-2 border-neutral-200 focus:border-primary rounded-xl"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12 border-2 border-neutral-200 focus:border-primary rounded-xl"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                We'll send a one-time code to verify your number
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || !email || !phone}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Code...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <button type="button" className="text-primary font-semibold hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </button>
            </p>
          </form>
        )}

        {/* Name Input Step */}
        {step === "name" && (
          <form onSubmit={handleNameSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-foreground">What's Your Name?</h2>
              <p className="text-sm text-muted-foreground">
                Help us personalize your YouBet experience
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-2 border-neutral-200 focus:border-primary rounded-xl"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This is how you'll appear to other users
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            <Button
              variant="link"
              onClick={() => setStep("credentials")}
              disabled={isLoading}
              className="w-full text-sm text-muted-foreground"
            >
              ← Back
            </Button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-4">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Verify Your Phone</h2>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to
              </p>
              <p className="text-sm font-semibold text-foreground">{phone}</p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-neutral-200 focus:border-primary rounded-xl"
                  />
                ))}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary font-semibold hover:underline"
                  onClick={() => {
                    // Resend OTP logic
                  }}
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || otp.some(d => !d)}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Verify & Continue
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            {/* Back */}
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign in
            </button>
          </form>
        )}

        {/* Verifying Step */}
        {step === "verifying" && (
          <div className="space-y-6 animate-in fade-in duration-500 text-center py-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-20 w-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Verifying Your Account</h2>
              <p className="text-sm text-muted-foreground">Please wait while we set up your profile...</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

