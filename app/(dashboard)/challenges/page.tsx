"use client"

import React, { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Droplet, Footprints, Dumbbell, Star, CheckCircle } from "lucide-react"

export default function ChallengesPage() {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])

  const challengesList = [
    { id: "ch-hydration", title: "Hydration Hero", type: "Hydration", desc: "Drink at least 3.0 Liters of water daily for 7 days in a row.", reward: "Unlock Forest Fern seed", points: 100, icon: Droplet },
    { id: "ch-steps", title: "Daily Steps Master", type: "Steps", desc: "Reach at least 10,000 steps daily for 7 days in a row.", reward: "Unlock Golden Marigold seed", points: 150, icon: Footprints },
    { id: "ch-workout", title: "Workout Discipline", type: "Workout", desc: "Log 3 active workout splits in a single calendar week.", reward: "Unlock Rare Plant Sprout", points: 200, icon: Dumbbell },
    { id: "ch-consistency", title: "Consistency Star", type: "Consistency", desc: "Maintain a daily consistency score above 80% for 5 days.", reward: "Unlock Wild Rose seed", points: 250, icon: Star }
  ]

  const handleJoin = (id: string) => {
    setJoinedChallenges(prev => [...prev, id])
  }

  const handleClaim = (id: string) => {
    setCompletedChallenges(prev => [...prev, id])
    alert("Reward unlocked successfully! Seed added to your garden catalog.")
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div>
        <h1 className="font-syne text-[32px] font-bold text-text-primary">Challenges & Rewards</h1>
        <p className="text-xs text-text-secondary font-medium">Participate in consistency tasks to earn upgrades for your garden ecosystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {challengesList.map((ch) => {
          const Icon = ch.icon
          const isJoined = joinedChallenges.includes(ch.id)
          const isClaimed = completedChallenges.includes(ch.id)
          
          return (
            <GlassCard key={ch.id} className="flex flex-col justify-between min-h-[300px]">
              {/* Header Group */}
              <div className="flex justify-between items-start mb-sm">
                <div className="flex gap-sm">
                  <div className="w-10 h-10 rounded-sm bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-sm font-bold text-text-primary">{ch.title}</h3>
                    <span className="text-[9px] font-extrabold text-accent-light uppercase tracking-wider block mt-0.5">{ch.type}</span>
                  </div>
                </div>
                {/* Reward points badge - top right, orange outline pill, h-32px */}
                <Badge variant="orange" className="h-[32px] px-4 font-semibold uppercase border border-warning/30 bg-transparent flex-shrink-0">
                  +{ch.points} Pts
                </Badge>
              </div>

              {/* Description */}
              <p className="text-[10px] text-text-secondary leading-relaxed font-semibold mb-sm">
                {ch.desc}
              </p>

              {/* Progress status logs */}
              {isJoined && !isClaimed && (
                <div className="bg-bg-secondary/80 border border-border p-3.5 rounded-sm mb-sm">
                  <div className="flex justify-between text-[9px] font-bold text-text-secondary mb-1">
                    <span>Progress Tracker</span>
                    <span>1 / 7 days</span>
                  </div>
                  <div className="h-1 bg-[#223128] rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "14%" }} />
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border my-sm" />

              {/* Footer Group: Reward & Action button */}
              <div className="flex justify-between items-center mt-sm">
                <div>
                  <span className="text-[8px] text-text-muted uppercase tracking-wider block">Reward Upgrade</span>
                  <span className="text-[10px] font-bold text-accent">{ch.reward}</span>
                </div>
                
                <div className="flex-shrink-0">
                  {isClaimed ? (
                    <span className="text-xs font-bold text-green flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Claimed</span>
                    </span>
                  ) : isJoined ? (
                    <Button size="sm" variant="outline" onClick={() => handleClaim(ch.id)} className="w-auto border-warning/40 text-warning hover:bg-warning/10">
                      Claim Reward
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleJoin(ch.id)} className="w-auto">
                      Join Challenge
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}

