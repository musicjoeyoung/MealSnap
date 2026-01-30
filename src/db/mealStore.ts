import {
    DraftIngredient,
    DraftMealEntry,
    DraftMealItem,
    Ingredient,
    MealEntry,
    MealItem,
} from '../models/meal';
import { formatDay, nowIso } from '../services/date';

import { executeSql } from './sqlite';

export const saveMeal = async (draft: DraftMealEntry) => {
    const now = nowIso();
    const day = formatDay(draft.date);

    await executeSql(
        `INSERT OR REPLACE INTO meals (id, date, title, notes, ai_derived, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL);`,
        [draft.id, day, draft.title, draft.notes, draft.aiDerived ? 1 : 0, now, now]
    );

    await softDeleteItems(draft.id);

    for (const item of draft.items) {
        await insertItem(draft.id, item, now);
    }
};

const softDeleteItems = async (mealId: string) => {
    const now = nowIso();
    await executeSql(`UPDATE meal_items SET deleted_at = ? WHERE meal_id = ? AND deleted_at IS NULL;`, [
        now,
        mealId,
    ]);

    await executeSql(
        `UPDATE ingredients SET deleted_at = ?
     WHERE meal_item_id IN (SELECT id FROM meal_items WHERE meal_id = ?);`,
        [now, mealId]
    );
};

const insertItem = async (mealId: string, item: DraftMealItem, now: string) => {
    await executeSql(
        `INSERT OR REPLACE INTO meal_items
     (id, meal_id, name, portion, calories, protein, carbs, fat, ai_derived, confidence_low, confidence_high, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL);`,
        [
            item.id,
            mealId,
            item.name,
            item.portion,
            item.macros.calories,
            item.macros.protein,
            item.macros.carbs,
            item.macros.fat,
            item.aiDerived ? 1 : 0,
            item.confidence?.low ?? null,
            item.confidence?.high ?? null,
            now,
            now,
        ]
    );

    for (const ingredient of item.ingredients) {
        await insertIngredient(item.id, ingredient, now);
    }
};

const insertIngredient = async (itemId: string, ingredient: DraftIngredient, now: string) => {
    await executeSql(
        `INSERT OR REPLACE INTO ingredients
     (id, meal_item_id, name, amount, unit, ai_derived, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL);`,
        [
            ingredient.id,
            itemId,
            ingredient.name,
            ingredient.amount,
            ingredient.unit,
            ingredient.aiDerived ? 1 : 0,
            now,
            now,
        ]
    );
};

export const fetchMealsForDay = async (dayIso: string): Promise<MealEntry[]> => {
    const results = await executeSql(
        `SELECT id, date, title, notes, ai_derived, created_at, updated_at, deleted_at
     FROM meals WHERE date = ? AND deleted_at IS NULL ORDER BY created_at DESC;`,
        [dayIso]
    );

    const meals = mapMealRows(results.rows._array);
    return attachItems(meals);
};

export const fetchMealsRange = async (start: string, end: string): Promise<MealEntry[]> => {
    const results = await executeSql(
        `SELECT id, date, title, notes, ai_derived, created_at, updated_at, deleted_at
     FROM meals WHERE date >= ? AND date <= ? AND deleted_at IS NULL
     ORDER BY date DESC, created_at DESC;`,
        [start, end]
    );

    const meals = mapMealRows(results.rows._array);
    return attachItems(meals);
};

const mapMealRows = (rows: any[]): MealEntry[] =>
    rows.map((row) => ({
        id: row.id,
        date: row.date,
        title: row.title,
        notes: row.notes,
        aiDerived: row.ai_derived === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        deletedAt: row.deleted_at,
        items: [],
    }));

const attachItems = async (meals: MealEntry[]) => {
    const result: MealEntry[] = [];
    for (const meal of meals) {
        const items = await fetchItems(meal.id);
        result.push({ ...meal, items });
    }
    return result;
};

const fetchItems = async (mealId: string): Promise<MealItem[]> => {
    const results = await executeSql(
        `SELECT id, name, portion, calories, protein, carbs, fat, ai_derived, confidence_low, confidence_high
     FROM meal_items WHERE meal_id = ? AND deleted_at IS NULL ORDER BY created_at ASC;`,
        [mealId]
    );

    const items: MealItem[] = [];
    for (const row of results.rows._array) {
        const ingredients = await fetchIngredients(row.id);
        items.push({
            id: row.id,
            mealId,
            name: row.name,
            portion: row.portion,
            macros: {
                calories: row.calories,
                protein: row.protein,
                carbs: row.carbs,
                fat: row.fat,
            },
            aiDerived: row.ai_derived === 1,
            confidence:
                row.confidence_low !== null && row.confidence_high !== null
                    ? { low: row.confidence_low, high: row.confidence_high }
                    : null,
            ingredients,
        });
    }

    return items;
};

const fetchIngredients = async (itemId: string): Promise<Ingredient[]> => {
    const results = await executeSql(
        `SELECT id, name, amount, unit, ai_derived
     FROM ingredients WHERE meal_item_id = ? AND deleted_at IS NULL ORDER BY created_at ASC;`,
        [itemId]
    );

    return results.rows._array.map((row) => ({
        id: row.id,
        mealItemId: itemId,
        name: row.name,
        amount: row.amount,
        unit: row.unit,
        aiDerived: row.ai_derived === 1,
    }));
};
