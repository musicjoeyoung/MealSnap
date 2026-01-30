import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MacroSummary from '../components/MacroSummary';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'MealDetail'>;

export default function MealDetailScreen({ route, navigation }: Props) {
    const { meal } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{meal.title}</Text>
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
            {meal.aiDerived ? <Text style={styles.muted}>Estimated</Text> : null}
            {meal.notes ? <Text style={styles.notes}>{meal.notes}</Text> : null}

            {meal.items.map((item) => (
                <View key={item.id} style={styles.card}>
                    <Text style={styles.sectionTitle}>{item.name}</Text>
                    <Text style={styles.muted}>{item.portion}</Text>
                    <MacroSummary macros={item.macros} />
                    {item.confidence ? (
                        <Text style={styles.muted}>
                            Confidence {Math.round(item.confidence.low * 100)}–{Math.round(item.confidence.high * 100)}%
                        </Text>
                    ) : null}
                    {item.ingredients.length > 0 ? (
                        <View style={styles.ingredients}>
                            <Text style={styles.muted}>Ingredients</Text>
                            {item.ingredients.map((ingredient) => (
                                <Text key={ingredient.id} style={styles.ingredientItem}>
                                    • {ingredient.name} {ingredient.amount} {ingredient.unit}
                                </Text>
                            ))}
                        </View>
                    ) : null}
                </View>
            ))}

            <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                    navigation.navigate('MealEditor', {
                        draft: {
                            id: meal.id,
                            date: meal.date,
                            title: meal.title,
                            notes: meal.notes,
                            aiDerived: meal.aiDerived,
                            items: meal.items.map((item) => ({
                                id: item.id,
                                name: item.name,
                                portion: item.portion,
                                macros: item.macros,
                                aiDerived: item.aiDerived,
                                confidence: item.confidence ?? null,
                                ingredients: item.ingredients.map((ingredient) => ({
                                    id: ingredient.id,
                                    name: ingredient.name,
                                    amount: ingredient.amount,
                                    unit: ingredient.unit,
                                    aiDerived: ingredient.aiDerived,
                                })),
                            })),
                        },
                        isNew: false,
                    })
                }
            >
                <Text style={styles.editButtonText}>Edit meal</Text>
            </TouchableOpacity>
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
    notes: {
        fontSize: 14,
        color: '#374151',
    },
    muted: {
        color: '#6B7280',
        fontSize: 12,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    ingredients: {
        marginTop: 6,
    },
    ingredientItem: {
        fontSize: 12,
        color: '#374151',
    },
    editButton: {
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 6,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
