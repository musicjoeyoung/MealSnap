import { DraftIngredient, DraftMealEntry, DraftMealItem } from '../models/meal';

import { generateId } from './id';

export type AIAnalysisResult = {
    mealTitle: string;
    notes: string;
    items: {
        name: string;
        portion: string;
        macros: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        ingredients: { name: string; amount: number; unit: string }[];
        confidence?: { low: number; high: number } | null;
    }[];
    aiDerived: boolean;
};

const BASE_URL = 'https://your-worker-url.example.com';

export const analyzeMealPhoto = async (imageBase64: string): Promise<DraftMealEntry> => {
    const response = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imageBase64,
            imageMimeType: 'image/jpeg',
            models: {
                vision: '@cf/llava-hf/llava-1.5-7b-hf',
                reasoning: '@cf/meta/llama-3.1-8b-instruct',
            },
        }),
    });

    if (!response.ok) {
        throw new Error('AI analysis failed');
    }

    const result: AIAnalysisResult = await response.json();
    return {
        id: generateId(),
        date: new Date().toISOString(),
        title: result.mealTitle || 'Meal',
        notes: result.notes,
        aiDerived: true,
        items: result.items.map((item): DraftMealItem => ({
            id: generateId(),
            name: item.name,
            portion: item.portion,
            macros: item.macros,
            ingredients: item.ingredients.map(
                (ingredient): DraftIngredient => ({
                    id: generateId(),
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    aiDerived: true,
                })
            ),
            aiDerived: true,
            confidence: item.confidence ?? null,
        })),
    };
};
