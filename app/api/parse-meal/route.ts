export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { INDIAN_FOOD_DATABASE } from "@/constants/foods"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid text prompt provided" }, { status: 400 })
    }

    const text = prompt.toLowerCase()
    const parsedItems: any[] = []

    // Numbers translation
    const numberWords: { [key: string]: number } = {
      one: 1, a: 1, an: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
    }

    // Split text into components based on separator words like "and", "with", ",", "+"
    const clauses = text.split(/\band\b|\bwith\b|,|\+/g)

    clauses.forEach((clause) => {
      // Find numbers/quantities
      let qty = 1
      const words = clause.trim().split(/\s+/)
      
      // Match direct numbers or text numbers
      for (const w of words) {
        const num = parseFloat(w)
        if (!isNaN(num)) {
          qty = num
          break
        }
        if (numberWords[w] !== undefined) {
          qty = numberWords[w]
          break
        }
      }

      // Search database for food matches
      for (const food of INDIAN_FOOD_DATABASE) {
        const foodNameLower = food.name.toLowerCase()
        // If the food name or its main keyword matches words in this clause
        const foodWords = foodNameLower.split(" ")
        const match = foodWords.some(fw => clause.includes(fw))

        if (match) {
          // Verify we don't double add the same exact food in the same clause
          const alreadyAdded = parsedItems.some(item => item.name === food.name)
          if (!alreadyAdded) {
            parsedItems.push({
              name: food.name,
              calories: Math.round(food.calories * qty),
              protein: Number((food.protein * qty).toFixed(1)),
              carbs: Math.round(food.carbs * qty),
              fat: Number((food.fat * qty).toFixed(1)),
              quantity: qty,
              unit: food.servingUnit
            })
            break
          }
        }
      }
    })

    // Compute totals
    const totals = parsedItems.reduce(
      (acc, item) => {
        acc.calories += item.calories
        acc.protein += item.protein
        acc.carbs += item.carbs
        acc.fat += item.fat
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    return NextResponse.json({
      success: true,
      items: parsedItems,
      totals: {
        calories: Math.round(totals.calories),
        protein: Number(totals.protein.toFixed(1)),
        carbs: Math.round(totals.carbs),
        fat: Number(totals.fat.toFixed(1))
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to parse meal" }, { status: 500 })
  }
}

