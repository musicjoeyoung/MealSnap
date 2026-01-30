import { StyleSheet, Text, View } from 'react-native';

import { MacroNutrients } from '../models/meal';
import React from 'react';

type Props = { macros: MacroNutrients };

export default function MacroSummary({ macros }: Props) {
    return (
        <View style={styles.row}>
            <MacroPill label="Cal" value={macros.calories} />
            <MacroPill label="P" value={macros.protein} />
            <MacroPill label="C" value={macros.carbs} />
            <MacroPill label="F" value={macros.fat} />
        </View>
    );
}

function MacroPill({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.pill}>
            <Text style={styles.pillLabel}>{label}</Text>
            <Text style={styles.pillValue}>{Math.round(value)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    pill: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#F1F3F5',
        borderRadius: 8,
        alignItems: 'center',
    },
    pillLabel: {
        fontSize: 11,
        color: '#6B7280',
    },
    pillValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});
