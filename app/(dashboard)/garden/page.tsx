"use client"

import React, { useState } from "react"
import { useGardenStore } from "@/store/useGardenStore"
import { useUserStore } from "@/store/useUserStore"
import { GardenWidget } from "@/components/garden/GardenWidget"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Sprout, Droplet, Sun } from "lucide-react"

export default function GardenPage() {
  const profile = useUserStore((s) => s.profile)
  const growthStage = useGardenStore((s) => s.growthStage)
  const waterLevel = useGardenStore((s) => s.waterLevel)
  const sunlightLevel = useGardenStore((s) => s.sunlightLevel)
  const plants = useGardenStore((s) => s.plants)
  const consistencyScore = useGardenStore((s) => s.consistencyScore)
  const unlockNewPlant = useGardenStore((s) => s.unlockNewPlant)
  const updateGardenState = useGardenStore((s) => s.updateGardenState)

  const [activeCatalogPlant, setActiveCatalogPlant] = useState<any | null>(null)

  const plantCatalog = [
    { id: "plant-sage", name: "Sage Shrub", cost: 10, desc: "A hearty native green bush reflecting general health." },
    { id: "plant-fern", name: "Forest Fern", cost: 25, desc: "Requires persistent watering and hydration consistency." },
    { id: "plant-marigold", name: "Golden Marigold", cost: 50, desc: "A vibrant yellow orange flower indicating long streaks." },
    { id: "plant-aloe", name: "Medicinal Aloe", cost: 75, desc: "Unlocked via physical rehabilitation and recovery consistency." },
    { id: "plant-rose", name: "Wild Rose", cost: 100, desc: "Extremely rare red flower representing absolute peak transformations." }
  ]

  const handleUnlockPlant = async (plant: any) => {
    if (!profile?.id) return
    
    if (consistencyScore < 80) {
      alert("You need a daily consistency score above 80% to unlock new plants!")
      return
    }

    await unlockNewPlant(profile.id, plant.id, plant.name)
    setActiveCatalogPlant(null)
  }

  const handleTriggerGrowth = async () => {
    if (!profile?.id) return
    const nextStage = Math.min(4, growthStage + 1)
    await updateGardenState(profile.id, { growthStage: nextStage })
  }

  const handleResetGarden = async () => {
    if (!profile?.id) return
    await updateGardenState(profile.id, { growthStage: 0, plants: [] })
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne text-[32px] font-bold text-text-primary">Transformation Garden</h1>
          <p className="text-xs text-text-secondary font-medium">Your living digital ecosystem grown through fitness habits</p>
        </div>
        <div className="flex gap-sm">
          <Button variant="outline" size="sm" onClick={handleResetGarden} className="w-auto border-red/20 text-red hover:bg-red/5">
            Reset
          </Button>
          <Button size="sm" onClick={handleTriggerGrowth} className="w-auto shadow-sm">
            Evolve Tree
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left column: full page garden canvas */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <GardenWidget
            growthStage={growthStage}
            consistencyScore={consistencyScore}
            waterLevel={waterLevel}
            plants={plants}
            interactive={true}
          />

          {/* Environmental metrics card details */}
          <div className="grid grid-cols-3 gap-md">
            <GlassCard className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-sm bg-accent/10 text-accent flex items-center justify-center mb-2">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">Consistency</span>
              <span className="text-base font-extrabold text-text-primary mt-1">{consistencyScore}%</span>
            </GlassCard>
            <GlassCard className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-sm bg-blue/10 text-blue flex items-center justify-center mb-2">
                <Droplet className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">Hydration</span>
              <span className="text-base font-extrabold text-text-primary mt-1">{waterLevel}%</span>
            </GlassCard>
            <GlassCard className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-sm bg-orange/10 text-orange flex items-center justify-center mb-2">
                <Sun className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">Sunlight</span>
              <span className="text-base font-extrabold text-text-primary mt-1">{sunlightLevel}%</span>
            </GlassCard>
          </div>
        </div>

        {/* Right column: Plant shop catalog and settings */}
        <div className="flex flex-col gap-md">
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary">Unlock Plants</h3>
            <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
              When your daily consistency is <strong className="text-green">above 80%</strong>, you can materialize rare seedlings in your ecosystem.
            </p>

            <div className="flex flex-col gap-sm">
              {plantCatalog.map((plant) => {
                const isUnlocked = plants.some(p => p.plantId === plant.id)
                // Determine lock state if user's score is too low and it isn't placed yet
                const isLocked = !isUnlocked && consistencyScore < 80
                
                return (
                  <div 
                    key={plant.id} 
                    onClick={() => setActiveCatalogPlant(plant)}
                    className={`p-lg rounded-sm border transition-all cursor-pointer flex justify-between items-center h-[76px] ${
                      activeCatalogPlant?.id === plant.id 
                        ? "border-accent bg-accent/10" 
                        : "border-border bg-bg-secondary/60 hover:border-accent"
                    }`}
                  >
                    <div className="truncate pr-4">
                      <span className="text-xs font-bold text-text-primary block">{plant.name}</span>
                      <span className="text-[9px] text-text-muted font-semibold block truncate max-w-[140px] mt-0.5">{plant.desc}</span>
                    </div>
                    
                    {/* Equal Height Badges logic */}
                    {isUnlocked ? (
                      <Badge variant="green" className="h-[32px] px-4 font-semibold">Placed</Badge>
                    ) : isLocked ? (
                      <Badge variant="glass" className="h-[32px] px-4 font-semibold border-border text-text-muted bg-transparent">Locked</Badge>
                    ) : (
                      <Badge variant="orange" className="h-[32px] px-4 font-semibold border-warning/40 text-warning bg-transparent">Unlock</Badge>
                    )}
                  </div>
                )
              })}
            </div>

            {activeCatalogPlant && (
              <div className="mt-2 p-3.5 rounded-sm bg-bg-secondary/60 border border-accent/20 flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-text-primary">{activeCatalogPlant.name}</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">{activeCatalogPlant.desc}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-bold text-text-muted">Requirements: Score &gt; 80%</span>
                  <Button 
                    size="sm" 
                    onClick={() => handleUnlockPlant(activeCatalogPlant)} 
                    className="w-auto"
                    disabled={consistencyScore < 80}
                  >
                    Place Seedling
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

