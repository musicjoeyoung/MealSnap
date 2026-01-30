import { DraftMealEntry, MealEntry } from '../models/meal';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMealsForDay, fetchMealsRange, saveMeal } from '../db/mealStore';

import { formatDay } from '../services/date';
import { initDatabase } from '../db/schema';

type MealContextValue = {
    todayMeals: MealEntry[];
    recentMeals: MealEntry[];
    refresh: () => Promise<void>;
    save: (draft: DraftMealEntry) => Promise<void>;
};

const MealContext = createContext<MealContextValue | undefined>(undefined);

export const MealProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
    const [recentMeals, setRecentMeals] = useState<MealEntry[]>([]);

    const refresh = async () => {
        const day = formatDay(new Date().toISOString());
        const end = formatDay(new Date().toISOString());
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 13);
        const start = formatDay(startDate.toISOString());

        const today = await fetchMealsForDay(day);
        const recent = await fetchMealsRange(start, end);
        setTodayMeals(today);
        setRecentMeals(recent);
    };

    const save = async (draft: DraftMealEntry) => {
        await saveMeal(draft);
        await refresh();
    };

    useEffect(() => {
        initDatabase().then(refresh).catch(console.error);
    }, []);

    const value = useMemo(() => ({ todayMeals, recentMeals, refresh, save }), [todayMeals, recentMeals]);

    return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
};

export const useMeals = () => {
    const ctx = useContext(MealContext);
    if (!ctx) {
        throw new Error('useMeals must be used within MealProvider');
    }
    return ctx;
};
