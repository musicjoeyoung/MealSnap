import { generateId } from '../services/id';

export type MacroNutrients = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

export type ConfidenceRange = {
    low: number;
    high: number;
};

export type Ingredient = {
    id: string;
    mealItemId: string;
    name: string;
    amount: number;
    unit: string;
    aiDerived: boolean;
};

export type MealItem = {
    id: string;
    mealId: string;
    name: string;
    portion: string;
    macros: MacroNutrients;
    ingredients: Ingredient[];
    aiDerived: boolean;
    confidence?: ConfidenceRange | null;
};

export type MealEntry = {
    id: string;
    date: string;
    title: string;
    notes: string;
    items: MealItem[];
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    aiDerived: boolean;
};

export type DraftIngredient = {
    id: string;
    name: string;
    amount: number;
    unit: string;
    aiDerived: boolean;
};

export type DraftMealItem = {
    id: string;
    name: string;
    portion: string;
    macros: MacroNutrients;
    ingredients: DraftIngredient[];
    aiDerived: boolean;
    confidence?: ConfidenceRange | null;
};

export type DraftMealEntry = {
    id: string;
    date: string;
    title: string;
    notes: string;
    items: DraftMealItem[];
    aiDerived: boolean;
};

export const emptyMacros = (): MacroNutrients => ({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
});

export const createEmptyDraftMeal = (): DraftMealEntry => ({
    id: generateId(),
    date: new Date().toISOString(),
    title: 'Meal',
    notes: '',
    items: [],
    aiDerived: false,
});

export const createEmptyDraftItem = (): DraftMealItem => ({
    id: generateId(),
    name: '',
    portion: '',
    macros: emptyMacros(),
    ingredients: [],
    aiDerived: false,
    confidence: null,
});

export const createEmptyDraftIngredient = (): DraftIngredient => ({
    id: generateId(),
    name: '',
    amount: 0,
    unit: '',
    aiDerived: false,
});
