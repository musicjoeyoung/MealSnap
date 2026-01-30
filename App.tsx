import { DraftMealEntry, MealEntry } from './src/models/meal';

import HistoryScreen from './src/screens/HistoryScreen';
import MealDetailScreen from './src/screens/MealDetailScreen';
import MealEditorScreen from './src/screens/MealEditorScreen';
import { MealProvider } from './src/state/MealProvider';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import TodayScreen from './src/screens/TodayScreen';
import WeeklyScreen from './src/screens/WeeklyScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Tabs: undefined;
    MealEditor: { draft: DraftMealEntry; isNew: boolean };
    MealDetail: { meal: MealEntry };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Today" component={TodayScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Weekly" component={WeeklyScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <MealProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                    <Stack.Screen
                        name="MealEditor"
                        component={MealEditorScreen}
                        options={{ presentation: 'modal', title: 'Edit Meal' }}
                    />
                    <Stack.Screen name="MealDetail" component={MealDetailScreen} options={{ title: 'Meal' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </MealProvider>
    );
}
