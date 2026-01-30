import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import MacroSummary from '../components/MacroSummary';
import { useMeals } from '../state/MealProvider';

export default function WeeklyScreen() {
    const { recentMeals } = useMeals();

    const totalMacros = useMemo(() =>
        recentMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.items.reduce((sum, item) => sum + item.macros.calories, 0),
                protein: acc.protein + meal.items.reduce((sum, item) => sum + item.macros.protein, 0),
                carbs: acc.carbs + meal.items.reduce((sum, item) => sum + item.macros.carbs, 0),
                fat: acc.fat + meal.items.reduce((sum, item) => sum + item.macros.fat, 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )
        , [recentMeals]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Weekly totals</Text>
            <Text style={styles.subtitle}>Last 14 days</Text>
            <MacroSummary macros={totalMacros} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F9FAFB',
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    subtitle: {
        color: '#6B7280',
    },
});
