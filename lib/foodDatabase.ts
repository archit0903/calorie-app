export interface FoodItem {
  id: string
  name: string
  category: string
  emoji: string
  calories: number
  protein: number
  carbs: number
  fat: number
  unit: string
  defaultServing: number
}

export const FOOD_DATABASE: FoodItem[] = [
  // Fruits
  { id: 'banana', name: 'Banana', category: 'Fruits', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: 'medium (118g)', defaultServing: 1 },
  { id: 'apple', name: 'Apple', category: 'Fruits', emoji: '🍎', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: 'medium (182g)', defaultServing: 1 },
  { id: 'orange', name: 'Orange', category: 'Fruits', emoji: '🍊', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, unit: 'medium (131g)', defaultServing: 1 },
  { id: 'strawberries', name: 'Strawberries', category: 'Fruits', emoji: '🍓', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, unit: '100g', defaultServing: 1 },
  { id: 'blueberries', name: 'Blueberries', category: 'Fruits', emoji: '🫐', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, unit: '100g', defaultServing: 1 },
  { id: 'mango', name: 'Mango', category: 'Fruits', emoji: '🥭', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, unit: '100g', defaultServing: 1 },
  { id: 'grapes', name: 'Grapes', category: 'Fruits', emoji: '🍇', calories: 67, protein: 0.6, carbs: 17, fat: 0.4, unit: '100g', defaultServing: 1 },
  { id: 'watermelon', name: 'Watermelon', category: 'Fruits', emoji: '🍉', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, unit: '100g', defaultServing: 1 },
  { id: 'avocado', name: 'Avocado', category: 'Fruits', emoji: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15, unit: '100g', defaultServing: 1 },

  // Proteins
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'Proteins', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g', defaultServing: 1 },
  { id: 'chicken-thigh', name: 'Chicken Thigh', category: 'Proteins', emoji: '🍗', calories: 209, protein: 26, carbs: 0, fat: 11, unit: '100g', defaultServing: 1 },
  { id: 'salmon', name: 'Salmon', category: 'Proteins', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g', defaultServing: 1 },
  { id: 'tuna', name: 'Tuna (canned)', category: 'Proteins', emoji: '🐠', calories: 116, protein: 26, carbs: 0, fat: 1, unit: '100g', defaultServing: 1 },
  { id: 'egg', name: 'Egg', category: 'Proteins', emoji: '🥚', calories: 72, protein: 6, carbs: 0.4, fat: 5, unit: 'large egg (50g)', defaultServing: 1 },
  { id: 'egg-white', name: 'Egg White', category: 'Proteins', emoji: '🥚', calories: 17, protein: 3.6, carbs: 0.2, fat: 0, unit: 'large white (33g)', defaultServing: 1 },
  { id: 'beef-lean', name: 'Lean Ground Beef', category: 'Proteins', emoji: '🥩', calories: 215, protein: 26, carbs: 0, fat: 12, unit: '100g', defaultServing: 1 },
  { id: 'steak', name: 'Sirloin Steak', category: 'Proteins', emoji: '🥩', calories: 207, protein: 26, carbs: 0, fat: 11, unit: '100g', defaultServing: 1 },
  { id: 'shrimp', name: 'Shrimp', category: 'Proteins', emoji: '🦐', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, unit: '100g', defaultServing: 1 },
  { id: 'turkey-breast', name: 'Turkey Breast', category: 'Proteins', emoji: '🦃', calories: 135, protein: 30, carbs: 0, fat: 1, unit: '100g', defaultServing: 1 },

  // Dairy & Eggs
  { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'Dairy', emoji: '🥛', calories: 100, protein: 17, carbs: 6, fat: 0.7, unit: '170g serving', defaultServing: 1 },
  { id: 'milk-whole', name: 'Whole Milk', category: 'Dairy', emoji: '🥛', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, unit: '100ml', defaultServing: 2 },
  { id: 'milk-skim', name: 'Skim Milk', category: 'Dairy', emoji: '🥛', calories: 35, protein: 3.4, carbs: 5, fat: 0.2, unit: '100ml', defaultServing: 2 },
  { id: 'cheese-cheddar', name: 'Cheddar Cheese', category: 'Dairy', emoji: '🧀', calories: 403, protein: 25, carbs: 1.3, fat: 33, unit: '100g', defaultServing: 0.3 },
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'Dairy', emoji: '🧀', calories: 206, protein: 25, carbs: 6, fat: 9, unit: 'cup (226g)', defaultServing: 1 },
  { id: 'mozzarella', name: 'Mozzarella', category: 'Dairy', emoji: '🧀', calories: 280, protein: 28, carbs: 2.2, fat: 17, unit: '100g', defaultServing: 0.5 },

  // Grains & Carbs
  { id: 'white-rice', name: 'White Rice', category: 'Grains', emoji: '🍚', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, unit: 'cooked cup (186g)', defaultServing: 1 },
  { id: 'brown-rice', name: 'Brown Rice', category: 'Grains', emoji: '🍚', calories: 216, protein: 5, carbs: 45, fat: 1.8, unit: 'cooked cup (195g)', defaultServing: 1 },
  { id: 'oats', name: 'Rolled Oats', category: 'Grains', emoji: '🌾', calories: 389, protein: 17, carbs: 66, fat: 7, unit: '100g dry', defaultServing: 0.5 },
  { id: 'bread-white', name: 'White Bread', category: 'Grains', emoji: '🍞', calories: 79, protein: 2.7, carbs: 15, fat: 1, unit: 'slice (30g)', defaultServing: 2 },
  { id: 'bread-whole', name: 'Whole Wheat Bread', category: 'Grains', emoji: '🍞', calories: 69, protein: 3.6, carbs: 12, fat: 1, unit: 'slice (28g)', defaultServing: 2 },
  { id: 'pasta', name: 'Pasta', category: 'Grains', emoji: '🍝', calories: 220, protein: 8, carbs: 43, fat: 1.3, unit: 'cooked cup (140g)', defaultServing: 1 },
  { id: 'quinoa', name: 'Quinoa', category: 'Grains', emoji: '🌱', calories: 222, protein: 8.1, carbs: 39, fat: 3.6, unit: 'cooked cup (185g)', defaultServing: 1 },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'Grains', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, unit: '100g', defaultServing: 1 },

  // Vegetables
  { id: 'broccoli', name: 'Broccoli', category: 'Vegetables', emoji: '🥦', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: '100g', defaultServing: 1.5 },
  { id: 'spinach', name: 'Spinach', category: 'Vegetables', emoji: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, unit: '100g', defaultServing: 1 },
  { id: 'carrot', name: 'Carrot', category: 'Vegetables', emoji: '🥕', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, unit: '100g', defaultServing: 1 },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', emoji: '🍅', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, unit: '100g', defaultServing: 1 },
  { id: 'cucumber', name: 'Cucumber', category: 'Vegetables', emoji: '🥒', calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, unit: '100g', defaultServing: 1 },
  { id: 'bell-pepper', name: 'Bell Pepper', category: 'Vegetables', emoji: '🫑', calories: 31, protein: 1, carbs: 7, fat: 0.3, unit: '100g', defaultServing: 1 },

  // Nuts & Seeds
  { id: 'almonds', name: 'Almonds', category: 'Nuts & Seeds', emoji: '🫘', calories: 579, protein: 21, carbs: 22, fat: 50, unit: '100g', defaultServing: 0.3 },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'Nuts & Seeds', emoji: '🥜', calories: 190, protein: 8, carbs: 6, fat: 16, unit: '2 tbsp (32g)', defaultServing: 1 },
  { id: 'walnuts', name: 'Walnuts', category: 'Nuts & Seeds', emoji: '🫘', calories: 654, protein: 15, carbs: 14, fat: 65, unit: '100g', defaultServing: 0.3 },
  { id: 'chia-seeds', name: 'Chia Seeds', category: 'Nuts & Seeds', emoji: '🌱', calories: 486, protein: 17, carbs: 42, fat: 31, unit: '100g', defaultServing: 0.3 },

  // Beverages
  { id: 'whole-milk-latte', name: 'Latte (whole milk)', category: 'Beverages', emoji: '☕', calories: 190, protein: 11, carbs: 15, fat: 9, unit: '16oz', defaultServing: 1 },
  { id: 'orange-juice', name: 'Orange Juice', category: 'Beverages', emoji: '🍊', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, unit: 'cup (248ml)', defaultServing: 1 },
  { id: 'protein-shake', name: 'Protein Shake', category: 'Beverages', emoji: '🥤', calories: 120, protein: 25, carbs: 5, fat: 1.5, unit: 'scoop (30g)', defaultServing: 1 },

  // Snacks
  { id: 'dark-chocolate', name: 'Dark Chocolate', category: 'Snacks', emoji: '🍫', calories: 546, protein: 5, carbs: 60, fat: 31, unit: '100g', defaultServing: 0.3 },
  { id: 'chips', name: 'Potato Chips', category: 'Snacks', emoji: '🥔', calories: 536, protein: 7, carbs: 53, fat: 35, unit: '100g', defaultServing: 0.3 },
]

export const FOOD_CATEGORIES = Array.from(new Set(FOOD_DATABASE.map(f => f.category)))

export function searchFoods(query: string): FoodItem[] {
  if (!query || query.length < 1) return FOOD_DATABASE.slice(0, 12)
  const q = query.toLowerCase()
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  ).slice(0, 15)
}
