import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MacroSummary from '../components/MacroSummary';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import { useMeals } from '../state/MealProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Tabs'>;

export default function HistoryScreen({ navigation }: Props) {
    const { recentMeals } = useMeals();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>History</Text>
            {recentMeals.length === 0 ? (
                <Text style={styles.muted}>No meals yet.</Text>
            ) : (
                recentMeals.map((meal) => (
                    <TouchableOpacity
                        key={meal.id}
                        style={styles.card}
                        onPress={() => navigation.navigate('MealDetail', { meal })}
                    >
                        <Text style={styles.mealTitle}>{meal.title}</Text>
                        <Text style={styles.muted}>{meal.date}</Text>
                        <MacroSummary
                            macros={meal.items.reduce(
                                (acc, item) => ({
                                    calories: acc.calories + item.macros.calories,
                                    protein: acc.protein + item.macros.protein,
                                    carbs: acc.carbs + item.macros.carbs,
                                    fat: acc.fat + item.macros.fat,
                                }),
                                { calories: 0, protein: 0, carbs: 0, fat: 0 }
                            )}
                        />
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#F9FAFB',
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    muted: {
        color: '#6B7280',
    },
});
