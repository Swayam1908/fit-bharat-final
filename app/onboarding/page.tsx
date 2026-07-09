"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowRight, ArrowLeft } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { useUserStore } from "@/store/useUserStore"
import { useGardenStore } from "@/store/useGardenStore"

export default function OnboardingPage() {
  const router = useRouter()
  const createProfile = useUserStore((s) => s.createProfile)
  const fetchGarden = useGardenStore((s) => s.fetchGardenState)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    age: 20,
    gender: "Male",
    height: 175,
    weight: 68.5,
    targetWeight: 63.0,
    goalType: "Lose Weight",
    activityLevel: "Moderately Active",
    dietStyle: "Vegetarian",
    waterTarget: 3.0,
    sleepTarget: 8.0,
    workoutLocation: "Gym",
  })

  useEffect(() => {
    const savedName = localStorage.getItem("fitbharat_register_name") || ""
    if (savedName) {
      setFormData((prev) => ({ ...prev, name: savedName }))
    }
  }, [])

  const nextStep = () => setStep((s) => Math.min(3, s + 1))
  const prevStep = () => setStep((s) => Math.max(1, s - 1))

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const bmr = 
      formData.gender === "Male"
        ? 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
        : 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161
    
    let multiplier = 1.375
    if (formData.activityLevel === "Moderately Active") multiplier = 1.55
    if (formData.activityLevel === "Very Active") multiplier = 1.725
    
    let calorieTarget = Math.round(bmr * multiplier)
    
    if (formData.goalType === "Lose Weight") {
      calorieTarget -= 500
    } else if (formData.goalType === "Gain Muscle") {
      calorieTarget += 300
    }

    const userId = "c7066f3f-a96e-4dda-9de8-914a6232fee7"

    const profileData = {
      id: userId,
      name: formData.name || "Swayam Gurjar",
      email: localStorage.getItem("fitbharat_register_email") || "swayam@gmail.com",
      age: Number(formData.age),
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      target_weight: Number(formData.targetWeight),
      goal_type: formData.goalType,
      activity_level: formData.activityLevel,
      diet_style: formData.dietStyle,
      water_target: Number(formData.waterTarget),
      sleep_target: Number(formData.sleepTarget),
    }

    await createProfile(profileData)
    await fetchGarden(userId)

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-md">
      <div className="w-full max-w-lg">
        <GlassCard variant="elevated" noHover>
          {/* Header Progress indicator */}
          <div className="mb-lg">
            <div className="flex justify-between items-center mb-sm">
              <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">Step {step} of 3</span>
              <div className="w-8 h-8 rounded-sm bg-accent/10 flex items-center justify-center text-accent">
                <Heart className="h-4.5 w-4.5 fill-current" />
              </div>
            </div>
            <div className="w-full h-2 bg-accent/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-accent-dark transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="flex flex-col gap-md"
                >
                  <div>
                    <h2 className="font-syne text-[24px] font-bold text-text-primary mb-1">Goals & Body Stats</h2>
                    <p className="text-xs text-text-secondary font-bold">Help us customize your fitness requirements.</p>
                  </div>

                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Swayam Gurjar"
                    required
                  />

                  <div className="grid grid-cols-2 gap-md">
                    <Input
                      label="Age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                    />
                    <Select
                      label="Gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Non-binary", label: "Non-binary" }
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-md">
                    <Input
                      label="Height (cm)"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      required
                    />
                    <Input
                      label="Weight (kg)"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      required
                    />
                    <Input
                      label="Target (kg)"
                      type="number"
                      value={formData.targetWeight}
                      onChange={(e) => handleInputChange("targetWeight", e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-xs justify-end mt-sm">
                    <Button onClick={nextStep} className="flex gap-xs justify-center items-center w-auto">
                      <span>Next Step</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="flex flex-col gap-md"
                >
                  <div>
                    <h2 className="font-syne text-[24px] font-bold text-text-primary mb-1">Workout Preferences</h2>
                    <p className="text-xs text-text-secondary font-bold">Define how and where you want to train.</p>
                  </div>

                  <Select
                    label="Primary Fitness Goal"
                    value={formData.goalType}
                    onChange={(e) => handleInputChange("goalType", e.target.value)}
                    options={[
                      { value: "Lose Weight", label: "Lose Weight & Fat" },
                      { value: "Gain Muscle", label: "Build Muscle & Strength" },
                      { value: "Stay Fit", label: "Stay Fit & Healthy" }
                    ]}
                  />

                  <Select
                    label="Workout Location"
                    value={formData.workoutLocation}
                    onChange={(e) => handleInputChange("workoutLocation", e.target.value)}
                    options={[
                      { value: "Gym", label: "Commercial Gym" },
                      { value: "Home", label: "Home Workouts (Bodyweight/Band)" }
                    ]}
                  />

                  <Select
                    label="Activity Level"
                    value={formData.activityLevel}
                    onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                    options={[
                      { value: "Sedentary", label: "Sedentary (Desk job / minimal movement)" },
                      { value: "Lightly Active", label: "Lightly Active (Light exercise 1-3 days/week)" },
                      { value: "Moderately Active", label: "Moderately Active (Moderate exercise 3-5 days/week)" },
                      { value: "Very Active", label: "Very Active (Hard exercise 6-7 days/week)" }
                    ]}
                  />

                  <div className="flex gap-xs justify-between mt-sm">
                    <Button variant="outline" onClick={prevStep} className="flex gap-xs justify-center items-center w-auto">
                      <ArrowLeft className="h-4.5 w-4.5" />
                      <span>Back</span>
                    </Button>
                    <Button onClick={nextStep} className="flex gap-xs justify-center items-center w-auto">
                      <span>Next Step</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="flex flex-col gap-md"
                >
                  <div>
                    <h2 className="font-syne text-[24px] font-bold text-text-primary mb-1">Nutrition & Lifestyle</h2>
                    <p className="text-xs text-text-secondary font-bold">Setup daily hydration and rest goals.</p>
                  </div>

                  <Select
                    label="Dietary Style"
                    value={formData.dietStyle}
                    onChange={(e) => handleInputChange("dietStyle", e.target.value)}
                    options={[
                      { value: "Vegetarian", label: "Vegetarian (Veg Only)" },
                      { value: "Vegan", label: "Vegan (No animal products)" },
                      { value: "Eggitarian", label: "Eggitarian (Veg + Eggs)" },
                      { value: "Non-Vegetarian", label: "Non-Vegetarian" }
                    ]}
                  />

                  <div className="grid grid-cols-2 gap-md">
                    <Input
                      label="Daily Water Target (Liters)"
                      type="number"
                      step="0.5"
                      value={formData.waterTarget}
                      onChange={(e) => handleInputChange("waterTarget", e.target.value)}
                      required
                    />
                    <Input
                      label="Night Sleep Target (Hours)"
                      type="number"
                      step="0.5"
                      value={formData.sleepTarget}
                      onChange={(e) => handleInputChange("sleepTarget", e.target.value)}
                      required
                    />
                  </div>

                  <div className="p-sm rounded-sm bg-accent/5 border border-border flex gap-sm items-center">
                    <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 font-bold">
                      ★
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">Garden Initialization</h4>
                      <p className="text-[10px] text-text-secondary font-bold">This sets your starting Garden state (Seed Sprout) ready to grow.</p>
                    </div>
                  </div>

                  <div className="flex gap-xs justify-between mt-sm">
                    <Button variant="outline" onClick={prevStep} className="flex gap-xs justify-center items-center w-auto">
                      <ArrowLeft className="h-4.5 w-4.5" />
                      <span>Back</span>
                    </Button>
                    <Button type="submit" className="flex gap-xs justify-center items-center w-auto">
                      <span>Launch App</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
