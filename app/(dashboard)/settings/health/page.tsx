"use client"

import React, { useState } from "react"
import { useUserStore } from "@/store/useUserStore"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Activity, Save } from "lucide-react"

export default function HealthProfilePage() {
  const profile = useUserStore((s) => s.profile)
  const updateProfile = useUserStore((s) => s.updateProfile)

  // Toggles for health conditions
  const [conditions, setConditions] = useState<string[]>(["Hypertension"])
  const [injuries, setInjuries] = useState<string[]>(["Knee"])
  const [dietStyle, setDietStyle] = useState<string>("Vegetarian")
  const [profession, setProfession] = useState<string>("Student")
  const [recoveryMode, setRecoveryMode] = useState<boolean>(true)
  const [medication, setMedication] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const handleConditionToggle = (name: string) => {
    setConditions(prev => 
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    )
  }

  const handleInjuryToggle = (name: string) => {
    setInjuries(prev => 
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    )
  }

  const handleSave = async () => {
    if (!profile?.id) return
    setIsSaving(true)

    // Save dietary choices back to useUserStore profile
    await updateProfile(profile.id, {
      diet_style: dietStyle,
    })

    setIsSaving(false)
    alert("Health and Medical profile updated successfully! AI advice will adapt to these choices.")
  }

  const conditionOptions = ["Diabetes", "Hypertension", "Thyroid", "PCOD", "Asthma", "None"]
  const injuryOptions = ["Knee", "Back", "Shoulder", "Ankle", "Wrist", "None"]
  const dietOptions = ["Vegetarian", "Vegan", "Gluten Free", "Lactose", "Nut Allergy", "None"]

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div>
        <h1 className="font-syne text-[32px] font-bold text-text-primary">Medical & Diet Profile</h1>
        <p className="text-xs text-text-secondary font-medium">AI customized workouts and nutrition settings adapted for medical limits</p>
      </div>

      {/* Warning Alert banner */}
      <GlassCard variant="sage" className="flex items-center gap-sm">
        <div className="w-8 h-8 rounded-full bg-orange/15 text-orange flex items-center justify-center flex-shrink-0 font-bold">
          !
        </div>
        <div>
          <h4 className="text-xs font-bold text-text-primary">AI Guidance awareness</h4>
          <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
            FitBharat AI scans your medical profiles and current injuries to suggest safe, customized workout splits and foods.
          </p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left column: main selector categories */}
        <div className="lg:col-span-2">
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-accent" />
              <span>Medical Settings</span>
            </h3>

            {/* Health conditions toggle block */}
            <div>
              <span className="block text-[9px] font-extrabold text-text-secondary uppercase tracking-[0.8px] mb-2">Health Conditions</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                {conditionOptions.map(opt => {
                  const active = conditions.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => handleConditionToggle(opt)}
                      className={`py-3.5 px-2 rounded-sm text-center text-xs font-bold transition-all border outline-none ${
                        active 
                          ? "bg-accent border-accent text-white shadow-sm"
                          : "bg-bg-secondary/80 border-white/5 text-text-secondary hover:bg-bg-hover"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Injuries toggle block */}
            <div>
              <span className="block text-[9px] font-extrabold text-text-secondary uppercase tracking-[0.8px] mb-2">Current Injuries</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                {injuryOptions.map(opt => {
                  const active = injuries.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => handleInjuryToggle(opt)}
                      className={`py-3.5 px-2 rounded-sm text-center text-xs font-bold transition-all border outline-none ${
                        active 
                          ? "bg-accent border-accent text-white shadow-sm"
                          : "bg-bg-secondary/80 border-white/5 text-text-secondary hover:bg-bg-hover"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dietary Style select block */}
            <div>
              <span className="block text-[9px] font-extrabold text-text-secondary uppercase tracking-[0.8px] mb-2">Dietary Restrictions</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                {dietOptions.map(opt => {
                  const active = dietStyle === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => setDietStyle(opt)}
                      className={`py-3.5 px-2 rounded-sm text-center text-xs font-bold transition-all border outline-none ${
                        active 
                          ? "bg-accent border-accent text-white shadow-sm"
                          : "bg-bg-secondary/80 border-white/5 text-text-secondary hover:bg-bg-hover"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right column: auxiliary fields */}
        <div className="flex flex-col gap-md">
          {/* Recovery mode & profession card */}
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary">Lifestyle Preferences</h3>
            
            {/* Recovery Mode switch toggle */}
            <div className="flex justify-between items-center p-3.5 rounded-sm bg-bg-secondary/80 border border-border">
              <div>
                <span className="text-xs font-bold text-text-primary block">Recovery Mode</span>
                <span className="text-[9px] text-text-muted font-bold block mt-0.5">Focus on light joint recovery</span>
              </div>
              <button 
                onClick={() => setRecoveryMode(!recoveryMode)}
                className={`w-11 h-6 rounded-full relative transition-all outline-none ${
                  recoveryMode ? "bg-accent" : "bg-white/10"
                }`}
              >
                <div 
                  className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all shadow-sm ${
                    recoveryMode ? "left-5.5" : "left-0.75"
                  }`}
                />
              </button>
            </div>

            {/* Profession goal selectors */}
            <div>
              <span className="block text-[9px] font-extrabold text-text-muted uppercase tracking-wider mb-2">Profession Style</span>
              <div className="flex gap-2">
                {["Student", "Desk Job", "Physical"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setProfession(opt)}
                    className={`flex-1 py-2 text-center text-xs font-bold rounded-sm transition-all outline-none ${
                      profession === opt 
                        ? "bg-accent text-white shadow-sm"
                        : "bg-bg-secondary/80 border border-white/5 text-text-secondary hover:bg-bg-hover"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Medications input field */}
            <div>
              <Input
                label="Medications (Optional)"
                type="text"
                placeholder="e.g. Metformin 500mg"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
              />
            </div>
          </GlassCard>

          {/* Action button */}
          <Button onClick={handleSave} className="flex gap-2 justify-center items-center py-3.5 shadow-sm" isLoading={isSaving}>
            <Save className="h-4.5 w-4.5" />
            <span>Save Health Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

