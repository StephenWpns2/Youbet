"use client"

import { useEffect, useState, useMemo } from "react"
import { YouBetLogo } from "./youbet-logo"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Connecting bettors...")
  
  // Generate particle positions once on mount (client-only)
  const particles = useMemo(() => 
    [...Array(30)].map((_, i) => ({
      id: i,
      className: i % 3 === 0
        ? "bg-primary/30 w-3 h-3"
        : i % 3 === 1
          ? "bg-secondary/25 w-2 h-2"
          : "bg-accent/20 w-1.5 h-1.5",
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }))
  , [])

  useEffect(() => {
    const texts = ["Connecting bettors...", "Loading your feed...", "Syncing predictions...", "Almost ready..."]
    let textIndex = 0

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length
      setLoadingText(texts[textIndex])
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite] delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite] delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="animate-[scale-pulse_2s_ease-in-out_infinite]">
          <YouBetLogo size={100} />
        </div>

        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-foreground animate-pulse">{loadingText}</p>
          <p className="text-sm text-muted-foreground font-medium">Building your winning community</p>
        </div>

        <div className="w-80 h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_100%] animate-[shimmer_2s_infinite] transition-all duration-300 ease-out shadow-lg shadow-primary/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <p className="text-lg text-foreground font-bold font-mono tabular-nums">{progress}%</p>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full animate-float ${particle.className}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
