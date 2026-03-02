export interface UserProfile {
  weight: number // kg
  height: number // cm
  age: number
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'deficit' | 'maintain' | 'bulk'
}

export interface FoodEntry {
  id: string
  foodId: string
  name: string
  emoji: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servings: number
  unit: string
  addedAt: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  isCustom?: boolean
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LABELS = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  very_active: 'Extremely Active',
}

export const ACTIVITY_DESCRIPTIONS = {
  sedentary: 'Little/no exercise, desk job',
  light: '1-3 days/week exercise',
  moderate: '3-5 days/week exercise',
  active: '6-7 days/week exercise',
  very_active: 'Hard exercise 2x/day',
}

export function calculateBMR(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = profile
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel])
}

export function calculateTargetCalories(profile: UserProfile): number {
  const tdee = calculateTDEE(profile)
  if (profile.goal === 'deficit') return Math.round(tdee - 500)
  if (profile.goal === 'bulk') return Math.round(tdee + 300)
  return tdee
}

export function calculateMacroTargets(targetCalories: number, goal: UserProfile['goal']) {
  // Protein: 30%, Carbs: 40%, Fat: 30% for maintain
  // Deficit: higher protein, lower carb
  // Bulk: more carbs
  let proteinPct = 0.30
  let carbPct = 0.40
  let fatPct = 0.30

  if (goal === 'deficit') {
    proteinPct = 0.35; carbPct = 0.35; fatPct = 0.30
  } else if (goal === 'bulk') {
    proteinPct = 0.25; carbPct = 0.50; fatPct = 0.25
  }

  return {
    protein: Math.round((targetCalories * proteinPct) / 4),
    carbs: Math.round((targetCalories * carbPct) / 4),
    fat: Math.round((targetCalories * fatPct) / 9),
  }
}

export function getBMI(weight: number, heightCm: number): { value: number; label: string; color: string } {
  const heightM = heightCm / 100
  const bmi = weight / (heightM * heightM)
  let label = 'Normal'
  let color = 'var(--accent)'
  if (bmi < 18.5) { label = 'Underweight'; color = 'var(--blue)' }
  else if (bmi >= 25 && bmi < 30) { label = 'Overweight'; color = 'var(--orange)' }
  else if (bmi >= 30) { label = 'Obese'; color = 'var(--red)' }
  return { value: Math.round(bmi * 10) / 10, label, color }
}

export function sumEntries(entries: FoodEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories * e.servings,
      protein: acc.protein + e.protein * e.servings,
      carbs: acc.carbs + e.carbs * e.servings,
      fat: acc.fat + e.fat * e.servings,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}
