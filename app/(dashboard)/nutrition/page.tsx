"use client"

import React, { useState } from "react"
import { useNutritionStore, MealLog } from "@/store/useNutritionStore"
import { useUserStore } from "@/store/useUserStore"
import { INDIAN_FOOD_DATABASE, FoodItem } from "@/constants/foods"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Plus, Trash2, Search, Sparkles } from "lucide-react"

export default function NutritionPage() {
  const profile = useUserStore((s) => s.profile)
  const meals = useNutritionStore((s) => s.meals)
  const addMeal = useNutritionStore((s) => s.addMeal)
  const deleteMeal = useNutritionStore((s) => s.deleteMeal)
  const getTotalsForDate = useNutritionStore((s) => s.getTotalsForDate)

  const [activeSlot, setActiveSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast')
  const [searchQuery, setSearchQuery] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<any | null>(null)
  
  const todayStr = new Date().toISOString().split("T")[0]
  const totals = getTotalsForDate(todayStr)
  
  const targetCalories = profile?.goal_type === "Gain Muscle" ? 2200 : 1800
  const remainingCalories = Math.max(0, targetCalories - totals.calories)

  const handleAddFoodDirect = (food: FoodItem) => {
    addMeal({
      user_id: profile?.id || "c7066f3f-a96e-4dda-9de8-914a6232fee7",
      meal_type: activeSlot,
      food_name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    })
    setSearchQuery("")
  }

  const handleAiParse = async () => {
    if (!aiPrompt) return
    setAiLoading(true)
    setAiResult(null)

    try {
      const res = await fetch("/api/parse-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      })
      const data = await res.json()
      if (data.success) {
        setAiResult(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  const handleAddParsedMeal = () => {
    if (!aiResult) return
    aiResult.items.forEach((item: any) => {
      addMeal({
        user_id: profile?.id || "c7066f3f-a96e-4dda-9de8-914a6232fee7",
        meal_type: activeSlot,
        food_name: `${item.name} (${item.quantity} ${item.unit})`,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat
      })
    })
    setAiPrompt("")
    setAiResult(null)
  }

  const filteredFoods = INDIAN_FOOD_DATABASE.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const slots: ('Breakfast' | 'Lunch' | 'Dinner' | 'Snacks')[] = [
    'Breakfast', 'Lunch', 'Dinner', 'Snacks'
  ]

  return (
    <div className="flex flex-col gap-lg">
      {/* Header section */}
      <div>
        <h1 className="font-syne text-[32px] font-bold text-text-primary">Nutrition Tracker</h1>
        <p className="text-xs text-text-secondary font-medium">Log meals using the Indian food database or parsed descriptions</p>
      </div>

      {/* Calories Overview summary card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <GlassCard variant="dark" className="lg:col-span-2 flex flex-col justify-between">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider block">Remaining Calories</span>
            <span className="font-serif text-5xl font-extrabold text-text-primary block mt-2">
              {remainingCalories}
            </span>
            <span className="text-xs text-text-muted font-medium">of {targetCalories} kcal daily target</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden my-6">
            <div 
              className="h-full bg-gradient-to-r from-accent-light to-success transition-all"
              style={{ width: `${Math.min(100, (totals.calories / targetCalories) * 100)}%` }}
            />
          </div>

          {/* Macro breakdown */}
          <div className="grid grid-cols-3 text-center border-t border-border pt-4">
            <div>
              <span className="font-serif text-lg font-bold text-text-primary block">{totals.protein}g</span>
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Protein</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-text-primary block">{totals.carbs}g</span>
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Carbs</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-text-primary block">{totals.fat}g</span>
              <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider">Fats</span>
            </div>
          </div>
        </GlassCard>

        {/* Dynamic active logging slot picker */}
        <GlassCard className="flex flex-col gap-sm">
          <h3 className="font-syne text-sm font-bold text-text-primary">Current Slot</h3>
          <div className="grid grid-cols-2 gap-sm">
            {slots.map(s => (
              <button
                key={s}
                onClick={() => setActiveSlot(s)}
                className={`py-3.5 px-2 rounded-sm text-center text-xs font-bold transition-all border outline-none ${
                  activeSlot === s 
                    ? "bg-accent border-accent text-white shadow-sm"
                    : "bg-bg-secondary/80 border-white/5 text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Main logging grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left column: list of logged meals */}
        <div className="lg:col-span-2 flex flex-col gap-sm">
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary">Today's Meals</h3>

            <div className="flex flex-col gap-sm">
              {slots.map(slot => {
                const slotMeals = meals.filter(m => m.meal_type === slot && m.logged_at === todayStr)
                return (
                  <div key={slot} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider mb-2 block">
                      {slot}
                    </span>

                    {slotMeals.length > 0 ? (
                      <div className="flex flex-col gap-xs">
                        {slotMeals.map(meal => (
                          <div key={meal.id} className="flex justify-between items-center bg-bg-secondary/80 border border-white/5 p-3 rounded-sm hover:-translate-y-0.5 transition-all">
                            <div>
                              <span className="text-xs font-bold text-text-primary block">{meal.food_name}</span>
                              <span className="text-[10px] text-text-muted font-bold block mt-0.5">
                                P: {meal.protein}g Â· C: {meal.carbs}g Â· F: {meal.fat}g
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="orange">{meal.calories} kcal</Badge>
                              <button 
                                onClick={() => deleteMeal(meal.id)}
                                className="p-1.5 text-danger hover:bg-danger/10 rounded-sm transition-all outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-text-muted font-semibold italic block pl-1">No meals logged for {slot.toLowerCase()}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right column: Search & AI parser logs */}
        <div className="flex flex-col gap-sm">
          {/* AI Parser Widget */}
          <GlassCard className="flex flex-col gap-sm border border-accent/20 bg-gradient-to-br from-[#141E18] to-accent/5">
            <div className="flex items-center gap-xs text-accent">
              <Sparkles className="h-4.5 w-4.5 fill-current" />
              <h3 className="font-syne text-sm font-bold text-text-primary">AI Meal Parser</h3>
            </div>
            <p className="text-[10px] text-text-muted font-bold">
              Describe your meal (e.g. *"I had 2 rotis with a bowl of rajma and ghee"*).
            </p>
            <div className="flex flex-col gap-sm">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Type details..."
                rows={3}
                className="w-full bg-bg-secondary/80 border border-border focus:border-accent text-text-primary rounded-sm p-3.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-accent resize-none placeholder:text-text-muted"
              />
              <Button onClick={handleAiParse} isLoading={aiLoading} className="py-2.5 text-xs">
                Parse description
              </Button>
            </div>

            {aiResult && (
              <div className="p-3.5 rounded-sm bg-bg-secondary border border-border flex flex-col gap-2">
                <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider block">Parsed Results</span>
                <div className="flex flex-col gap-1.5">
                  {aiResult.items.map((it: any, index: number) => (
                    <div key={index} className="flex justify-between text-[10px] text-text-secondary">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-bold text-orange">{it.calories} kcal</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-2 flex justify-between items-center mt-1">
                  <div>
                    <span className="text-[8px] text-text-muted block font-extrabold uppercase">Total Calories</span>
                    <span className="text-xs font-bold text-text-primary">{aiResult.totals.calories} kcal</span>
                  </div>
                  <Button size="sm" onClick={handleAddParsedMeal} className="py-1 px-3 w-auto text-[10px]">
                    Log Parsed
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Manual Food database search */}
          <GlassCard className="flex flex-col gap-sm">
            <h3 className="font-syne text-sm font-bold text-text-primary">Food Database</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search roti, rice, paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-secondary/80 border border-border rounded-sm pl-9 pr-4 py-2.5 text-xs text-text-primary outline-none focus:border-accent focus:shadow-glow transition-all"
              />
            </div>

            <div className="flex flex-col gap-xs max-h-56 overflow-y-auto pr-1">
              {filteredFoods.map((food, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-sm border border-border bg-bg-secondary/80 hover:border-accent transition-all">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">{food.name}</span>
                    <span className="text-[9px] text-text-muted font-semibold block mt-0.5">1 {food.servingUnit} Â· {food.calories} kcal</span>
                  </div>
                  <button
                    onClick={() => handleAddFoodDirect(food)}
                    className="p-1.5 rounded-lg bg-accent text-white shadow-sm outline-none"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

