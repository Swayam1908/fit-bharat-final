export interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingUnit: string
}

export const INDIAN_FOOD_DATABASE: FoodItem[] = [
  { name: "Roti", calories: 85, protein: 3, carbs: 18, fat: 0.5, servingUnit: "piece" },
  { name: "Chapati", calories: 85, protein: 3, carbs: 18, fat: 0.5, servingUnit: "piece" },
  { name: "Dal toor", calories: 120, protein: 7, carbs: 20, fat: 1.5, servingUnit: "bowl" },
  { name: "Dal tadka", calories: 150, protein: 8, carbs: 22, fat: 3.5, servingUnit: "bowl" },
  { name: "Rice basmati", calories: 130, protein: 2.5, carbs: 28, fat: 0.2, servingUnit: "bowl" },
  { name: "Ghee", calories: 112, protein: 0, carbs: 0, fat: 12.7, servingUnit: "tsp" },
  { name: "Paneer butter masala", calories: 320, protein: 12, carbs: 14, fat: 26, servingUnit: "serving" },
  { name: "Paneer bhurji", calories: 250, protein: 14, carbs: 8, fat: 18, servingUnit: "serving" },
  { name: "Dosa plain", calories: 165, protein: 4, carbs: 29, fat: 3.5, servingUnit: "piece" },
  { name: "Masala dosa", calories: 280, protein: 5, carbs: 42, fat: 9.5, servingUnit: "piece" },
  { name: "Idli", calories: 58, protein: 1.6, carbs: 12, fat: 0.1, servingUnit: "piece" },
  { name: "Poha", calories: 180, protein: 3.5, carbs: 36, fat: 2.5, servingUnit: "bowl" },
  { name: "Chai tea with milk", calories: 75, protein: 1.5, carbs: 12, fat: 2.0, servingUnit: "cup" },
  { name: "Curd yogurt", calories: 60, protein: 3.2, carbs: 4.7, fat: 3.2, servingUnit: "bowl" },
  { name: "Samosa", calories: 252, protein: 3.5, carbs: 32, fat: 12.5, servingUnit: "piece" },
  { name: "Lassi", calories: 180, protein: 4.5, carbs: 25, fat: 6.0, servingUnit: "glass" },
  { name: "Chicken tikka", calories: 220, protein: 24, carbs: 4, fat: 12, servingUnit: "serving" },
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, servingUnit: "handful" },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.3, servingUnit: "piece" },
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingUnit: "piece" }
]
