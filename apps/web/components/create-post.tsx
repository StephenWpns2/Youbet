"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"
import { useState } from "react"

export function CreatePost({ onClose }: { onClose: () => void }) {
  const [betType, setBetType] = useState<"prediction" | "result">("prediction")

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <Card className="w-full max-w-lg rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Share Your Bet</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Bet Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={betType === "prediction" ? "default" : "outline"}
              className={`flex-1 ${betType === "prediction" ? "bg-[#FFB84D] hover:bg-[#FF9F1C]" : ""}`}
              onClick={() => setBetType("prediction")}
            >
              Prediction
            </Button>
            <Button
              variant={betType === "result" ? "default" : "outline"}
              className={`flex-1 ${betType === "result" ? "bg-[#FFB84D] hover:bg-[#FF9F1C]" : ""}`}
              onClick={() => setBetType("result")}
            >
              Result
            </Button>
          </div>

          {/* Sport */}
          <div>
            <Label htmlFor="sport" className="text-foreground">
              Sport
            </Label>
            <Input id="sport" placeholder="e.g., NBA, NFL, Premier League" className="mt-1" />
          </div>

          {/* Teams/Match */}
          <div>
            <Label htmlFor="teams" className="text-foreground">
              Teams / Match
            </Label>
            <Input id="teams" placeholder="e.g., Lakers vs Warriors" className="mt-1" />
          </div>

          {/* Odds & Stake */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="odds" className="text-foreground">
                Odds
              </Label>
              <Input id="odds" placeholder="+150" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="stake" className="text-foreground">
                Stake ($)
              </Label>
              <Input id="stake" type="number" placeholder="100" className="mt-1" />
            </div>
          </div>

          {/* Market */}
          <div>
            <Label htmlFor="market" className="text-foreground">
              Market
            </Label>
            <Input id="market" placeholder="e.g., Moneyline, Spread, Over/Under" className="mt-1" />
          </div>

          {/* Bookmaker */}
          <div>
            <Label htmlFor="bookmaker" className="text-foreground">
              Bookmaker
            </Label>
            <Input id="bookmaker" placeholder="e.g., DraftKings, FanDuel" className="mt-1" />
          </div>

          {/* Upload Slip */}
          <div>
            <Label className="text-foreground">Betting Slip (Optional)</Label>
            <div className="mt-1 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#FFB84D] bg-[#FFF5E1] p-6 transition-colors hover:bg-[#FFE8B8]">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-[#FFB84D]" />
                <p className="mt-2 text-sm text-muted-foreground">Upload image or paste link</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button className="w-full bg-gradient-to-r from-[#FFB84D] to-[#FF9F1C] py-6 text-lg font-bold text-white hover:from-[#FF9F1C] hover:to-[#FFB84D]">
            Share Bet
          </Button>
        </div>
      </Card>
    </div>
  )
}
