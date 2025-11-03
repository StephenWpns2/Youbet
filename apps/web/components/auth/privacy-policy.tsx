"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Lock, Eye, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface PrivacyPolicyProps {
  onAccept: () => void
}

export function PrivacyPolicy({ onAccept }: PrivacyPolicyProps) {
  const [hasRead, setHasRead] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50
    if (isNearBottom && !hasRead) {
      setHasRead(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 md:p-8 shadow-2xl border-2 border-primary/10 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 rounded-full p-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Privacy & Terms</h1>
          <p className="text-sm text-muted-foreground">
            Your privacy matters. Please review our policies before continuing.
          </p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5">
            <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Data Security</h3>
              <p className="text-xs text-muted-foreground">Your information is encrypted and protected</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/5">
            <Eye className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-foreground">No Sharing</h3>
              <p className="text-xs text-muted-foreground">We never sell your data to third parties</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-success/5">
            <FileText className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Your Rights</h3>
              <p className="text-xs text-muted-foreground">Access, export, or delete your data anytime</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <ScrollArea 
          className="h-64 md:h-80 rounded-xl border-2 border-neutral-200 p-6 mb-6 bg-neutral-50"
          onScrollCapture={handleScroll}
        >
          <div className="space-y-4 text-sm text-foreground">
            <section>
              <h2 className="font-bold text-lg text-primary mb-2">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-2">
                We collect information you provide directly, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Email address and phone number for authentication</li>
                <li>Betting predictions and picks you share</li>
                <li>Comments, likes, and social interactions</li>
                <li>Profile information (username, bio, avatar)</li>
                <li>Location data for age and region verification</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">2. How We Use Your Data</h2>
              <p className="text-muted-foreground mb-2">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Provide and improve our betting community platform</li>
                <li>Calculate and display your betting statistics (ROI, win rate)</li>
                <li>Verify your age and location for compliance</li>
                <li>Send you OTP codes and important account notifications</li>
                <li>Prevent fraud and ensure platform safety</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">3. Data Sharing & Disclosure</h2>
              <p className="text-muted-foreground mb-2">
                We do NOT sell your personal data. We may share data only:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers (hosting, analytics) under strict agreements</li>
                <li>In aggregated, anonymized form for research</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">4. Your Rights</h2>
              <p className="text-muted-foreground mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Access all your personal data</li>
                <li>Export your data in portable format</li>
                <li>Request correction of inaccurate data</li>
                <li>Delete your account and all associated data</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">5. Responsible Gambling</h2>
              <p className="text-muted-foreground mb-2">
                <strong>Important:</strong> YouBet does not facilitate gambling transactions. We are a 
                social platform for sharing predictions. All betting must be done through licensed 
                sportsbooks. We enforce age restrictions and provide responsible gambling resources.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">6. Cookies & Tracking</h2>
              <p className="text-muted-foreground mb-2">
                We use essential cookies for authentication and preferences. Analytics cookies help us 
                improve the platform. You can control cookies in your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">7. Data Retention</h2>
              <p className="text-muted-foreground mb-2">
                We retain your data while your account is active and for 30 days after deletion to 
                comply with legal obligations and prevent fraud.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">8. Children's Privacy</h2>
              <p className="text-muted-foreground mb-2">
                YouBet is restricted to users 18+ (21+ in some regions). We do not knowingly collect 
                data from minors. If we discover underage usage, we will delete the account immediately.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">9. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-2">
                We may update this policy. We'll notify you of significant changes via email or 
                in-app notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg text-primary mb-2">10. Contact Us</h2>
              <p className="text-muted-foreground">
                Questions about privacy? Email us at{" "}
                <a href="mailto:privacy@youbet.com" className="text-primary font-semibold hover:underline">
                  privacy@youbet.com
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Last Updated: November 2, 2025
              </p>
            </section>
          </div>
        </ScrollArea>

        {/* Scroll Indicator */}
        {!hasRead && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground animate-pulse">
            <AlertCircle className="h-4 w-4" />
            Please scroll to read the full policy
          </div>
        )}

        {hasRead && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            You've read the complete policy
          </div>
        )}

        {/* Acceptance Checkbox */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
            <Checkbox
              id="accept"
              checked={hasAccepted}
              onCheckedChange={(checked) => setHasAccepted(checked === true)}
              disabled={!hasRead}
              className="mt-1"
            />
            <label
              htmlFor="accept"
              className="text-sm text-foreground leading-relaxed cursor-pointer"
            >
              I have read and agree to the{" "}
              <span className="font-bold text-primary">Privacy Policy</span> and{" "}
              <span className="font-bold text-primary">Terms of Service</span>. I understand that 
              YouBet is for users 18+ and does not process gambling transactions.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onAccept}
            disabled={!hasAccepted}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept & Continue
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              I don't accept (close app)
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

