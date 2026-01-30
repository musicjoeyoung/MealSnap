import { StyleSheet, Text, TextInput, View } from 'react-native';

import { MacroNutrients } from '../models/meal';
import React from 'react';

type Props = {
    macros: MacroNutrients;
    onChange: (macros: MacroNutrients) => void;
};

const toNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

export default function EditableMacroRow({ macros, onChange }: Props) {
    return (
        <View style={styles.container}>
            {(
                [
                    { key: 'calories', label: 'Calories' },
                    { key: 'protein', label: 'Protein' },
                    { key: 'carbs', label: 'Carbs' },
                    { key: 'fat', label: 'Fat' },
                ] as const
            ).map((field) => (
                <View key={field.key} style={styles.row}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="decimal-pad"
                        value={`${macros[field.key]}`}
                        onChangeText={(text) =>
                            onChange({
                                ...macros,
                                [field.key]: toNumber(text),
                            })
                        }
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#6B7280',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 90,
        textAlign: 'right',
    },
});
