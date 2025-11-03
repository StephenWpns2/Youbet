"use client"

import { useState } from "react"
import { X, Phone, MessageSquare, UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface AddContactModalProps {
  onClose: () => void
  onSuccess: (phone: string) => void
}

type RequestState = "idle" | "loading" | "success" | "error" | "not_found"

export function AddContactModal({ onClose, onSuccess }: AddContactModalProps) {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [requestState, setRequestState] = useState<RequestState>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    
    // Format as +1 (555) 123-4567
    if (digits.length === 0) return ""
    if (digits.length <= 1) return `+${digits}`
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setRequestState("idle")
    setErrorMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 10) {
      setRequestState("error")
      setErrorMessage("Please enter a valid phone number")
      return
    }

    setRequestState("loading")
    
    try {
      // TODO: Call API endpoint POST /api/contacts/request
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      
      // Simulate different responses
      const random = Math.random()
      if (random > 0.7) {
        // User exists and request sent
        setRequestState("success")
        setTimeout(() => {
          onSuccess(phone)
          onClose()
        }, 2000)
      } else if (random > 0.4) {
        // User not found - will send SMS invite
        setRequestState("not_found")
        setTimeout(() => {
          onSuccess(phone)
          onClose()
        }, 2000)
      } else {
        // Error
        setRequestState("error")
        setErrorMessage("This number has already been invited")
      }
    } catch (error) {
      setRequestState("error")
      setErrorMessage("Failed to send invitation. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Add Contact</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            disabled={requestState === "loading"}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={handlePhoneChange}
              disabled={requestState === "loading" || requestState === "success"}
              className="h-12 text-base"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Enter the phone number they used to sign up
            </p>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Hey! Let's connect on YouBet and share betting tips..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={requestState === "loading" || requestState === "success"}
              className="resize-none h-24"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/200
            </p>
          </div>

          {/* Success Message */}
          {requestState === "success" && (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-success mb-1">Invitation Sent!</p>
                  <p className="text-xs text-muted-foreground">
                    They'll receive a notification to approve your request
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Not Found Message (Will send SMS) */}
          {requestState === "not_found" && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Invitation Sent via SMS</p>
                  <p className="text-xs text-muted-foreground">
                    This number isn't registered yet. We've sent them an SMS invite to join YouBet!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {requestState === "error" && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive mb-1">Error</p>
                  <p className="text-xs text-muted-foreground">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          {requestState === "idle" && (
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground">
                ℹ️ <strong>How it works:</strong> If they're on YouBet, they'll get an in-app notification. 
                If not, we'll send them an SMS invitation to join and connect with you.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={requestState === "loading" || requestState === "success" || !phone || phone.replace(/\D/g, "").length < 10}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold text-base"
          >
            {requestState === "loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Sending Invitation...
              </>
            ) : requestState === "success" ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}

