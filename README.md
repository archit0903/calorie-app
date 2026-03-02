# ⚡ Caloria — Smart Calorie Tracker

A beautiful, fully functional Next.js calorie tracking app with AI-powered nutrition label scanning.

## Features

- **No login required** — just enter your stats and start tracking
- **Smart BMR calculation** using Mifflin-St Jeor formula
- **TDEE calculation** based on your activity level
- **Goal-based calorie targets** — deficit (-500 kcal), maintain, or bulk (+300 kcal)
- **50+ food database** — fruits, proteins, dairy, grains, vegetables, nuts, beverages
- **AI nutrition label scanner** — snap a photo of any nutrition facts panel
- **Macro tracking** — protein, carbs, fat with animated progress bars
- **Meal categorization** — breakfast, lunch, dinner, snack
- **BMI display** with color-coded health status
- **Persistent storage** — data saved locally across sessions
- **Dark mode** beautiful UI with lime green accent

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Environment

No environment variables needed — the Anthropic API key is handled via the built-in API proxy in the Claude artifacts environment.

**Note for production deployment:** To use the AI scanning feature in production, you'll need to add your Anthropic API key. Create a Next.js API route:

```
/app/api/scan/route.ts
```

And add to `.env.local`:
```
ANTHROPIC_API_KEY=your-key-here
```

Then update the fetch URL in `NutritionScanner.tsx` to point to `/api/scan`.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management with persistence)
- **Claude API** (nutrition label scanning)
- **Google Fonts** (Syne + DM Sans)

## Calculations

- **BMR**: Mifflin-St Jeor Equation
  - Male: `10W + 6.25H - 5A + 5`
  - Female: `10W + 6.25H - 5A - 161`
- **TDEE**: BMR × Activity Multiplier (1.2–1.9)
- **Calorie Targets**:
  - Deficit: TDEE − 500 kcal
  - Maintain: TDEE
  - Bulk: TDEE + 300 kcal
- **Macros**: 30/40/30 (P/C/F) adjusted per goal
