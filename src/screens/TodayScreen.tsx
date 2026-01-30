import * as ImagePicker from 'expo-image-picker';

import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useMemo, useState } from 'react';

import MacroSummary from '../components/MacroSummary';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { analyzeMealPhoto } from '../services/aiService';
import { createEmptyDraftMeal } from '../models/meal';
import { useMeals } from '../state/MealProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Tabs'>;

export default function TodayScreen({ navigation }: Props) {
    const { todayMeals } = useMeals();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalMacros = useMemo(() =>
        todayMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.items.reduce((sum, item) => sum + item.macros.calories, 0),
                protein: acc.protein + meal.items.reduce((sum, item) => sum + item.macros.protein, 0),
                carbs: acc.carbs + meal.items.reduce((sum, item) => sum + item.macros.carbs, 0),
                fat: acc.fat + meal.items.reduce((sum, item) => sum + item.macros.fat, 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )
        , [todayMeals]);

    const pickImage = async () => {
        setError(null);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 ?? null);
        }
    };

    const takePhoto = async () => {
        setError(null);
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            setError('Camera permission is required to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 ?? null);
        }
    };

    const analyze = async () => {
        if (!imageBase64) return;
        setLoading(true);
        setError(null);

        try {
            const draft = await analyzeMealPhoto(imageBase64);
            navigation.navigate('MealEditor', { draft, isNew: true });
        } catch (err) {
            setError('Unable to analyze this photo right now.');
        } finally {
            setLoading(false);
        }
    };

    const startManualEntry = () => {
        navigation.navigate('MealEditor', { draft: createEmptyDraftMeal(), isNew: true });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Today</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Daily total</Text>
                <MacroSummary macros={totalMacros} />
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Meal photo</Text>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Select a meal photo</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
                    <Text style={styles.primaryButtonText}>Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                    <Text style={styles.secondaryButtonText}>Choose from library</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={analyze} disabled={loading || !imageBase64}>
                    {loading ? <ActivityIndicator /> : <Text style={styles.secondaryButtonText}>Analyze meal</Text>}
                </TouchableOpacity>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity onPress={startManualEntry}>
                    <Text style={styles.link}>Add manually</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Meals today</Text>
                {todayMeals.length === 0 ? (
                    <Text style={styles.muted}>No meals logged yet.</Text>
                ) : (
                    todayMeals.map((meal) => (
                        <TouchableOpacity
                            key={meal.id}
                            style={styles.mealRow}
                            onPress={() => navigation.navigate('MealDetail', { meal })}
                        >
                            <View>
                                <Text style={styles.mealTitle}>{meal.title}</Text>
                                {meal.aiDerived ? <Text style={styles.muted}>Estimated</Text> : null}
                            </View>
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
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
        backgroundColor: '#F9FAFB',
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 12,
    },
    placeholder: {
        height: 180,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    primaryButton: {
        backgroundColor: '#111827',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    secondaryButtonText: {
        color: '#111827',
        fontWeight: '600',
    },
    error: {
        color: '#DC2626',
        marginTop: 8,
    },
    link: {
        marginTop: 10,
        color: '#2563EB',
        fontWeight: '500',
    },
    muted: {
        color: '#6B7280',
    },
    mealRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 4,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
});
