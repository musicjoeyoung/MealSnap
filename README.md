# MealSnap (Expo + TypeScript)

Expo (React Native) starter for a meal photo → AI estimate → editable log → nutrition tracking flow.

## What’s included

- Expo TypeScript app with tabs: Today, History, Weekly.
- Local SQLite storage (normalized tables for meals, meal_items, ingredients).
- AI service client calling a Cloudflare Worker endpoint.
- Editable AI-derived values with confidence ranges.

## App structure

- App.tsx – navigation and provider
- src/screens – UI screens
- src/models – domain models
- src/db – SQLite schema and store
- src/services – AI and date helpers
- src/state – app state provider

## Cloudflare AI integration

The app calls a backend endpoint at /analyze. This should be a Cloudflare Worker that uses Workers AI models (for example @cf/llava-hf/llava-1.5-7b-hf for vision and @cf/meta/llama-3.1-8b-instruct for reasoning). The mobile client never stores API secrets.

Update the base URL in src/services/aiService.ts.

## Worker

Backend source lives in worker/src/index.ts with wrangler.toml in worker/. Deploy it and point the mobile app to the Worker URL.

## JSON response shape expected from /analyze

```
{
  "mealTitle": "Chicken Bowl",
  "notes": "Estimated values",
  "aiDerived": true,
  "items": [
    {
      "name": "Grilled chicken",
      "portion": "150 g",
      "macros": { "calories": 250, "protein": 35, "carbs": 0, "fat": 8 },
      "ingredients": [{ "name": "Chicken breast", "amount": 150, "unit": "g" }],
      "confidence": { "low": 0.55, "high": 0.8 }
    }
  ]
}
```
