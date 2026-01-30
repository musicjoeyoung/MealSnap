import { DraftMealEntry, DraftMealItem, createEmptyDraftItem } from '../models/meal';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import EditableMacroRow from '../components/EditableMacroRow';
import IngredientEditor from '../components/IngredientEditor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMeals } from '../state/MealProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'MealEditor'>;

export default function MealEditorScreen({ route, navigation }: Props) {
    const { save } = useMeals();
    const [draft, setDraft] = useState<DraftMealEntry>(route.params.draft);

    const updateItem = (index: number, item: DraftMealItem) => {
        const updated = [...draft.items];
        updated[index] = item;
        setDraft({ ...draft, items: updated });
    };

    const addItem = () => setDraft({ ...draft, items: [...draft.items, createEmptyDraftItem()] });

    const removeItem = (index: number) => {
        const updated = [...draft.items];
        updated.splice(index, 1);
        setDraft({ ...draft, items: updated });
    };

    const onSave = async () => {
        await save(draft);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Meal</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={draft.title}
                    onChangeText={(text) => setDraft({ ...draft, title: text })}
                />
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.notes]}
                    value={draft.notes}
                    multiline
                    onChangeText={(text) => setDraft({ ...draft, notes: text })}
                />
            </View>

            {draft.items.map((item, index) => (
                <View key={item.id} style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.sectionTitle}>Item {index + 1}</Text>
                        <TouchableOpacity onPress={() => removeItem(index)}>
                            <Text style={styles.delete}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Food name"
                        value={item.name}
                        onChangeText={(text) => updateItem(index, { ...item, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Portion"
                        value={item.portion}
                        onChangeText={(text) => updateItem(index, { ...item, portion: text })}
                    />
                    {item.aiDerived ? <Text style={styles.muted}>Estimated</Text> : null}
                    {item.confidence ? (
                        <Text style={styles.muted}>
                            Confidence {Math.round(item.confidence.low * 100)}–{Math.round(item.confidence.high * 100)}%
                        </Text>
                    ) : null}
                    <EditableMacroRow
                        macros={item.macros}
                        onChange={(macros) => updateItem(index, { ...item, macros })}
                    />
                    <IngredientEditor
                        ingredients={item.ingredients}
                        onChange={(ingredients) => updateItem(index, { ...item, ingredients })}
                    />
                </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addItem}>
                <Text style={styles.addButtonText}>+ Add item</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Save meal</Text>
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
    label: {
        fontSize: 12,
        color: '#6B7280',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    notes: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    muted: {
        color: '#6B7280',
        fontSize: 12,
    },
    delete: {
        color: '#DC2626',
        fontSize: 12,
    },
    addButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    addButtonText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
