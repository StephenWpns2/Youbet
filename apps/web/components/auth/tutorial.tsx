"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Trophy, 
  Plus,
  BarChart3,
  Heart,
  ArrowRight,
  Check
} from "lucide-react"

interface TutorialProps {
  onComplete: () => void
}

const tutorialSteps = [
  {
    id: 1,
    title: "Share Your Picks",
    description: "Post your betting predictions with proof. Add odds, stake, and the book you're using. Picks auto-lock when the event starts.",
    icon: Plus,
    color: "primary",
    features: [
      "Upload slip screenshots or paste bet links",
      "Track predictions vs results",
      "Build your transparent track record"
    ]
  },
  {
    id: 2,
    title: "Follow Top Bettors",
    description: "Discover winning bettors and follow their picks. See their ROI, win rate, and recent performance.",
    icon: Users,
    color: "secondary",
    features: [
      "Browse leaderboards by sport and timeframe",
      "Get notifications when they post",
      "See their complete pick history"
    ]
  },
  {
    id: 3,
    title: "Engage & Discuss",
    description: "Like, comment, and share picks. Join sport-specific communities to discuss predictions with fellow fans.",
    icon: MessageCircle,
    color: "success",
    features: [
      "React with fire, celebrate, or thinking emojis",
      "Discuss picks in comment threads",
      "Join league and team chat channels"
    ]
  },
  {
    id: 4,
    title: "Track Your Stats",
    description: "View detailed analytics: ROI trend, win rate, profit by sport, and more. See 30-day and lifetime performance.",
    icon: BarChart3,
    color: "primary",
    features: [
      "Visualize your betting performance over time",
      "Compare yourself to the community",
      "Identify your most profitable sports"
    ]
  },
  {
    id: 5,
    title: "Important Reminders",
    description: "YouBet is a social platform—not a sportsbook. We don't process bets. Always gamble responsibly.",
    icon: Trophy,
    color: "destructive",
    features: [
      "Deep links redirect to licensed sportsbooks",
      "Set personal limits and take breaks",
      "Access responsible gambling resources anytime"
    ]
  }
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = tutorialSteps[currentStep]
  const Icon = step.icon

  const isLastStep = currentStep === tutorialSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-2xl p-6 md:p-8 shadow-2xl border-2 border-primary/10 bg-white/95 backdrop-blur-sm">
        {/* Progress Dots */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {tutorialSteps.map((s, index) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? "w-8 bg-primary" 
                  : index < currentStep 
                    ? "w-2 bg-success" 
                    : "w-2 bg-neutral-200"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" key={currentStep}>
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`rounded-full p-6 ${
              step.color === "primary" ? "bg-primary/10" :
              step.color === "secondary" ? "bg-secondary/10" :
              step.color === "success" ? "bg-success/10" :
              "bg-destructive/10"
            }`}>
              <Icon className={`h-16 w-16 ${
                step.color === "primary" ? "text-primary" :
                step.color === "secondary" ? "text-secondary" :
                step.color === "success" ? "text-success" :
                "text-destructive"
              }`} />
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-foreground">{step.title}</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 bg-neutral-50 rounded-xl p-6">
            {step.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 animate-in fade-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`rounded-full p-1 mt-0.5 ${
                  step.color === "primary" ? "bg-primary/20" :
                  step.color === "secondary" ? "bg-secondary/20" :
                  step.color === "success" ? "bg-success/20" :
                  "bg-destructive/20"
                }`}>
                  <Check className={`h-4 w-4 ${
                    step.color === "primary" ? "text-primary" :
                    step.color === "secondary" ? "text-secondary" :
                    step.color === "success" ? "text-success" :
                    "text-destructive"
                  }`} />
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          {/* Special Message for Last Step */}
          {isLastStep && (
            <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4">
              <p className="text-sm text-center text-foreground font-semibold">
                🎉 You're all set! Let's start building your winning community.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 space-y-3">
          <div className="flex gap-3">
            {/* Previous Button */}
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                variant="outline"
                className="flex-1 h-12 font-semibold"
              >
                Previous
              </Button>
            )}

            {/* Next/Get Started Button */}
            <Button
              onClick={handleNext}
              className={`h-12 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                currentStep > 0 ? "flex-1" : "w-full"
              } ${
                isLastStep 
                  ? "bg-gradient-to-r from-success to-primary hover:from-success/90 hover:to-primary/90 text-white"
                  : "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {isLastStep ? "Get Started" : "Next"}
                <ArrowRight className="h-5 w-5" />
              </div>
            </Button>
          </div>

          {/* Skip Button */}
          {!isLastStep && (
            <div className="text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Skip tutorial
              </button>
            </div>
          )}
        </div>

        {/* Step Counter */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Step {currentStep + 1} of {tutorialSteps.length}
          </p>
        </div>
      </Card>
    </div>
  )
}

