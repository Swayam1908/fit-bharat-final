"use client"

import React, { useState } from "react"
import { useUserStore } from "@/store/useUserStore"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Settings as SettingsIcon, Save, Sparkles } from "lucide-react"

export default function SettingsPage() {
  const profile = useUserStore((s) => s.profile)
  const updateProfile = useUserStore((s) => s.updateProfile)

  const [name, setName] = useState(profile?.name || "Swayam Gurjar")
  const [age, setAge] = useState(profile?.age || 20)
  const [height, setHeight] = useState(profile?.height || 175)
  const [weight, setWeight] = useState(profile?.weight || 68.5)
  const [targetWeight, setTargetWeight] = useState(profile?.target_weight || 63.0)
  const [goalType, setGoalType] = useState(profile?.goal_type || "Gain Muscle")
  const [activityLevel, setActivityLevel] = useState(profile?.activity_level || "Moderately Active")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.id) return
    setIsSaving(true)

    await updateProfile(profile.id, {
      name,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      target_weight: Number(targetWeight),
      goal_type: goalType,
      activity_level: activityLevel
    })

    setIsSaving(false)
    alert("Profile settings updated successfully!")
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div>
        <h1 className="font-syne text-[32px] font-bold text-text-primary">Account Settings</h1>
        <p className="text-xs text-text-secondary font-medium">Modify your physical stats, goals, and visual dashboard choices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left column: general profile details form */}
        <div className="lg:col-span-2">
          <GlassCard>
            <form onSubmit={handleSave} className="flex flex-col gap-sm">
              <h3 className="font-syne text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                <SettingsIcon className="h-4.5 w-4.5 text-accent" />
                <span>Personal Metrics</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <Input
                  label="Display Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Age (Years)"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-md">
                <Input
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  required
                />
                <Input
                  label="Current Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                />
                <Input
                  label="Target Weight (kg)"
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <Select
                  label="Goal Target Type"
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  options={[
                    { value: "Lose Weight", label: "Lose Weight" },
                    { value: "Gain Muscle", label: "Gain Muscle" },
                    { value: "Stay Fit", label: "Stay Fit" }
                  ]}
                />
                <Select
                  label="Activity Index"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  options={[
                    { value: "Sedentary", label: "Sedentary" },
                    { value: "Lightly Active", label: "Lightly Active" },
                    { value: "Moderately Active", label: "Moderately Active" },
                    { value: "Very Active", label: "Very Active" }
                  ]}
                />
              </div>

              <div className="border-t border-border pt-4 flex justify-end">
                <Button type="submit" isLoading={isSaving} className="w-auto flex gap-2 justify-center items-center py-2.5 px-6">
                  <Save className="h-4.5 w-4.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right column: general layout toggles and theme settings */}
        <div className="flex flex-col gap-md">
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary">Interface Settings</h3>
            
            <div className="flex justify-between items-center p-3.5 rounded-sm bg-bg-secondary/80 border border-border">
              <div>
                <span className="text-xs font-bold text-text-primary block">Toggle Interface Theme</span>
                <span className="text-[9px] text-text-muted font-bold block mt-0.5">Switch between Light and Dark mode</span>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-sm bg-bg-secondary/80 border border-border">
              <div>
                <span className="text-xs font-bold text-text-primary block">Notifications Alerts</span>
                <span className="text-[9px] text-text-muted font-bold block mt-0.5">Enable desktop push notices</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-accent h-4 w-4" />
            </div>
          </GlassCard>

          {/* AI Info segment */}
          <GlassCard className="bg-gradient-to-br from-accent/10 to-accent-light/5 border border-accent/20">
            <h3 className="font-syne text-xs font-bold text-accent mb-1 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 fill-current" />
              <span>Personalization</span>
            </h3>
            <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
              Your calorie and macronutrient suggestions are computed automatically using Mifflin-St Jeor and modified by your physical activity levels.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

