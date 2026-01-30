import { DraftIngredient, createEmptyDraftIngredient } from '../models/meal';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import React from 'react';

type Props = {
    ingredients: DraftIngredient[];
    onChange: (ingredients: DraftIngredient[]) => void;
};

export default function IngredientEditor({ ingredients, onChange }: Props) {
    const addIngredient = () => onChange([...ingredients, createEmptyDraftIngredient()]);
    const updateIngredient = (index: number, next: DraftIngredient) => {
        const updated = [...ingredients];
        updated[index] = next;
        onChange(updated);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
                <View key={ingredient.id} style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.name]}
                        placeholder="Name"
                        value={ingredient.name}
                        onChangeText={(text) => updateIngredient(index, { ...ingredient, name: text })}
                    />
                    <TextInput
                        style={[styles.input, styles.amount]}
                        placeholder="Amt"
                        keyboardType="decimal-pad"
                        value={`${ingredient.amount}`}
                        onChangeText={(text) =>
                            updateIngredient(index, { ...ingredient, amount: Number(text) || 0 })
                        }
                    />
                    <TextInput
                        style={[styles.input, styles.unit]}
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChangeText={(text) => updateIngredient(index, { ...ingredient, unit: text })}
                    />
                </View>
            ))}
            <TouchableOpacity onPress={addIngredient}>
                <Text style={styles.add}>+ Add ingredient</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    title: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 12,
    },
    name: {
        flex: 2,
    },
    amount: {
        flex: 1,
    },
    unit: {
        flex: 1,
    },
    add: {
        color: '#2563EB',
        fontSize: 12,
        marginTop: 4,
    },
});
